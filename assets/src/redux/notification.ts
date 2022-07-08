import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react";
import { AxiosError } from "axios";
import _ from "lodash";
import ChannelPushError, {
  getChannelPushErrorData,
} from "src/utils/channel/ChannelPushError";
import { traverseChangesetError } from "src/utils/error";
import { AppDispatch } from "./store";

const debug = require("debug")("app:redux:Notification");

export enum NOTIF_STATE {
  TOAST = "NOTIF_TOAST",
  DUPLICATE_USER = "NOTIF_DUPLICATE_USER",
  SCREENSHARE_ERROR = "NOTIF_SCREENSHARE_ERROR",
  SCREENSHARE_USER_BLOCK = "NOTIF_SCREENSHARE_USER_BLOCK",
}

interface NotificationError {
  type: NOTIF_STATE | null;
  message: string | null;
}

interface NotificationState {
  error: NotificationError;
}

const initialState: NotificationState = {
  error: {
    type: null,
    message: null,
  },
};

const NotificationSlice = createSlice({
  name: "notif",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<NotificationError>) {
      //assuming this is better than setting the entire object as it might avoid rerender/dispatch
      state.error.type = action.payload.type;
      state.error.message = action.payload.message;
    },
  },
});

export const { setError } = NotificationSlice.actions;

export interface NotificationExtraData {
  //logAxios
  notifType?: NOTIF_STATE | null;
  recommend?: string;

  //logMessage
  toastMessage?: null | string;

  //all
  extraData?: Record<string, unknown>;
}

//basically combines Sentry.captureMessage and console.error so its in the logs and Sentry
export const logMessage =
  (message: string, argOpts: NotificationExtraData = {}) =>
  (dispatch: AppDispatch) => {
    const opts = _.defaultsDeep(argOpts, {
      toastMessage: null,
      extraData: null,
    });

    // window.message = message;
    console.error(message, argOpts.extraData);
    Sentry.captureMessage(message, { extra: opts.extraData });

    if (opts.toastMessage) {
      dispatch(
        setError({ type: NOTIF_STATE.TOAST, message: opts.toastMessage })
      );
    }
  };

export const logChannelJoinError =
  (failedChannel: string, err: Error, argOpts: NotificationExtraData = {}) =>
  (dispatch: AppDispatch) => {
    const opts = _.defaultsDeep(argOpts, {
      extraData: null,
    });

    // window.err = err;
    console.error(failedChannel, err);
    Sentry.captureException(err, { extra: opts.extraData });

    if (err.message === "DUPLICATE_USER") {
      dispatch(setError({ type: NOTIF_STATE.DUPLICATE_USER, message: null }));
    } else {
      const message = `${failedChannel} join failed${
        err.message ? " - " + err.message : ""
      }`;
      dispatch(setError({ type: NOTIF_STATE.TOAST, message }));
    }
  };

//May need to additionally Sentry.captureMessage if you want to highlight wat failed in Sentry, as this will just throw the error
export const logAxiosError =
  (err: AxiosError, failedEvent: string, argOpts: NotificationExtraData = {}) =>
  (dispatch: AppDispatch) => {
    debug("Log axios error", err, failedEvent, argOpts);
    const opts = _.defaultsDeep(argOpts, {
      recommend: "try again or contact support",
      notifType: NOTIF_STATE.TOAST,
      extraData: null,
    });

    // window.err = err;
    console.error(failedEvent, err, opts.extraData);
    Sentry.captureException(err, { extra: opts.extraData });

    if (opts.notifType == NOTIF_STATE.TOAST) {
      let recommend = opts.recommend;
      let errMsg;
      if (err.response) {
        //4xx/5xx server error
        // console.log(err.response.headers);
        if (err.response.status === 401) {
          recommend =
            "you may have logged out in a different tab and should refresh";
          errMsg = err.response.data;
        } else if (err.response.status === 422) {
          console.error("Full Err Response Data", err.response.data);
          errMsg = traverseChangesetError(err.response.data);
        } else {
          const rawData =
            err.response &&
            err.response.data &&
            JSON.stringify(err.response.data);
          //this length check handles when it returns HTML pages
          const data =
            typeof rawData === "string" && rawData.length > 255
              ? "[Long Error]"
              : rawData;

          console.error("Full Err Response Data", err.response.data);

          errMsg = `${err.response.status}: ${data}`;
        }
      } else if (err.request) {
        // request made without response
        recommend = null;
        errMsg = "Server never responded";
      } else if (err.message === "Network Error") {
        console.error("Full Err message", err.message);
        //Special error, nointernet boundary will kick them so just handle server mistakes
        errMsg = err.message && err.message.length > 255 ? "" : err.message; //this handles when it returns HTML pages
      } else {
        console.error("Full Err message", err.message);
        //something while setting up request
        errMsg = err.message && err.message.length > 255 ? "" : err.message; //this handles when it returns HTML pages
      }
      const message = `${failedEvent} failed${
        recommend ? ", " + recommend : ""
      } – ${errMsg}`;
      dispatch(setError({ type: NOTIF_STATE.TOAST, message }));
    }
  };

export const logChannelPushError =
  (
    err: ChannelPushError,
    failedEvent: string,
    argOpts: NotificationExtraData = {}
  ) =>
  (dispatch: AppDispatch) => {
    if (!err || !err.isChannelPushError) {
      Sentry.captureMessage("NonChannelPushError logged", {
        extra: { err, failedEvent },
      });
    }

    const channelData = getChannelPushErrorData(err);
    // window.err = err;
    console.error(failedEvent, err, channelData);
    Sentry.captureException(err, {
      extra: channelData,
    });

    const opts = _.defaultsDeep(argOpts, {
      recommend: "try again or contact support",
      notifType: NOTIF_STATE.TOAST,
    });

    if (opts.notifType == NOTIF_STATE.TOAST) {
      const recommend = opts.recommend;
      const errMsg = err.reason || err.message || "Unknown";
      const message = `${failedEvent} failed${
        recommend ? ", " + recommend : ""
      } – ${errMsg}`;
      dispatch(setError({ type: NOTIF_STATE.TOAST, message }));
    }
  };

export default NotificationSlice.reducer;

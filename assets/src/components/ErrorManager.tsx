import * as Sentry from "@sentry/react";
import React, { useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import IntercomButton from "src/components/IntercomButton";
import Modal from "src/components/Popup/Modal";
import UserContext from "src/contexts/UserContext";
//TODO: Is this always included? Might optimize by putting in an S3 bucket
import macScreenRecordingEnable from "src/img/mac_screen_recording_enable.gif";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { NOTIF_STATE, setError } from "src/redux/notification";
import { isFirefox, isMacOS } from "src/utils/utils";

const debug = require("debug")("app:ErrorManager");

interface ErrorManagerProps {
  children: React.ReactNode;
}

export default function ErrorManager(props: ErrorManagerProps) {
  const { logout } = useContext(UserContext);
  const toastIfWeak = useRef(true);
  //separate so if type and message don't change(duplicate doesn't cause a rerender)
  const errorType = useAppSelector((state) => state.notification.error.type);
  const errorMessage = useAppSelector(
    (state) => state.notification.error.message
  );
  const quality = useAppSelector((state) => state.callStats.quality);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (errorType || errorMessage) {
      debug("error", errorType, errorMessage);
      if (errorType === NOTIF_STATE.TOAST) {
        toast(errorMessage);

        //clear error after 5 seconds so if same error can toast for message
        const timeoutId = setTimeout(
          () => dispatch(setError({ type: null, message: null })),
          5000
        );
        return () => clearTimeout(timeoutId);
      }
    }
  }, [dispatch, errorType, errorMessage]);

  useEffect(() => {
    if (toastIfWeak.current && quality < 35) {
      Sentry.captureMessage("TEMP: toast for weak connection");
      toast("Weak internet connection detected");
      toastIfWeak.current = false;
      const timeoutId = setTimeout(() => {
        toastIfWeak.current = true;
      }, 300000); //only toast every 5 minutes
      return () => clearTimeout(timeoutId);
    }
  }, [quality]);

  let modal;
  switch (errorType) {
    case NOTIF_STATE.SCREENSHARE_ERROR:
    case NOTIF_STATE.SCREENSHARE_USER_BLOCK:
      modal = (
        <Modal
          isOpen={true}
          hideX={false}
          closeModal={() => {
            dispatch(setError({ type: null, message: null }));
          }}
          zLevel="max"
        >
          <div className="px-4 sm:px-0">
            <div className="flex items-center">
              <p className="ml-1 font-medium text-2xl ">
                We could not share your screen due to missing permissions.
              </p>
            </div>
            <p className={"mt-2.5 max-w-md leading-relaxed text-gray-700"}>
              <span>
                Please make sure your browser has permissions to share your
                screen.
              </span>
            </p>
            {isFirefox && errorType === NOTIF_STATE.SCREENSHARE_USER_BLOCK && (
              <p className={"mt-2.5 max-w-md leading-relaxed text-gray-700"}>
                <span>
                  If you blocked the screenshare window, you must refresh the
                  page to reset permissions.
                </span>
              </p>
            )}
            {isMacOS && errorType === NOTIF_STATE.SCREENSHARE_ERROR && (
              <>
                <p className={"mt-2.5 max-w-md leading-relaxed text-gray-700"}>
                  <span>
                    If you are on macOS, go to <b>System Preferences</b> &gt;{" "}
                    <b>Security & Privacy</b> &gt; Select{" "}
                    <b>Screen Recording</b> and check the box for your browser.
                  </span>
                </p>
                <div className="mt-6 max-w-lg xl:max-w-xl mx-auto">
                  <img
                    src={macScreenRecordingEnable}
                    className="w-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </>
            )}
          </div>
        </Modal>
      );
      break;
  }

  switch (errorType) {
    case NOTIF_STATE.DUPLICATE_USER:
      return (
        <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
          <div className="container flex flex-col items-center justify-center">
            <div className="text-6xl font-bold mb-6">
              Pardon the Interruption
            </div>
            <div className="text-4xl mb-4">
              Looks like you're already in this Clayboard event in another
              browser or tab. Please close any extra browsers or tabs, then
              reload this page.
            </div>
            <div className="flex items-center justify-center mt-4">
              {logout && (
                <a
                  className="text-sm text-gray-500 hover:text-gray-200 cursor-pointer"
                  onClick={() => logout(true)}
                >
                  Sign in with another account
                </a>
              )}
              <IntercomButton className="ml-3" />
            </div>
          </div>
        </div>
      );
    default:
      return (
        <>
          {modal}
          {props.children}
        </>
      );
  }
}

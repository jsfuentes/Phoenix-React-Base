import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isEqual, union } from "lodash";
import { useAppSelector } from "src/redux/hooks";
const debug = require("debug")("app:redux:presence");

interface BoardState {
  id?: string;
  owner_id?: string;
  title?: string;
  description?: string;
  activities: {
    byId: Record<number, Activity>;
    allIds: number[];
  };
  stickies: {
    byId: Record<number, Sticky>;
    allIds: number[];
  };
}

const initialState: BoardState = {
  activities: {
    byId: {},
    allIds: [],
  },
  stickies: {
    byId: {},
    allIds: [],
  },
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    updatePresence(state, action: PayloadAction<PresenceList>) {
      //recreates all the objects locally to easily handle room/table changes and user leaves/joins, but then actually check for changes before updating
      //TODO: Check updating state. only on changes is actually an optimization
      //TODO: Check that Object.keys() and the action.payload are in the same order if unchanged(does isEqual on the arrays)
      const newById: PresenceById = {};
      const newAllIds: Array<string> = [];
      debug("ACTION PAYLOAD", action.payload);

      //Recreate new objects
      for (const { metas } of action.payload) {
        let cur;
        for (const m of metas) {
          if ((!cur || cur.online_at < m.online_at) && m.id) {
            cur = m;
          }
        }
        if (!cur || !cur.id) {
          continue;
        }
        // debug("ACTION CUR", cur);

        const id = cur.id;
        if (!cur.status || cur.status.startsWith("online")) {
          continue;
        } else {
          newById[id] = cur;
          newAllIds.push(id);
        }
      }

      //Set new objects only on changes
      const allByIds = union(
        Object.keys(state.attendees.byId),
        Object.keys(newById)
      );
      for (const k of allByIds) {
        const oldM = state.attendees.byId[k];
        const newM = newById[k];
        //if either is null or ref changes(instead of checking deep equality)
        if ((oldM && oldM.phx_ref) !== (newM && newM.phx_ref)) {
          if (!newM) {
            delete state.attendees.byId[k];
          } else {
            state.attendees.byId[k] = newM;
          }
        }
      }

      if (!isEqual(newAllIds, state.attendees.allIds)) {
        state.attendees.allIds = newAllIds;
      }
    },
  },
});

export const { updatePresence } = presenceSlice.actions;

export default presenceSlice.reducer;

export function usePresenceCount() {
  const attendeeCount = useAppSelector(
    (state) => state.presence.attendees.allIds.length
  );

  return attendeeCount;
}

export function useUserPresence(uid: string) {
  const presenceInfo = useAppSelector((state) => {
    if (uid && uid in state.presence.attendees.byId) {
      return state.presence.attendees.byId[uid];
    } else {
      return null;
    }
  });

  return presenceInfo;
}

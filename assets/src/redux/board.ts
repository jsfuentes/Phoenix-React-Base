import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const debug = require("debug")("app:redux:board");

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

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    update_board(state, action: PayloadAction<BoardState>) {
      debug("updateBoard", state, action.payload);

      //TODO: Check if when there aren't any changes to some allIds list of board info that useSelector doesn't update correctly
      return action.payload;
      // state = action.payload;

      //recreates all the objects locally to easily handle room/table changes and user leaves/joins, but then actually check for changes before updating
      //TODO: Check updating state. only on changes is actually an optimization
      //TODO: Check that Object.keys() and the action.payload are in the same order if unchanged(does isEqual on the arrays)
      // // ACTIVITIES UPDATE
      // //Set new objects only on changes
      // const allActivitesByIds = union(
      //   Object.keys(state.activities.byId),
      //   Object.keys(action.payload.activities.byId)
      //   //need map for type safety, but should be unnecessary
      // ).map((aid) => (typeof aid === "string" ? parseInt(aid) : aid));

      // for (const id of allActivitesByIds) {
      //   const oldA = state.activities.byId[id];
      //   const newA = action.payload.activities.byId[id];

      //   if (!newA) {
      //     delete state.activities.byId[id];
      //   } else if (!isEqual(oldA, newA)) {
      //     state.activities.byId[id] = newA;
      //   }
      // }

      // if (!isEqual(action.payload.activities.allIds, state.activities.allIds)) {
      //   state.activities.allIds = action.payload.activities.allIds;
      // }

      // // STICKIES UPDATE
      // //Set new objects only on changes
      // const allStickiesById = union(
      //   Object.keys(state.stickies.byId),
      //   Object.keys(action.payload.stickies.byId)
      //   //need map for type safety, but should be unnecessary
      // ).map((st) => (typeof st === "string" ? parseInt(st) : st));

      // for (const id of allStickiesById) {
      //   const oldS = state.stickies.byId[id];
      //   const newS = action.payload.stickies.byId[id];

      //   if (!newS) {
      //     delete state.stickies.byId[id];
      //   } else if (!isEqual(oldS, newS)) {
      //     state.stickies.byId[id] = newS;
      //   }
      // }

      // if (!isEqual(action.payload.stickies.allIds, state.stickies.allIds)) {
      //   state.stickies.allIds = action.payload.stickies.allIds;
      // }
    },
    add_update_sticky(state, action: PayloadAction<Sticky>) {
      debug("add_update_sticky", action.payload);
      const newSticky = action.payload;
      state.stickies.byId[newSticky.id] = action.payload;
      if (!state.stickies.allIds.includes(newSticky.id)) {
        state.stickies.allIds = state.stickies.allIds.concat([newSticky.id]);
      }
    },
  },
});

export const { add_update_sticky, update_board } = boardSlice.actions;

export default boardSlice.reducer;

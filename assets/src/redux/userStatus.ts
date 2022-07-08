import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const debug = require("debug")("app:redux:userStatus");

const initialState: UserStatusState = {
  status: "online",
};

const userStatusSlice = createSlice({
  name: "userStatus",
  initialState,
  reducers: {
    updateSelf(state, action: PayloadAction<Partial<UserStatusState>>) {
      Object.entries(action.payload).map(([k, v]) => {
        //@ts-ignore TODO: I'm not sure how to generally do this with the correct types, only want to update new stuff
        if (state[k] !== v) {
          //@ts-ignore
          state[k] = v;
        }
      });
    },
  },
});

export const { updateSelf } = userStatusSlice.actions;

export default userStatusSlice.reducer;

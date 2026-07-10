import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./api";

export interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUserTeamId: (
      state,
      action: PayloadAction<{ teamId: number | null }>
    ) => {
      if (state.user) {
        state.user.teamId = action.payload.teamId ?? undefined;
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearCredentials, updateUserTeamId } = authSlice.actions;
export default authSlice.reducer;

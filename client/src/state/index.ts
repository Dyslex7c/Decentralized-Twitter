import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  avatar: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  viewedUser: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  viewedUser: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setViewedUser: (state, action: PayloadAction<{ user: User }>) => {
      state.viewedUser = action.payload.user;
    },
  },
});

export const { setUser, setViewedUser } = authSlice.actions;
export type authState = ReturnType<typeof authSlice.reducer>;
export default authSlice.reducer;

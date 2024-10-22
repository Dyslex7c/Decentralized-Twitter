import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string,
  avatar: string,
  address?: string
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
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
  },
});

export const { setUser } = authSlice.actions;
export type authState = ReturnType<typeof authSlice.reducer>;
export default authSlice.reducer;
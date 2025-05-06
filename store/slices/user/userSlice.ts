import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState:UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers:{
    setUser(state, action: PayloadAction<User>){
      state.user = action.payload;
      state.isAuthenticated = !!action.payload.token;
      state.isLoading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>){
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>){
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser(state){
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    }
  }
})

export const {setUser, setLoading, setError, clearUser} = userSlice.actions;
export default userSlice.reducer;
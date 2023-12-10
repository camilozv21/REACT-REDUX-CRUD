import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserId = string;

const DEFAULT_STATE = [
  {
    id: "1",
    name: "Peter Doe",
    email: "peter@gmail.com",
    github: "peterdoe",
  },
  {
    id: "2",
    name: "John Doe",
    email: "joh@gmail.com",
    github: "johndoe",
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "haacoken@gmail.com",
    github: "janedoe",
  },
  {
    id: "4",
    name: "Camilo Zapata",
    email: "camilozv21@gmail.com",
    github: "camilozv21",
  },
];

export interface User {
  name: string;
  email: string;
  github: string;
}

export interface UserWithId extends User {
  id: string;
}

const initialState: UserWithId[] = (() => {
  const persistedState = localStorage.getItem("__redux__state__");
  return persistedState ? JSON.parse(persistedState).users : DEFAULT_STATE;
})();

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<User>) => {
      const id = crypto.randomUUID();
      state.push({ id, ...action.payload });
    },
    deleteUserById: (state, action: PayloadAction<UserId>) => {
      const id = action.payload;
      return state.filter((user) => user.id !== id);
    },
    rollbackUser: (state, action: PayloadAction<UserWithId>) => {
      const isUserAlreadyDefined = state.some(
        (user) => user.id === action.payload.id
      );
      if (!isUserAlreadyDefined) {
        state.push(action.payload);
      }
    },
  },
});

export default usersSlice.reducer;

export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;

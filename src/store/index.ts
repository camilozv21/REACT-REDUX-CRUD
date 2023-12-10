import { configureStore, type Middleware } from "@reduxjs/toolkit";
import usersReducer, { rollbackUser } from "./users/slice";
import { toast } from "sonner";

const persistanceLocalStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    next(action);
    localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
  };

const syncWithDatabase: Middleware = (store) => (next) => (action) => {
  const { type, payload } = action;
  const previousState = store.getState();
  next(action);

  if (type === "users/deleteUserById") {
    const userIdToRemove = payload;
    const userToRemove = previousState.users.find(
      (user) => user.id === userIdToRemove
    );

    fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemove}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          toast.success(`Usuario ${userIdToRemove} eliminado correctamente`);
        } else throw new Error("Error al eliminar el usuario");
      })
      .catch((error) => {
        toast.error(`Error al eliminar el usuario ${userIdToRemove}`);
        if (userToRemove) store.dispatch(rollbackUser(userToRemove));
        console.log(error);
      });
  } else if (type === "users/addNewUser") {
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok)
          toast.success(`User ${payload.name} added successfully`);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      persistanceLocalStorageMiddleware,
      syncWithDatabase
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createEntity, updateEntity } from "../../api/firebase/api";
import { auth } from "../../main";
import type { AppDispatch } from "../store";
import { authenticate, logout } from "./authSlice";

//Thunk is used for making async API calls

export function loginReq(email: string, password: string) {
  return async function loginThunk(dispatch: AppDispatch) {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateEntity("users", credentials.user.uid, { loggedIn: true });
      dispatch(
        authenticate({
          userId: credentials.user.uid,
          email: credentials.user.email,
        })
      );
    } catch (error) {
      alert(error);
    }
  };
}

export function registerReq(
  email: string,
  password: string,
  displayName: string
) {
  return async function registerThunk(dispatch: AppDispatch) {
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = credentials.user.uid;

      const newUser = {
        userId,
        displayName,
        email,
        loggedIn: true,
        chatIds: {},
      };
      await createEntity("users", userId, newUser);
      dispatch(
        authenticate({
          userId: credentials.user.uid,
          email: credentials.user.email,
          displayName,
          chatIds: {},
        })
      );
    } catch (error) {
      alert(error);
    }
  };
}

export function logoutReq(userId: string) {
  return async function logoutThunk(dispatch: AppDispatch) {
    try {
      await updateEntity("users", userId, { loggedIn: false });
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
}

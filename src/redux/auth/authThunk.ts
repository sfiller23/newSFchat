import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, createEntity, updateEntity } from "../../api/firebase/api";
import type { AppDispatch } from "../store";
import { authenticate, logout } from "./authSlice";

/**
 * Auth Thunks
 * This file contains asynchronous Redux thunks for handling user authentication.
 * It includes actions for logging in, registering, and logging out users.
 * These thunks interact with Firebase Authentication and Firestore to manage user data.
 */

export function loginReq(email: string, password: string) {
  return async function loginThunk(dispatch: AppDispatch) {
    try {
      // Authenticate the user with Firebase
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
      console.error(error);
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
      // Create a new user with Firebase Authentication
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
      // Create a new user entity in Firestore users collection (separate from authenticated user list)
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
      console.error(error);
    }
  };
}

export function logoutReq(userId: string) {
  return async function logoutThunk(dispatch: AppDispatch) {
    try {
      await updateEntity("users", userId, { loggedIn: false });
      await signOut(auth); // Sign out the user from Firebase Authentication
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
}

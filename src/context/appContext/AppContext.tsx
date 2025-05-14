import { createContext } from "react";

export interface AppState {
  imgProfileUrl: string;
  imgProfileChange: boolean;
  isLoading: boolean;
}

export interface AppContextState extends AppState {
  setLoadingState: (isLoading: boolean) => void;
  setImageProfile: (imgUrl: string) => void;
  setImageProfileChange: () => void;
  clearAppState: () => void;
}

export const initialState: AppContextState = {
  imgProfileUrl: "",
  imgProfileChange: false,
  isLoading: false,
  setLoadingState: () => {},
  setImageProfile: () => {},
  setImageProfileChange: () => {},
  clearAppState: () => {},
};

export const AppContext = createContext<AppContextState>(initialState);

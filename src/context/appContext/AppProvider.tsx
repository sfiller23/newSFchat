import { useCallback, useReducer, type ReactNode } from "react";
import { AppStateActions } from "../../constants/enums";
import { AppContext, initialState, type AppState } from "./AppContext";

export interface ReducerAction {
  type: AppStateActions;
  payload?: string | boolean;
}

const reducer = (state: AppState, action: ReducerAction): AppState => {
  switch (action.type) {
    case AppStateActions.SET_IMAGE_PROFILE:
      return { ...state, imgProfileUrl: action.payload as string };
    case AppStateActions.SET_IMAGE_PROFILE_CHANGE:
      return { ...state, imgProfileChange: !state.imgProfileChange };
    case AppStateActions.SET_LOADING:
      return { ...state, isLoading: action.payload as boolean };
    case AppStateActions.CLEAR:
      return { ...state, ...initialState };
    default:
      throw new Error("Unknown action");
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [{ imgProfileUrl, imgProfileChange, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const clearAppState = () => {
    dispatch({ type: AppStateActions.CLEAR });
  };

  const setLoadingState = useCallback((isLoading: boolean) => {
    dispatch({
      type: AppStateActions.SET_LOADING,
      payload: isLoading,
    });
  }, []);

  const setImageProfile = useCallback((imgUrl: string) => {
    dispatch({
      type: AppStateActions.SET_IMAGE_PROFILE,
      payload: imgUrl,
    });
  }, []);

  const setImageProfileChange = () => {
    dispatch({ type: AppStateActions.SET_IMAGE_PROFILE_CHANGE });
  };

  return (
    <AppContext.Provider
      value={{
        imgProfileUrl,
        imgProfileChange,
        isLoading,
        setLoadingState,
        setImageProfile,
        setImageProfileChange,
        clearAppState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

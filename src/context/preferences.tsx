import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";

interface PreferencesState {
  loop: boolean;
  muted: boolean;
  volume: number;
}

type PreferencesAction = 
  | { type: "TOGGLE_LOOP" }
  | { type: "TOGGLE_MUTED"; payload?: boolean; }
  | { type: "SET_VOLUME"; payload: number };

interface PreferencesContextProviderProps {
  children: ReactNode;
}
  
const initialState = {
  loop: true,
  muted: true,
  volume: 1,
};

const PreferencesContext = createContext<[PreferencesState, Dispatch<PreferencesAction>]>([
  initialState,
  () => {}
]);

export function PreferencesContextProvider({ children }: PreferencesContextProviderProps) {
  return (
    <PreferencesContext.Provider value={useReducer(Reducer, initialState)}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferencesContext = () => useContext(PreferencesContext);

type ReducerAction = PreferencesAction;

interface ReducerState {
  loop: boolean;
  muted: boolean;
  volume: number;
}

export default function Reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "TOGGLE_LOOP":
      return { ...state, loop: !state.loop };
    case "TOGGLE_MUTED":
      return { ...state, muted: action.payload ?? !state.muted };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    default:
      return state;
  }
}
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";

interface PreferencesState {
  autoPlay: boolean;
  muted: boolean;
  volume: number;
}

type PreferencesAction = 
  | { type: "TOGGLE_AUTOPLAY" }
  | { type: "TOGGLE_MUTED" }
  | { type: "SET_VOLUME"; payload: number };

interface PreferencesContextProviderProps {
  children: ReactNode;
}
  
const initialState = {
  autoPlay: false,
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

type ReducerAction = {
  type: 'TOGGLE_AUTOPLAY';
} | {
  type: 'TOGGLE_MUTED';
} | {
  type: 'SET_VOLUME';
  payload: number;
}

interface ReducerState {
  autoPlay: boolean;
  muted: boolean;
  volume: number;
}

export default function Reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "TOGGLE_AUTOPLAY":
      return { ...state, autoPlay: !state.autoPlay };
    case "TOGGLE_MUTED":
      return { ...state, muted: !state.muted };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    default:
      return state;
  }
}
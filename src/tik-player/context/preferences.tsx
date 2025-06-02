import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";

type Config = {
  panel: boolean;
  panel_exist: boolean;
}
interface PreferencesState {
  loop: boolean;
  muted: boolean;
  volume: number;
  config: Config;
}

type PreferencesAction = 
  | { type: "TOGGLE_LOOP" }
  | { type: "TOGGLE_MUTED"; payload?: boolean; }
  | { type: "SET_VOLUME"; payload: number; }
  | { type: "SET_CONFIG"; payload: Partial<Config>; }
  | { type: "TOGGLE_PANEL"; payload?: boolean; };

interface PreferencesContextProviderProps {
  children: ReactNode;
}
  
const initialState = {
  loop: true,
  muted: false,
  volume: 0.8,
  config: {
    panel_exist: false,
    panel: false,
  }
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
  config: Config;
}

export default function Reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "TOGGLE_LOOP":
      return { ...state, loop: !state.loop };
    case "TOGGLE_MUTED":
      return { ...state, muted: action.payload ?? !state.muted };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    // OTHERS
    case "SET_CONFIG":
      return { ...state, config: {...state.config, ...action.payload} };
    case "TOGGLE_PANEL":
      return { ...state, config: {...state.config, panel: action.payload ?? !state.config.panel} };
    default:
      return state;
  }
}
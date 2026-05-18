import { createContext, useContext } from "react";
import type { ActionEngine } from "./types.js";

const noopEngine: ActionEngine = {
  dispatch: () => {},
};

export const ActionEngineContext = createContext<ActionEngine>(noopEngine);

export function useActionEngine(): ActionEngine {
  return useContext(ActionEngineContext);
}

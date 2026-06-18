import { createContext, useContext } from "react";

/**
 * The BFF connection facts a screen needs to fetch its OWN document path-direct
 * (addressable surfaces: a sheet fetching its content on open, a page/sheet
 * refetching itself on reload-by-name). The action engine already holds these
 * in its config, but handlers receive the config by argument while React
 * screens need it from context — so the provider mirrors the two fields here.
 *
 * Intentionally minimal: only the two fields a path-direct document fetch
 * needs. Header construction (X-Dev-Identity, X-Active-Influencer-Id) stays in
 * `buildBffHeaders`; a screen-level fetch can stay GET-simple.
 */
export interface BffConfigValue {
  bffBaseUrl: string;
  authToken: () => string | null;
}

const defaultValue: BffConfigValue = {
  bffBaseUrl: "",
  authToken: () => null,
};

export const BffConfigContext = createContext<BffConfigValue>(defaultValue);

export function useBffConfig(): BffConfigValue {
  return useContext(BffConfigContext);
}

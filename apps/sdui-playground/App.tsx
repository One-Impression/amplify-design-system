import React from "react";
import { SduiNavigationHost } from "@one-impression/sdui-runtime";
import { Providers } from "./src/providers";
import { HOME_ID } from "./src/fixtures/registry";
import { loadPage } from "./src/fixtures/loadPage";

// Fixture-driven SDUI playground. Navigation is owned by the runtime's
// SduiNavigationHost (native-stack transitions + unified page/sheet back).
// Pages are loaded data-driven: `loadPage` fetches each page envelope as JSON
// from the local fixture server, exactly as a real app fetches from its BFF.
// The only thing wired here is the bootstrap (which screen to load first). See
// PLAN.md + src/fixtures/loadPage.ts.
export default function App(): React.ReactElement {
  return (
    <Providers>
      <SduiNavigationHost resolvePage={loadPage} initialScreenId={HOME_ID} />
    </Providers>
  );
}

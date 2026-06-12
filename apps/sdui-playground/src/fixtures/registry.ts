// The bootstrap screen id — the only "wired" navigation fact on the client.
// Every page (including this one) is fetched as a JSON contract by `loadPage`
// from the fixture server; there is no in-process page registry. The pages
// themselves live as raw JSON in `server/pages/*.json`.
export const HOME_ID = "catalog.home";

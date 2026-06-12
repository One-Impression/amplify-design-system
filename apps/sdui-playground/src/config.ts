// 10.0.2.2 is the Android-emulator alias for the host loopback. The playground
// fixture server (`server/fixture-server.ts`, started via `npm run serve:fixtures`)
// serves page envelopes as JSON from this origin on port 3012. Reach it from the
// emulator with `adb reverse tcp:3012 tcp:3012`.
//
// (Dedicated port — :3001 and :3010 are already taken by other local services;
// the playground serves its own catalog pages on its own port.)
export const PAGE_API_BASE_URL = "http://10.0.2.2:3012";

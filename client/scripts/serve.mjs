// Production-safe entrypoint for the client.
//
// Railway (and other PaaS) run `npm run dev --workspace=client` as the start
// command. Running the raw Vite *dev* server there OOMs the container: the dev
// server pre-bundles three.js / @react-three/drei / framer-motion / react-router
// in memory and gets SIGKILLed (exit 137) on small instances.
//
// The production `vite build` step already produces `dist/`, so for any
// Railway-ish environment we serve that static bundle with `vite preview`
// (a few dozen MB, no dependency optimization). Locally we keep the real
// HMR dev server.

import { spawnSync } from 'node:child_process';

const onRailway = Object.keys(process.env).some((k) =>
  k.startsWith('RAILWAY_')
);
const isProd =
  onRailway ||
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'prod';

const port = process.env.PORT || '5173';

const cmd = isProd
  ? ['vite', 'preview', '--host', '0.0.0.0', '--port', String(port)]
  : ['vite'];

const res = spawnSync(cmd[0], cmd.slice(1), { stdio: 'inherit' });
process.exit(res.status ?? 1);

// Usage: node scripts/with-env.cjs <env-file> <next args...>
// Loads an env file (without overriding variables already set) and runs the Next.js CLI.
const { spawnSync } = require("node:child_process");
const [file, ...args] = process.argv.slice(2);
const before = { ...process.env };
process.loadEnvFile(file);
Object.assign(process.env, before); // real environment wins over the file
const r = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), ...args], { stdio: "inherit", env: process.env });
process.exit(r.status ?? 1);

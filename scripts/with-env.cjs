// Usage: node scripts/with-env.cjs <env-file> <next args...>
// Loads an env file (variables already set in the real environment win) and then runs the
// Next.js CLI *in this same process* — no extra Node process stays resident (saves ~40 MB RSS).
const path = require("node:path");
const [file, ...args] = process.argv.slice(2);
const before = { ...process.env };
process.loadEnvFile(file);
Object.assign(process.env, before);
const nextBin = require.resolve("next/dist/bin/next");
process.argv = [process.argv[0], nextBin, ...args];
require(path.resolve(nextBin));

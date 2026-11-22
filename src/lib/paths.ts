/**
 * The site can be served from a sub-path (e.g. a preview at
 * example.com/preview/nextgenroofing) by setting NEXT_PUBLIC_BASE_PATH at
 * build time. next/link and next/router add it automatically; raw URLs
 * (video sources, fetch calls, icons) must go through `asset()`.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
export const asset = (path: string) => (path.startsWith("/") && !path.startsWith(BASE_PATH + "/") ? BASE_PATH + path : path);

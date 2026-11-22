import NextImage, { type ImageProps } from "next/image";
import { asset } from "@/lib/paths";

/** next/image with base-path-aware `src` (required when the site runs under a sub-path). */
export default function Image({ src, ...props }: ImageProps) {
  return <NextImage src={typeof src === "string" ? asset(src) : src} {...props} />;
}

import React from "react";
import Link, { LinkProps } from "next/link";
import { getObfuscatedVersion } from "@/utils/version";

interface VersionedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
}

export const VersionedLink = ({ href, ...props }: VersionedLinkProps) => {
  const vString = getObfuscatedVersion();

  let finalHref = href;

  if (vString && typeof href === "string") {
    const hasQuery = href.includes("?");
    const separator = hasQuery ? "&" : "?";

    // Only append if not already present
    if (!href.includes("v=")) {
      finalHref = `${href}${separator}v=${vString}`;
    }
  } else if (vString && typeof href === "object" && href.pathname) {
    // Handle URL object
    finalHref = {
      ...href,
      query: {
        // @ts-ignore
        ...href.query,
        v: vString,
      },
    };
  }

  return <Link href={finalHref} {...props} />;
};

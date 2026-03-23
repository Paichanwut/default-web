import { useRouter as useNextRouter } from "next/navigation";
import { getObfuscatedVersion } from "@/utils/version";
import { useCallback } from "react";

export const useVersionedRouter = () => {
  const router = useNextRouter();

  const appendVersion = useCallback((url: string) => {
    const vString = getObfuscatedVersion();
    if (!vString) return url;

    // Check if query params already exist
    const hasQuery = url.includes("?");
    const separator = hasQuery ? "&" : "?";
    
    // Don't append if v= already exists
    if (url.includes("v=")) return url;

    return `${url}${separator}v=${vString}`;
  }, []);

  const push = useCallback((href: string, options?: any) => {
    return router.push(appendVersion(href), options);
  }, [router, appendVersion]);

  const replace = useCallback((href: string, options?: any) => {
    return router.replace(appendVersion(href), options);
  }, [router, appendVersion]);

  return {
    ...router,
    push,
    replace,
  };
};

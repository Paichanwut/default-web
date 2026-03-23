import packageJson from "../../package.json";

export const ENABLE_OBFUSCATED_VERSION = true;

/**
 * Generates an obfuscated version string based on the current app version and date.
 * Format: Base64(version|YYYYMMDD)
 * 
 * @returns The obfuscated string if enabled, or null if disabled.
 */
export const getObfuscatedVersion = (): string | null => {
  if (!ENABLE_OBFUSCATED_VERSION) {
    return null;
  }

  try {
    const version = packageJson.version;
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    
    // Obfuscate: Base64 encode the version and date
    // Result example: MC4xLjB8MjAyNjAyMDY
    return btoa(`${version}|${dateStr}`).replace(/=/g, ""); 
  } catch (e) {
    console.error("Failed to generate version string", e);
    return null;
  }
};

/**
 * Returns the raw application version from package.json
 */
export const getAppVersion = (): string => {
  return packageJson.version;
};

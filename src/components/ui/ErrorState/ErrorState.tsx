import React from "react";
import Link from "next/link";
import styles from "./ErrorState.module.scss";
import { Home, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  code: number;
  message: string;
  imageSrc?: string; // Optional image source
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  code,
  message,
  imageSrc,
  onRetry,
}) => {
  return (
    <div className={styles.error_container}>
      {/* Background Watermark - Only show if NO image provided (to avoid clutter) */}
      {!imageSrc && <div className={styles.watermark}>{code}</div>}

      <div className={styles.content}>
        {imageSrc ? (
          <div className={styles.image_wrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={`${code} Error`}
              className={styles.error_image}
            />
            <div className={styles.overlay_text}>{code}</div>
          </div>
        ) : (
          <div className={styles.code_wrapper}>
            <h1>{code}</h1>
          </div>
        )}

        <div className={styles.message_box}>
          <div className={styles.title}>Oops!</div>
          <div className={styles.message}>{message}</div>
        </div>

        <div className={styles.actions}>
          {onRetry ? (
            <button onClick={onRetry} className={styles.home_button}>
              <RefreshCcw size={20} />
              Try Again
            </button>
          ) : (
            <Link href="/" className={styles.home_button}>
              <Home size={20} />
              Return Home
            </Link>
          )}

          {onRetry && (
            <Link href="/" className={styles.secondary_button}>
              <Home size={20} />
              Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;

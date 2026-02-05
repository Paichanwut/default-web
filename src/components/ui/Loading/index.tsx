import React from "react";
import styles from "./Loading.module.scss";

interface LoadingProps {
  fullScreen?: boolean;
  contained?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  contained = false,
  className = "",
  size = "md",
}) => {
  const dots = (
    <div className={`${styles.container} ${styles[size]} ${className}`}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.overlay}>
        <div className={styles.content}>
          {dots}
          {/* Optional text, can be removed if strictly just dots are wanted */}
          {/* <span className="text-sm font-medium opacity-80">Loading...</span> */}
        </div>
      </div>
    );
  }

  if (contained) {
    return (
      <div className={`${styles.contained} ${className}`}>
        <div className={styles.content}>{dots}</div>
      </div>
    );
  }

  // Inherit text color from parent for inline usage, default to logic needed by consumer
  return <div className={styles.inlineWrapper}>{dots}</div>;
};

export default Loading;

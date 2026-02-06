"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      code={500}
      message="Something went wrong on our server."
      onRetry={() => reset()}
      imageSrc="/assets/error-illustration.png"
    />
  );
}

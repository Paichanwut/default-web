import ErrorState from "@/components/ui/ErrorState/ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      code={404}
      message="The page you looked for couldn't be found."
      imageSrc="/assets/error-illustration.png"
    />
  );
}

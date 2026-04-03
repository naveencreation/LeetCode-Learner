import { ErrorState } from "@/components/error-state";

export default function NotFound() {
  return (
    <ErrorState
      statusCode="404"
      title="Page Not Found"
      message="The page you are looking for does not exist or may have been moved."
      imageSrc="/error-404.svg"
      imageAlt="404 page not found illustration"
      primaryHref="/dashboard"
      primaryLabel="Go To Dashboard"
      secondaryHref="/problems"
      secondaryLabel="Open Problems"
    />
  );
}

import { ErrorState } from "@/components/error-state";

export default function InternalErrorPage() {
  return (
    <ErrorState
      statusCode="500"
      title="Internal Server Error"
      message="Something went wrong on our side. Please try again in a moment."
      imageSrc="/error-500.svg"
      imageAlt="500 internal server error illustration"
      primaryHref="/dashboard"
      primaryLabel="Go To Dashboard"
      secondaryHref="/problems"
      secondaryLabel="Open Problems"
    />
  );
}

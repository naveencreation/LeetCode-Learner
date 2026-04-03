import { ErrorState } from "@/components/error-state";

export default function UnauthorizedPage() {
  return (
    <ErrorState
      statusCode="401"
      title="Unauthorized Access"
      message="You do not have permission to view this page right now."
      imageSrc="/error-401.svg"
      imageAlt="401 unauthorized illustration"
      primaryHref="/dashboard"
      primaryLabel="Go To Dashboard"
      secondaryHref="/problems"
      secondaryLabel="Open Problems"
    />
  );
}

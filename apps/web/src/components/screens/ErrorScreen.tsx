import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export default function ErrorScreen({
  error,
  reset,
  title = "Something went wrong",
  description = "An error occurred while loading the content. Please try again.",
}: ErrorScreenProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {error?.message && (
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground text-left">
            <p className="font-semibold mb-1">Error details:</p>
            <p className="wrap-break-words">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {reset && (
            <Button onClick={reset} variant="default">
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

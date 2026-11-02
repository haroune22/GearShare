import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const LoadingPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
    </div>
  );
};

export default LoadingPage;

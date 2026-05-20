import { MinimalLoader } from "@/components/ui/minimal-loader";

type AppLoadingProps = {
  className?: string;
  label?: string;
};

export function AppLoading({
  className,
  label = "Preparing ModuleWyse",
}: AppLoadingProps) {
  return (
    <MinimalLoader
      className={className}
      label={label}
      showBrand
      variant="page"
    />
  );
}

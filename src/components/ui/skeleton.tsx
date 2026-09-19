import { cn } from "cn";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="skeleton"
      className={cn(
        "inline-block animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/80",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

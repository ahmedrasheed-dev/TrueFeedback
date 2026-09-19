import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MessageSkeleton() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          className="border-stone-200 bg-[#f9f7f4] shadow-[0_14px_35px_rgba(28,25,23,0.05)] transition-colors dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_14px_35px_rgba(0,0,0,0.18)]"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            </div>
            <div className="pt-3">
              <Skeleton className="h-3 w-28" />
            </div>
          </CardHeader>
          <CardContent />
        </Card>
      ))}
    </div>
  );
}

import { Skeleton } from "../../components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-black dark:bg-gray-900 text-gray-900 dark:text-white h-screen w-full">
      {/* Top Heading */}
      <Skeleton className="h-6 w-[250px] bg-gray-200 dark:bg-gray-800" />

      {/* Update Address Section */}
      <div className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-4 w-[200px] bg-gray-200 dark:bg-gray-800" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Four Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 w-full rounded-lg bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>

      {/* Lower Section: Applications + Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Internship Applied Recently */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-48 bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-16 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Recent Activities */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-48 bg-gray-200 dark:bg-gray-800" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-[150px] bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-[200px] bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

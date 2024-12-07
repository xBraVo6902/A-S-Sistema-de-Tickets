export const LoadingTable = () => (
  <div className="w-full space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-8 w-[200px] animate-pulse bg-gray-200 rounded" />
      <div className="h-8 w-[200px] animate-pulse bg-gray-200 rounded" />
    </div>
    <div className="rounded-md border">
      <div className="h-12 border-b bg-gray-50" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b">
          <div className="flex items-center space-x-4 p-4">
            <div className="h-6 w-full animate-pulse bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

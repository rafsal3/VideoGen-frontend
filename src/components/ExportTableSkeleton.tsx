import { Skeleton } from "./ui/skeleton";

const ExportTableSkeleton = () => {
  const fakeRows = Array.from({ length: 5 });

  return (
    <div className="rounded shadow overflow-auto">
      <table className="min-w-full table-auto text-left">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-600">
            <th className="p-3">Project</th>
            <th className="p-3">Created at</th>
            <th className="p-3">Finished at</th>
            <th className="p-3">Preview</th>
            <th className="p-3">Download</th>
          </tr>
        </thead>
        <tbody>
          {fakeRows.map((_, i) => (
            <tr key={i} className="border-t">
              <td className="p-3 whitespace-nowrap flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded" />
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="p-3 whitespace-nowrap">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="p-3 whitespace-nowrap">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-3 whitespace-nowrap">
                <Skeleton className="h-6 w-20 rounded" />
              </td>
              <td className="p-3 whitespace-nowrap">
                <Skeleton className="h-6 w-40 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExportTableSkeleton;
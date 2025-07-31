import { useEffect, useState } from "react";
import { apiService, Project } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExportTableSkeleton from "@/components/ExportTableSkeleton";

const ExportPage = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!token) return;
        const data = await apiService.getProjects(token);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

 return (
  <div className="p-4">
    <h1 className="text-2xl font-semibold mb-4">Your Exports</h1>
    {loading ? (
      <ExportTableSkeleton />
    ) : (
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
            {projects.map((project) => (
              <tr key={project._id} className="border-t hover:bg-gray-50">
                <td className="p-3 whitespace-nowrap flex items-center gap-3">
                  {project.thumbnail_url && (
                    <img
                      src={project.thumbnail_url}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded object-cover border"
                    />
                  )}
                  <span>{project.name}</span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  {format(new Date(project.created_at), "MM/dd/yyyy hh:mm a")}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {project.render_completed_at
                    ? format(new Date(project.render_completed_at), "MM/dd/yyyy hh:mm a")
                    : project.status === "rendering"
                    ? "Rendering..."
                    : "-"}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {project.video_url ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setPreviewUrl(project.video_url)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{project.name}</DialogTitle>
                        </DialogHeader>
                        <div className="w-full aspect-video">
                          <video
                            src={previewUrl || undefined}
                            controls
                            autoPlay
                            className="w-full h-full rounded border"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {project.status === "draft" && (
                    <span className="text-gray-400 text-sm">Draft (Not rendered)</span>
                  )}
                  {project.status === "rendering" && (
                    <span className="text-blue-500 text-sm animate-pulse">Rendering...</span>
                  )}
                  {project.status === "failed" && (
                    <span className="text-red-500 text-sm">Failed</span>
                  )}
                  {project.status === "completed" && project.video_url ? (
                    <a
                      href={project.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      <Download size={16} />
                      {project.render_quality} / mp4 / 30 fps
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-sm text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}

export default ExportPage;

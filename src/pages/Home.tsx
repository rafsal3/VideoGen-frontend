import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Project } from '../services/api';
import { Pencil, Play, Shredder, Trash2 } from 'lucide-react';
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';
import { VideoPlayerDialog } from '@/components/VideoPlayerDialog';

const Home = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [renderingIds, setRenderingIds] = useState<string[]>([]);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // State to manage the video dialog
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; name: string } | null>(null);

  // Effect for the initial fetch of projects
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    apiService.getProjects(token)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [token]);

  // Effect for polling only when projects are processing
  useEffect(() => {
    if (!token) return;

    // Check if any project has a "processing" or "rendering" status.
    const hasProcessingProjects = projects.some(p => p.status === 'processing' || p.status === 'rendering');

    // If there are processing projects, set up an interval to poll for updates.
    if (hasProcessingProjects) {
      const intervalId = setInterval(() => {
        apiService.getProjects(token).then(setProjects);
      }, 5000); // Poll every 5 seconds

      // Cleanup function to clear the interval when the component unmounts
      // or when the dependencies change (i.e., no more processing projects).
      return () => clearInterval(intervalId);
    }
  }, [token, projects]); // This effect re-runs if the token or projects list changes.

  const handleRender = async (projectId: string) => {
    if (!token) return;
    try {
      setRenderingIds((prev) => [...prev, projectId]);
      await apiService.renderProject(token, projectId);
      // Fetch projects immediately for a faster UI update
      const updated = await apiService.getProjects(token);
      setProjects(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to render project';
      alert(message);
    } finally {
      setRenderingIds((prev) => prev.filter((id) => id !== projectId));
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!token) return;
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    try {
      await apiService.deleteProject(token, projectId);
      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      alert(message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project) => {
            const isRendering = project.status === 'processing' || project.status === 'rendering';
            const isDraft = project.status === 'draft';
            const isCompleted = project.status === 'completed';
            const isStartingRender = renderingIds.includes(project.project_id);
            
            const isHovered = hoveredProjectId === project.project_id;
            const canPreview = isCompleted && project.video_url;

            return (
              <div
                key={project._id}
                onMouseEnter={() => setHoveredProjectId(project.project_id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                className={`
                  relative rounded-2xl overflow-hidden aspect-video
                  transition border-2 p-1 group
                  ${isRendering ? 'border-red-400' : isDraft ? 'border-yellow-400' : 'border-green-400'}
                `}
              >
                {/* --- MODIFICATION START --- */}
                {/* Base Layer: Always show the thumbnail image. */}
                <div
                  className="absolute inset-0 w-full h-full rounded-xl"
                  style={{
                    backgroundImage: `url(${project.thumbnail_url || project.template_info.thumbnail_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Hover Layer: Conditionally render video on top when hovered. */}
                {isHovered && canPreview && (
                  <video
                    src={project.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                )}
                {/* --- MODIFICATION END --- */}

                <div
                  className={`absolute top-2 right-2 text-xs px-3 py-1 rounded-full capitalize ${
                    isRendering ? 'bg-red-500 text-white' : isDraft ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {isRendering ? 'Processing' : project.status}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  {!isRendering && (
                    <>
                      <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Pencil size={18} className="text-gray-800 dark:text-gray-100" />
                      </button>

                      {isCompleted && project.video_url && (
                        <button
                          onClick={() => setSelectedVideo({ url: project.video_url!, name: project.name })}
                          className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Play size={18} className="text-gray-800 dark:text-gray-100" />
                        </button>
                      )}

                      {isDraft && (
                        <button
                          className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleRender(project.project_id)}
                          disabled={isStartingRender}
                        >
                          {isStartingRender ? (
                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Shredder size={18} className="text-gray-800 dark:text-gray-100" />
                          )}
                        </button>
                      )}

                      <button
                        className="bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleDelete(project.project_id)}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render the dialog component */}
      <VideoPlayerDialog
        isOpen={!!selectedVideo}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedVideo(null);
          }
        }}
        videoUrl={selectedVideo?.url || null}
        title={selectedVideo?.name || ''}
      />
    </div>
  );
};

export default Home;
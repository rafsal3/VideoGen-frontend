import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Project } from '../services/api';
import { Pencil, Play, Shredder, Trash2 } from 'lucide-react';
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';

const Home = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [renderingIds, setRenderingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;

    apiService
      .getProjects(token)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [token]);

  const handleRender = async (projectId: string) => {
    if (!token) return;
    try {
      setRenderingIds((prev) => [...prev, projectId]);

      await apiService.renderProject(token, projectId);

      const updated = await apiService.getProjects(token);
      setProjects(updated);
    } catch (err: any) {
      alert(err.message);
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
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>

      {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isRendering = project.status === 'rendering';
            const isDraft = project.status === 'draft';
            const isStartingRender = renderingIds.includes(project.project_id);

            return (
              <div
                key={project._id}
                className={`
                  relative rounded-2xl overflow-hidden aspect-video
                  transition border-2 p-1 group
                  ${isRendering ? 'border-red-400' : isDraft ? 'border-yellow-400' : 'border-transparent'}
                `}
              >
                {/* Background */}
                <div
                  className="w-full h-full rounded-xl bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300"
                  style={{
                    backgroundImage: `url(${project.thumbnail_url || project.template_info.thumbnail_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Status Badge */}
                <div
                  className={`absolute top-2 right-2 text-xs px-3 py-1 rounded-full ${
                    isRendering
                      ? 'bg-red-500 text-white'
                      : isDraft
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {isRendering ? 'Rendering' : isDraft ? 'Draft' : 'Done'}
                </div>

                {/* Hover Action Buttons */}
                {!isRendering && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                    <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                      <Pencil size={18} />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                      <Play size={18} />
                    </button>
                    {isDraft && (
                      <button
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        onClick={() => handleRender(project.project_id)}
                        disabled={isStartingRender}
                      >
                        {isStartingRender ? (
                          <span className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                        ) : (
                          <Shredder size={18} />
                        )}
                      </button>
                    )}

                    <button
                      className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      onClick={() => handleDelete(project.project_id)}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Project } from '../services/api';
import { Pencil, Play, RefreshCcw } from 'lucide-react';

const Home = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    apiService
      .getProjects(token)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isRendering = project.status !== 'completed';

            return (
              <div
                key={project._id}
                className={`
                  relative rounded-2xl overflow-hidden aspect-video
                  transition border-2 p-1 group
                  ${isRendering ? 'border-red-400' : 'border-transparent'}
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
                  className={`
                    absolute top-2 right-2 text-xs px-3 py-1 rounded-full
                    ${isRendering ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}
                  `}
                >
                  {isRendering ? 'Rendering' : 'Done'}
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
                    <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                      <RefreshCcw size={18} />
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

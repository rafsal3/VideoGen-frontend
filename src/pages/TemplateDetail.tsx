import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Template } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark, CheckCircle, XCircle } from 'lucide-react';


type ParameterValue = {
  type: string;
  required?: boolean;
  default?: string;
  max_length?: number;
};




const TemplateDetail: React.FC = () => {
  const { templateId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!token || !templateId) return;
      try {
        const res = await apiService.getTemplateById(token, templateId);
        setTemplate(res);
      } catch (e) {
        console.error(e);
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId, token]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-12 text-sm">
        Loading template...
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate('/dashboard/explore')}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition mb-6 flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start mb-12">
        {/* Left: Video Preview */}
        <div className="w-full lg:w-[60%] aspect-video relative rounded-xl overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src={template.preview_url}
            poster={template.thumbnail_url}
            muted
            autoPlay
            loop
          />
        </div>

        {/* Right: Template Info */}
        <div className="w-full lg:w-[40%] space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full">
              Duration: {template.duration_seconds}s
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full">
              Resolution: {template.resolution}
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full">
              Category: {template.category}
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full">
              Engine: {template.render_engine}
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full">
              Created: {new Date(template.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/dashboard/template/${template.template_id}/use`)}
              className="bg-black dark:bg-white text-white dark:text-black font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
            >
              Use This Template
            </button>
            <div className="flex items-center gap-2">
              <Bookmark
                size={20}
                className={template.is_saved ? 'fill-black dark:fill-white stroke-black dark:stroke-white' : 'stroke-black dark:stroke-white'}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{template.total_saves}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1">
              Status:
              {template.is_active ? (
                <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16} /> Active</span>
              ) : (
                <span className="text-red-500 flex items-center gap-1"><XCircle size={16} /> Inactive</span>
              )}
            </div>
            <div>
              Premium: {template.is_premium ? <span className="text-yellow-600 font-medium">Yes</span> : 'No'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {template.tags.map(tag => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Parameters Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Parameters</h3>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Required</th>
                <th className="px-4 py-2 font-medium">Default</th>
                <th className="px-4 py-2 font-medium">Max Length</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(template.parameters_schema).map(([key, val]: [string, ParameterValue], index) => (
                <tr
                  key={key}
                  className={
                    index % 2 === 0
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }
                >
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{key}</td>
                  <td className="px-4 py-2 capitalize text-gray-700 dark:text-gray-300">{val.type}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{val.required ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {val.type === 'color' && val.default ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700"
                          style={{ backgroundColor: val.default }}
                        />
                        <span>{val.default}</span>
                      </div>
                    ) : (
                      val.default ?? '-'
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{val.max_length ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;

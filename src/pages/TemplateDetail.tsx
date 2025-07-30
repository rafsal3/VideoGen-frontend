import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Template } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark, CheckCircle, XCircle } from 'lucide-react';

const TemplateDetail: React.FC = () => {
  const { templateId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
    type ParameterValue = string | number | boolean | string[] | number[];
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
    return <div className="text-center text-gray-500 mt-12 text-sm">Loading template...</div>;
  }

  if (!template) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/explore')}
        className="text-sm text-gray-500 hover:text-black transition mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-start flex-wrap gap-5 mb-10">
        <img
          src={template.thumbnail_url}
          alt={template.name}
          className="w-20 h-20 rounded-xl object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl font-semibold text-gray-900">{template.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{template.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">Category: {template.category}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">Duration: {template.duration_seconds}s</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">Resolution: {template.resolution}</span>
          </div>
        </div>
        <button
        onClick={() => navigate(`/dashboard/template/${template.template_id}/use`)}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
        Use This Template
        </button>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Bookmark
            size={20}
            className={template.is_saved ? 'fill-black stroke-black' : 'stroke-black'}
          />
          <span className="text-sm text-gray-600">{template.total_saves}</span>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Preview</h2>
        <div className="w-full max-w-3xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow border border-gray-200">
          <video
            controls
            className="w-full h-full object-cover"
            poster={template.thumbnail_url}
            src={template.preview_url}
          />
        </div>
      </div>

      {/* Template Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Template Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Render Engine:</strong> {template.render_engine}</div>
            <div><strong>Created At:</strong> {new Date(template.created_at).toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              {template.is_active ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-500">
                  <XCircle size={16} /> Inactive
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <strong>Premium:</strong>
              {template.is_premium ? (
                <span className="text-yellow-600 font-medium">Yes</span>
              ) : (
                <span className="text-gray-500">No</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {template.tags.map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3">Parameters</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="text-left px-4 py-2 whitespace-nowrap">Name</th>
                <th className="text-left px-4 py-2 whitespace-nowrap">Type</th>
                <th className="text-left px-4 py-2 whitespace-nowrap">Required</th>
                <th className="text-left px-4 py-2 whitespace-nowrap">Default</th>
                <th className="text-left px-4 py-2 whitespace-nowrap">Max Length</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(template.parameters_schema).map(([key, val]: any, index) => (
                <tr
                  key={key}
                  className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-2 font-medium text-gray-800">{key}</td>
                  <td className="px-4 py-2 capitalize">{val.type}</td>
                  <td className="px-4 py-2">{val.required ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">
                    {val.type === 'color' && val.default ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: val.default }}></span>
                        <span>{val.default}</span>
                      </div>
                    ) : (
                      val.default ?? '-'
                    )}
                  </td>
                  <td className="px-4 py-2">{val.max_length ?? '-'}</td>
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

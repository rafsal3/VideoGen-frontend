import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Template } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Define the structure of each parameter in the schema
type ParameterValue = {
  type: 'text' | 'url' | 'color';
  required?: boolean;
  default?: string;
  max_length?: number;
};

// Optional: Define expected error shape
type APIError = {
  message?: string;
};

// Main component
const NewProject: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  // Strongly type the formData as a Record with string keys and string values
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [projectName, setProjectName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [renderQuality, setRenderQuality] = useState<'720p' | '1080p' | '4k'>('1080p');

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!token || !templateId) return;
      try {
        const data = await apiService.getTemplateById(token, templateId);
        setTemplate(data);

        const initial: Record<string, string> = {};
        for (const key in data.parameters_schema) {
          const defaultVal = data.parameters_schema[key].default;
          if (defaultVal !== undefined) {
            initial[key] = defaultVal;
          }
        }
        setFormData(initial);
      } catch (err) {
        console.error('Error fetching template:', err);
        navigate('/dashboard/explore');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, token, navigate]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!template) return false;
    for (const [key, schema] of Object.entries<ParameterValue>(template.parameters_schema)) {
      if (schema.required && (!formData[key] || formData[key].trim() === '')) {
        alert(`${key} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!template || !token || creating) return;
    if (!validateForm()) return;

    setCreating(true);
    try {
      await apiService.createProject(token, {
        template_id: template.template_id,
        name: projectName.trim() || `${template.name} Project`,
        description: description.trim(),
        parameters: formData,
        render_quality: renderQuality,
      });

      alert('Project created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const error = err as APIError;
      console.error('Error creating project:', err);
      alert(`Failed to create project: ${error.message || 'Unknown error'}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading template...</div>
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900 dark:text-gray-100">
      <button
        onClick={() => navigate(`/dashboard/template/${template.template_id}`)}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition mb-6 flex items-center gap-1"
      >
        ← Back to Template
      </button>

      <h1 className="text-2xl font-bold mb-6">Create Project: {template.name}</h1>

      {/* Project Details */}
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-4">Project Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Project Name</label>
              <input
                type="text"
                placeholder={`${template.name} Project`}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 p-3 rounded-lg"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description (Optional)</label>
              <textarea
                placeholder="Describe your project..."
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 p-3 rounded-lg"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Render Quality</label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 p-3 rounded-lg"
                value={renderQuality}
                onChange={e => setRenderQuality(e.target.value as '720p' | '1080p' | '4k')}
              >
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="4k">4K (Ultra HD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Template Parameters */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-4">Template Parameters</h2>
          <div className="space-y-4">
            {Object.entries<ParameterValue>(template.parameters_schema).map(([key, val]) => (
              <div key={key}>
                <label className="block font-medium mb-1">
                  {key}
                  {val.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {val.type === 'color' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData[key] || val.default || '#000000'}
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={formData[key] || val.default || ''}
                      onChange={e => handleChange(key, e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 p-3 rounded-lg"
                      placeholder="Color value (e.g., #FF5733)"
                    />
                  </div>
                ) : (
                  <input
                    type={val.type === 'url' ? 'url' : 'text'}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 p-3 rounded-lg"
                    value={formData[key] || ''}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={val.required ? 'Required field' : 'Optional field'}
                    maxLength={val.max_length}
                  />
                )}

                {val.max_length && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Max length: {val.max_length} characters
                  </p>
                )}
                {val.default && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Default: {val.default}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/dashboard/template/${template.template_id}`)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
            disabled={creating}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={creating}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
          >
            {creating ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;

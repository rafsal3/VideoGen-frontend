import React, { useEffect, useState } from 'react';
import { apiService, Template } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import TemplateCardSkeleton from '@/components/TemplateCardSkeleton';
import CategorySkeleton from '@/components/CategorySkeleton';

const staticCategories = ['All'];

const bgColors = [
  'bg-gradient-to-br from-pink-300 via-purple-200 to-blue-200',
  'bg-red-500',
  'bg-lime-400',
  'bg-blue-400',
  'bg-indigo-600',
  'bg-yellow-600',
  'bg-amber-600',
  'bg-sky-400',
];

const Explore: React.FC = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      try {
        const apiCategories = await apiService.getCategories(token);
        setCategories([...staticCategories, ...apiCategories]);
      } catch {
        setCategories(staticCategories);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data =
          selectedCategory === 'All'
            ? await apiService.getTemplates(token)
            : await apiService.getTemplatesByCategory(token, selectedCategory);
        setTemplates(data);
      } catch (e) {
        console.error(e);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [token, selectedCategory]);

  const toggleSave = async (e: React.MouseEvent, template: Template) => {
    e.stopPropagation(); // ✅ Prevent click from propagating to <Link>
    e.preventDefault();
    if (!token) return;
    try {
      if (template.is_saved) {
        const res = await apiService.unsaveTemplate(token, template.template_id);
        console.log(res.message);
        setTemplates(prev =>
          prev.map(t =>
            t.template_id === template.template_id
              ? { ...t, is_saved: false, total_saves: t.total_saves - 1 }
              : t
          )
        );
      } else {
        const res = await apiService.saveTemplate(token, template.template_id);
        console.log(res.message);
        setTemplates(prev =>
          prev.map(t =>
            t.template_id === template.template_id
              ? { ...t, is_saved: true, total_saves: t.total_saves + 1 }
              : t
          )
        );
      }

      queryClient.invalidateQueries({ queryKey: ['savedTemplates'] });

    } catch (e) {
      console.error('Failed to toggle save:', e);
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  let displayCategories = categories;
  let showSeeAll = false;
  if (categories.length > 7 && !showAllCategories) {
    displayCategories = categories.slice(0, 7);
    showSeeAll = true;
  }

  return (
    <div>
      {/* Search and Categories */}
      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-lg mx-auto rounded-full border border-gray-200 px-5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {loading ? (
            <CategorySkeleton />
          ) : (
            <>
              {displayCategories.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              {showSeeAll && (
                <button
                  key="See All +"
                  className="px-4 py-1 rounded-full border text-sm font-medium transition-colors bg-gray-100 text-gray-800"
                  onClick={() => setShowAllCategories(true)}
                >
                  See All +
                </button>
              )}
            </>
          )}
        </div>

      </div>

      {/* Templates Grid */}
      {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template, idx) => (
            <Link
              to={`/dashboard/template/${template.template_id}`}
              key={template.template_id}
              className="rounded-2xl p-0 shadow-md flex flex-col relative overflow-hidden hover:shadow-lg transition"
            >
              {template.thumbnail_url ? (
                <div className="h-40 w-full relative flex items-center justify-center overflow-hidden">
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                  <button
                    className="absolute top-3 right-3 bg-white/80 rounded-full p-1"
                    onClick={(e) => toggleSave(e, template)}
                    title={template.is_saved ? 'Unsave' : 'Save'}
                    aria-label="Toggle save"
                  >
                    <Bookmark
                      size={20}
                      className={template.is_saved ? 'fill-black stroke-black' : 'stroke-black'}
                    />
                  </button>
                </div>
              ) : (
                <div className={`h-40 flex items-center justify-center text-3xl font-bold select-none ${bgColors[idx % bgColors.length]} text-white relative`}>
                  <span>{template.name}</span>
                  <button
                    className="absolute top-3 right-3 bg-white/80 rounded-full p-1"
                    onClick={(e) => toggleSave(e, template)}
                    title={template.is_saved ? 'Unsave' : 'Save'}
                    aria-label="Toggle save"
                  >
                    <Bookmark
                      size={20}
                      className={template.is_saved ? 'fill-black stroke-black' : 'stroke-black'}
                    />
                  </button>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-900 text-base">{template.name}</span>
                </div>
                <div className="text-gray-500 text-sm mb-2">{template.description}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {template.tags?.map(tag => (
                    <span key={tag} className="bg-gray-100 text-xs px-2 py-0.5 rounded-full text-gray-700">{tag}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-auto">
                  <span>Category: {template.category}</span> &middot; <span>Duration: {template.duration_seconds}s</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;

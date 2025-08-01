import React, { useEffect, useState } from 'react';
import { apiService, Template } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark } from 'lucide-react';
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
  const [templateCache, setTemplateCache] = useState<Record<string, Template[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch categories
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

  // Fetch templates by selected category, with local cache
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!token) return;

      if (templateCache[selectedCategory]) {
        setTemplates(templateCache[selectedCategory]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data =
          selectedCategory === 'All'
            ? await apiService.getTemplates(token)
            : await apiService.getTemplatesByCategory(token, selectedCategory);

        setTemplates(data);
        setTemplateCache(prev => ({ ...prev, [selectedCategory]: data }));
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
    e.stopPropagation();
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
    <div className="dark:bg-black dark:text-white transition-colors duration-300">
      {/* Search and Categories */}
      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-lg mx-auto rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2 text-gray-700 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.length === 0 ? (
            <CategorySkeleton />
          ) : (
            <>
              {displayCategories.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                  onClick={() => {
                    if (cat !== selectedCategory) {
                      setSelectedCategory(cat);
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
              {showSeeAll && (
                <button
                  key="See All +"
                  className="px-4 py-1 rounded-full border text-sm font-medium transition-colors bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
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
              className="group rounded-xl overflow-hidden flex flex-col transition"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                {template.thumbnail_url ? (
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`w-full aspect-video flex items-center justify-center text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-105 ${bgColors[idx % bgColors.length]}`}
                  >
                    {template.name}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags?.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="bg-white/20 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-300">
                    {template.category} &middot; {template.duration_seconds}s
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {template.name}
                  </h3>
                  <button
                    className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={e => toggleSave(e, template)}
                    title={template.is_saved ? 'Unsave' : 'Save'}
                    aria-label="Toggle save"
                  >
                    <Bookmark
                      size={18}
                      className={
                        template.is_saved
                          ? 'fill-black stroke-black dark:fill-white dark:stroke-white'
                          : 'stroke-black dark:stroke-white'
                      }
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;

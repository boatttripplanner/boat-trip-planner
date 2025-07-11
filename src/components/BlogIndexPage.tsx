// src/components/BlogIndexPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { BlogIndexPageProps } from '../../types';
import { allBlogPosts } from '../blogData';
import { Button } from '../../components/Button';
import { InputField, SelectField } from '../../components/FormControls';

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Sort posts: welcome post first, then by date descending
const sortedBlogPosts = [...allBlogPosts].sort((a, b) => {
  if (a.frontmatter.slug === 'bienvenida-al-blog') return -1;
  if (b.frontmatter.slug === 'bienvenida-al-blog') return 1;
  return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
});

const POSTS_PER_PAGE = 8; // Display 8 posts per page for a cleaner grid layout

// Hook para obtener imagen de Pexels si no hay featuredImage
const usePexelsImage = (query: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!query) return;
    const fetchImage = async () => {
      try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
          headers: { Authorization: 'kSiWzssyYIwlwxUHW9MWn0GwenaAkN2lhx7jH1TbJn70mbjTiEL9SzcS.' }
        });
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          setImageUrl(data.photos[0].src.landscape || data.photos[0].src.medium);
        }
      } catch (e) {
        setImageUrl(null);
      }
    };
    fetchImage();
  }, [query]);
  return imageUrl;
};

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigateToPost, onNavigateHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    sortedBlogPosts.forEach(post => {
      post.frontmatter.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, []);
  
  const tagOptions = useMemo(() => {
    const options = [{ value: '', label: 'Ver todas las etiquetas' }];
    allTags.forEach(tag => {
        const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        options.push({ value: tag, label: capitalizedTag });
    });
    return options;
  }, [allTags]);


  const filteredPosts = useMemo(() => {
    let posts = sortedBlogPosts;
    
    if (activeTag) {
        posts = posts.filter(post => post.frontmatter.tags?.includes(activeTag));
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.frontmatter.title.toLowerCase().includes(lowerQuery) ||
        post.frontmatter.summary.toLowerCase().includes(lowerQuery) ||
        (post.frontmatter.tags && post.frontmatter.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (post.frontmatter.author && post.frontmatter.author.toLowerCase().includes(lowerQuery))
      );
    }
    return posts;
  }, [searchQuery, activeTag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTag]);

  // Unified pagination logic for all filtered posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPostsToDisplay = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
  };

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === currentPage ? 'primary' : 'secondary'}
          size="sm"
          className={`mx-1 ${i === currentPage ? 'font-bold' : ''}`}
          aria-current={i === currentPage ? 'page' : undefined}
          aria-label={`Ir a la página ${i}`}
        >
          {i}
        </Button>
      );
    }
    
    if (totalPages > maxPagesToShow) {
        if (startPage > 1) {
            pageNumbers.unshift(<span key="start-ellipsis" className="mx-1 p-2">...</span>);
            pageNumbers.unshift(
                <Button key={1} onClick={() => handlePageChange(1)} variant="secondary" size="sm" className="mx-1" aria-label="Ir a la página 1">1</Button>
            );
        }
        if (endPage < totalPages) {
            pageNumbers.push(<span key="end-ellipsis" className="mx-1 p-2">...</span>);
            pageNumbers.push(
                <Button key={totalPages} onClick={() => handlePageChange(totalPages)} variant="secondary" size="sm" className="mx-1" aria-label={`Ir a la página ${totalPages}`}>{totalPages}</Button>
            );
        }
    }


    return pageNumbers;
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 p-10 md:p-16 rounded-3xl shadow-2xl mb-12 border border-blue-100/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-slate-200/50">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6 sm:mb-0 drop-shadow-lg">
            Blog de Aventuras Náuticas
          </h1>
          <Button onClick={onNavigateHome} variant="secondary" size="md" className="w-full sm:w-auto">
            Ir al Planificador
          </Button>
        </div>
        <div className="mb-12 flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <InputField
              label="Buscar en el blog..."
              id="blog-search"
              type="text"
              placeholder="Escribe palabras clave, títulos, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0 md:w-1/3">
            <SelectField
              label="Filtrar por Etiqueta"
              id="tag-filter-select"
              value={activeTag || ''}
              onChange={(e) => handleTagClick(e.target.value || null)}
              options={tagOptions}
            />
          </div>
        </div>
        <div className="mb-8">
          <p className="text-lg text-slate-600 font-medium">
            Mostrando {currentPostsToDisplay.length} de {filteredPosts.length} artículos.
          </p>
        </div>
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {currentPostsToDisplay.map((post, idx) => {
                const pexelsImg = !post.frontmatter.featuredImage ? usePexelsImage(post.frontmatter.title) : null;
                return (
                  <article
                    key={post.frontmatter.slug}
                    className={
                      `group bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 flex flex-col overflow-hidden border border-slate-200/50 hover:border-blue-400/80 hover:scale-[1.025] animate-fadein w-full`
                      + (idx % 2 === 0 ? ' md:mt-8' : '')
                    }
                    style={{ minHeight: 520 }}
                  >
                    {(post.frontmatter.featuredImage || pexelsImg) && (
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <img
                          src={post.frontmatter.featuredImage || pexelsImg || undefined}
                          alt={post.frontmatter.title}
                          className="object-cover w-full h-full rounded-t-3xl md:rounded-t-4xl"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 drop-shadow-xl mb-1 group-hover:text-blue-700 transition-all duration-300 line-clamp-2 leading-tight">
                        <button
                          onClick={() => onNavigateToPost(post.frontmatter.slug)}
                          className="text-left focus:outline-none focus:underline"
                        >
                          {post.frontmatter.title}
                        </button>
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 mb-1 font-medium">
                        {formatDate(post.frontmatter.date)}
                        {post.frontmatter.author && ` · ${post.frontmatter.author}`}
                      </p>
                      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                        <div className="mb-1 flex flex-wrap gap-1 justify-end">
                          {post.frontmatter.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 via-cyan-50 to-teal-50 text-blue-700 text-[11px] font-semibold px-3 py-1 rounded-full capitalize shadow border border-blue-200/40"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-base text-slate-800 mb-4 line-clamp-3 leading-relaxed">
                        {post.frontmatter.summary}
                      </p>
                      <Button
                        onClick={() => onNavigateToPost(post.frontmatter.slug)}
                        variant="primary"
                        className="mt-auto w-full bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-500 text-white font-bold shadow-lg hover:from-blue-800 hover:to-teal-600 animate-pulse-on-hover text-base md:text-lg py-2 md:py-3 flex items-center justify-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                      >
                        <span className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">Leer Más</span>
                        <svg className="w-5 h-5 ml-1 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="flex justify-center mt-12 gap-3">
              {renderPageNumbers()}
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 py-16 text-xl font-medium">No se encontraron artículos para tu búsqueda.</div>
        )}
      </div>
    </div>
  );
};

export default BlogIndexPage;
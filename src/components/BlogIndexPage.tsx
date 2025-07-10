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
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 p-10 md:p-16 rounded-3xl shadow-2xl mb-12 border border-blue-100/50 backdrop-blur-sm">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentPostsToDisplay.map((post) => (
                <article key={post.frontmatter.slug} className="group bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden border border-slate-200/50 hover:border-blue-200/50 hover:scale-105">
                  {post.frontmatter.featuredImage && (
                    <div className="h-56 w-full overflow-hidden">
                      <img src={post.frontmatter.featuredImage} alt={post.frontmatter.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-700 group-hover:via-cyan-700 group-hover:to-teal-700 transition-all duration-300">
                      <button
                        onClick={() => onNavigateToPost(post.frontmatter.slug)}
                        className="text-left focus:outline-none focus:underline"
                      >
                        {post.frontmatter.title}
                      </button>
                    </h3>
                    <p className="text-sm text-slate-500 mb-3 font-medium">
                      {formatDate(post.frontmatter.date)}
                      {post.frontmatter.author && ` · ${post.frontmatter.author}`}
                    </p>
                    {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.frontmatter.tags.map(tag => (
                          <span key={tag} className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-bold px-4 py-2 rounded-full capitalize shadow-md border border-blue-200/50">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-base text-slate-700 mb-6 line-clamp-3 leading-relaxed">
                      {post.frontmatter.summary}
                    </p>
                    <Button
                      onClick={() => onNavigateToPost(post.frontmatter.slug)}
                      variant="primary"
                      className="mt-auto w-full"
                    >
                      Leer Más
                    </Button>
                  </div>
                </article>
              ))}
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
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 sm:mb-0">
            Blog de Aventuras Náuticas
          </h1>
          <Button onClick={onNavigateHome} variant="secondary" size="sm" className="w-full sm:w-auto">
            Ir al Planificador
          </Button>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
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
        
        <div className="mb-6">
            <p className="text-sm text-slate-600">
                Mostrando {currentPostsToDisplay.length} de {filteredPosts.length} artículos.
            </p>
        </div>


        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentPostsToDisplay.map((post) => (
                <article key={post.frontmatter.slug} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                      <button
                        onClick={() => onNavigateToPost(post.frontmatter.slug)}
                        className="text-left focus:outline-none focus:underline"
                      >
                        {post.frontmatter.title}
                      </button>
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      {formatDate(post.frontmatter.date)}
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4 flex-grow">{post.frontmatter.summary}</p>
                    <Button
                      onClick={() => onNavigateToPost(post.frontmatter.slug)}
                      variant="primary"
                      size="sm"
                      className="mt-auto self-start"
                    >
                      Leer Más &rarr;
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap justify-center items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="sm"
                  aria-label="Página anterior"
                >
                  &larr; Anterior
                </Button>
                {renderPageNumbers()}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="sm"
                  aria-label="Página siguiente"
                >
                  Siguiente &rarr;
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-600 text-center py-8">
            No se encontraron artículos con tus criterios de búsqueda. Intenta con otra búsqueda o etiqueta.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogIndexPage;
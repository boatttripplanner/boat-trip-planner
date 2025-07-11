// src/components/BlogPostPage.tsx
import React, { useMemo, useEffect, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPostPageProps, ParsedMarkdownPost } from '../../types';
import { allBlogPosts } from '../blogData';
import { Button } from '../../components/Button';
import NotFoundPage from '../../components/NotFoundPage';
import { AMAZON_AFFILIATE_LINK_PLACEHOLDER } from '../../constants';
import { ShoppingCartIcon } from '../../components/icons/ShoppingCartIcon';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getNodeTextContent = (node: React.ReactNode): string => {
    if (node == null) return '';
    if (typeof node === 'string') return String(node);
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getNodeTextContent).join('');
    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return getNodeTextContent(props.children);
    }
    return '';
};

const RelatedPostCard: React.FC<{ post: ParsedMarkdownPost, onNavigate: (slug: string) => void }> = ({ post, onNavigate }) => (
    <div 
        className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer h-full"
        onClick={() => onNavigate(post.frontmatter.slug)}
    >
        <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-md font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors flex-grow">
                {post.frontmatter.title}
            </h4>
            <span className="text-teal-600 text-sm font-semibold self-start group-hover:text-teal-700 transition-colors">
                Leer más &rarr;
            </span>
        </div>
    </div>
);

// Hook para obtener imagen de Pexels según un término
const usePexelsImage = (query: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!query) return;
    const fetchImage = async () => {
      try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
          headers: { Authorization: 'kSiWzssyYIwlwxUHW9MWn0GwenaAkN2lhx7jH1TbJn70mbjTiEL9SzcS' }
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


const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigateToBlogIndex, onNavigateHome, onNavigateToPost }) => {
  const post = useMemo(() => {
    if (!slug) return null;
    return allBlogPosts.find(p => p.frontmatter.slug === slug);
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post || !post.frontmatter.tags) return [];
    
    // Find posts with at least one common tag
    const postsWithSharedTags = allBlogPosts.filter(p => {
        if (p.frontmatter.slug === post.frontmatter.slug) return false;
        return p.frontmatter.tags?.some(tag => post.frontmatter.tags?.includes(tag));
    });

    // Sort by number of shared tags, then by date
    postsWithSharedTags.sort((a, b) => {
        const aSharedCount = a.frontmatter.tags?.filter(tag => post.frontmatter.tags?.includes(tag)).length || 0;
        const bSharedCount = b.frontmatter.tags?.filter(tag => post.frontmatter.tags?.includes(tag)).length || 0;
        if (aSharedCount !== bSharedCount) {
            return bSharedCount - aSharedCount;
        }
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

    let finalRelatedPosts = postsWithSharedTags.slice(0, 3);
    
    // Fallback if not enough related posts
    if (finalRelatedPosts.length < 3) {
      const recentPostsFallback = allBlogPosts
        .filter(p => p.frontmatter.slug !== post.frontmatter.slug && !finalRelatedPosts.find(frp => frp.frontmatter.slug === p.frontmatter.slug))
        .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
      
      finalRelatedPosts.push(...recentPostsFallback.slice(0, 3 - finalRelatedPosts.length));
    }
    
    return finalRelatedPosts;
  }, [post]);


  const handleShareViaWhatsApp = () => {
    if (!post) return;
    const postUrl = `${window.location.origin}/?view=blog_post&slug=${post.frontmatter.slug}`;
    let shareText = `¡Echa un vistazo a este artículo del blog de BoatTrip Planner! 🚤\n\n`;
    shareText += `"${post.frontmatter.title}"\n\n`;
    shareText += `Léelo aquí: ${postUrl}\n\n`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  
  const handlePrint = () => {
    window.print();
  };

  const markdownComponents: Components = {
    h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-0 mb-3" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-semibold" {...props} />,
    h4: ({node, ...props}) => <h4 className="text-lg md:text-xl font-semibold" {...props} />,
    p: ({node, ...props}) => <p {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal" {...props} />,
    li: ({node, ...props}) => <li {...props} />,
    a: ({ node, children, href, ...props }) => {
      const linkText = getNodeTextContent(children);
      if (href && href.includes('samboat.com')) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center px-6 py-3 my-6 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-500 text-white shadow-lg hover:from-blue-800 hover:to-teal-600 transition-all duration-300 border-2 border-blue-300 group drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
            style={{ textDecoration: 'none' }}
            title="Ver flota de veleros en SamBoat (enlace de afiliado)"
          >
            <svg className="w-6 h-6 mr-2 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] group-hover:text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M2 20h20v2H2v-2zm2-2h16l-8-14-8 14zm8-4.5l2.5 4.5h-5L12 13.5z"/></svg>
            <span className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">{linkText}</span>
          </a>
        );
      }
      if (href === AMAZON_AFFILIATE_LINK_PLACEHOLDER) {
        const userAffiliateLink = "https://amzn.to/3I4xn3e";
        return (
          <a
            href={userAffiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center px-4 py-2 my-2 text-base font-bold rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-white shadow-md hover:from-amber-700 hover:to-yellow-500 transition-all duration-300 border border-amber-300 group drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
            title={`Ver "${linkText}" en Amazon.es (enlace de afiliado)`}
            {...props}
          >
            <span className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">{children}</span>
            <ShoppingCartIcon className="w-5 h-5 ml-2 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] group-hover:text-yellow-200 transition-colors" />
          </a>
        );
      }
      if (href && href.startsWith('/?view=blog_post&slug=')) {
        try {
          const url = new URL(href, window.location.origin);
          const slugParam = url.searchParams.get('slug');
          if (slugParam) {
            return (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToPost(slugParam);
                }}
                className="text-teal-600 hover:text-teal-700 underline font-semibold focus:outline-none p-0 m-0 bg-transparent border-none cursor-pointer text-left"
                title={props.title || `Leer más sobre ${linkText}`}
              >
                {children}
              </button>
            );
          }
        } catch (e) {
          console.warn("Error parsing internal blog link href:", href, e);
        }
      }
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700" {...props}>{children}</a>;
      }
      if (href === "/") {
        return <button onClick={(e) => { e.preventDefault(); onNavigateHome();}} className="text-teal-600 hover:text-teal-700 underline font-semibold focus:outline-none">{children}</button>;
      }
      return <a href={href} className="text-teal-600 hover:text-teal-700" {...props}>{children}</a>;
    },
    blockquote: ({node, ...props}) => <blockquote {...props} />,
    img: ({node, src, alt, ...props}) => null, // Do not render images in post content
  };

  if (!post) {
    return <NotFoundPage onNavigateHome={onNavigateHome} />;
  }

  // Procesar el contenido para reemplazar los marcadores por imágenes de Pexels
  const [processedContent, setProcessedContent] = useState(post?.content || '');
  const [pexelsImages, setPexelsImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!post?.content) return;
    // Buscar todos los marcadores
    const regex = /\[ESPACIO PARA FOTO DE PEXELS:([^\]]+)\]/gi;
    const matches = [...post.content.matchAll(regex)];
    if (matches.length === 0) {
      setProcessedContent(post.content);
      return;
    }
    // Para cada marcador, buscar imagen
    const fetchAll = async () => {
      const newImages: { [key: string]: string } = {};
      for (const match of matches) {
        const query = match[1].trim();
        try {
          const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: { Authorization: 'kSiWzssyYIwlwxUHW9MWn0GwenaAkN2lhx7jH1TbJn70mbjTiEL9SzcS' }
          });
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            newImages[query] = data.photos[0].src.landscape || data.photos[0].src.medium;
          }
        } catch {}
      }
      setPexelsImages(newImages);
      // Reemplazar los marcadores por imágenes
      let newContent = post.content;
      for (const match of matches) {
        const query = match[1].trim();
        const imgUrl = newImages[query];
        if (imgUrl) {
          newContent = newContent.replace(match[0], `![${query}](${imgUrl})`);
        } else {
          newContent = newContent.replace(match[0], '');
        }
      }
      setProcessedContent(newContent);
    };
    fetchAll();
  }, [post?.content]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/90 p-8 md:p-12 rounded-2xl shadow-2xl blog-post-printable border border-slate-200">
        <article className="prose-custom min-w-0">
          {/* Imagen destacada como cabecera si no hay marcadores de Pexels */}
          {post.frontmatter.featuredImage && !processedContent.match(/!\[.*\]\(.*\)/) && (
            <div className="w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden shadow">
              <img src={post.frontmatter.featuredImage} alt={post.frontmatter.title} className="object-cover w-full h-full" />
            </div>
          )}
          <header className="mb-10">
            <h1 className="blog-title text-4xl sm:text-5xl font-extrabold text-teal-700 mb-4 drop-shadow">{post.frontmatter.title}</h1>
            <p className="blog-meta text-base text-slate-500 mb-2">
              Publicado el {formatDate(post.frontmatter.date)}
              {post.frontmatter.author && ` por ${post.frontmatter.author}`}
            </p>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.frontmatter.tags.map(tag => (
                  <span key={tag} className="inline-block bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full capitalize shadow">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {processedContent}
          </ReactMarkdown>
        </article>
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row flex-wrap gap-3 justify-center no-print">
          <Button onClick={onNavigateToBlogIndex} variant="secondary" className="w-full sm:w-auto">
            &larr; Volver al Blog
          </Button>
          <Button 
            onClick={handleShareViaWhatsApp} 
            variant="secondary"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-lg font-bold px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl drop-shadow-[0_2px_8px_rgba(0,128,64,0.25)] focus:ring-4 focus:ring-green-300 transition-all duration-200 transform hover:-translate-y-1 animate-pulse-on-hover"
            aria-label="Compartir este artículo por WhatsApp"
          >
            <WhatsAppIcon className="w-6 h-6 mr-1 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
            Compartir
          </Button>
           <Button
            onClick={handlePrint}
            variant="secondary"
            className="w-full sm:w-auto"
            aria-label="Imprimir este artículo"
          >
            Imprimir Artículo
          </Button>
        </div>
        {relatedPosts.length > 0 && (
          <aside className="mt-14 pt-10 border-t-2 border-slate-200 no-print">
            <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">También te podría interesar...</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <RelatedPostCard 
                  key={relatedPost.frontmatter.slug}
                  post={relatedPost}
                  onNavigate={onNavigateToPost}
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
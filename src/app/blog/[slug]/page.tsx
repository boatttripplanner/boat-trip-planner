"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface BlogMeta {
  title: string;
  description: string;
  keywords?: string[];
}

interface BlogData {
  meta: BlogMeta;
  content: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cover, setCover] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/blog/${slug}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (data?.meta?.title) {
      fetch(`/api/blogImage?topic=${encodeURIComponent(data.meta.title)}`)
        .then(res => res.json())
        .then(img => setCover(img.image || null));
    }
  }, [data?.meta?.title]);

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-10 text-cyan-600">Cargando post...</div>;
  }
  if (!data || !data.meta) {
    return <div className="max-w-2xl mx-auto mt-10 text-cyan-600">Post no encontrado.</div>;
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4" role="main">
      <article className="prose prose-cyan" aria-label={`Post del blog: ${data.meta.title}`}> 
        {cover && (
          <div className="relative w-full h-64 mb-6">
            <Image src={cover} alt={`Imagen de portada para ${data.meta.title}`} fill className="rounded-xl object-cover" sizes="100vw" />
          </div>
        )}
        <h1 className="text-4xl font-bold text-cyan-800 mb-2">{data.meta.title}</h1>
        <p className="text-cyan-600 mb-6">{data.meta.description}</p>
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </article>
    </main>
  );
} 
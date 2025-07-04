import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
}

function getBlogPosts(): BlogPost[] {
  const postsDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(postsDir, file);
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title || 'Sin título',
        description: data.description || '',
      };
    });
}

export default function BlogPage() {
  const posts = getBlogPosts();
  return (
    <main className="max-w-3xl mx-auto py-12 px-4" role="main">
      <h1 className="text-4xl font-bold text-cyan-800 mb-2">Blog</h1>
      <p className="text-cyan-700 mb-8">Consejos, rutas y experiencias para navegantes.</p>
      <nav aria-label="Entradas del blog">
        <ul className="space-y-6">
          {posts.length === 0 && <li className="text-cyan-500">No hay posts aún.</li>}
          {posts.map(post => (
            <li key={post.slug} className="bg-white/80 rounded-xl shadow p-6 hover:shadow-lg transition">
              <Link href={`/blog/${post.slug}`} className="text-2xl font-semibold text-cyan-700 hover:underline" aria-label={`Leer post: ${post.title}`}>
                {post.title}
              </Link>
              <p className="text-cyan-600 mt-2">{post.description}</p>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
} 
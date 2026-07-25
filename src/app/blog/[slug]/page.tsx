import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ArrowLeft, Calendar, Tag, Share2, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCover } from '@/components/blog/blog-cover';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Fetch data helper
function getPost(slug: string) {
  const dataPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const posts = JSON.parse(fileContents);
    return posts.find((p: any) => p.slug === slug) || null;
  } catch (error) {
    console.error("Could not load blog posts:", error);
    return null;
  }
}

// 2. Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPost(resolvedParams.slug);
  
  if (!post) {
    return { title: 'Article Not Found | SlotMyInterview' };
  }

  return {
    title: `${post.title} | SlotMyInterview Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: [post.tag],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// 3. Optional: Generate static params at build time for fast routing
export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const posts = JSON.parse(fileContents);
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

// 4. The Page Component
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-24 pb-20">
      
      {/* Header / Cover */}
      <div className="w-full h-[40vh] min-h-[300px] max-h-[500px] bg-slate-900 relative">
        <BlogCover title={post.title} slug={post.slug} className="w-full h-full" />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/blog">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md rounded-full px-4 h-10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 w-full -mt-16 relative z-30">
        
        {/* Article Meta Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-[#6B47ED] bg-[#6B47ED]/10 px-3 py-1 rounded-full">
                <Tag className="w-4 h-4" /> {post.tag}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> 
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-500 hover:text-[#0A66C2]">
              <Globe className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-500 hover:text-[#1DA1F2]">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-500 hover:text-slate-900">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#6B47ED] prose-blockquote:border-l-[#6B47ED] prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
          {/* We use dangerouslySetInnerHTML safely here since we generated this content ourselves, but typically you'd use a markdown parser */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '<br/><br/>').replace(/^# (.*)/gm, '').replace(/## (.*)/gm, '<h2>$1</h2>').replace(/> "(.*)"/gm, '<blockquote>"$1"</blockquote>').replace(/\*(.*?)\*/gm, '<em>$1</em>').replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>') }} />
        </article>

        {/* Call to Action Bottom */}
        <div className="mt-16 p-8 bg-[#f8f9fc] rounded-2xl border border-slate-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to transform your hiring?</h3>
          <p className="text-slate-500 mb-6 max-w-lg mx-auto">
            Stop relying on noisy resumes. Start hiring elite AI engineers based on real, verified capabilities.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-[#6B47ED] hover:bg-[#5839C7] text-white font-bold h-12 px-8 rounded-xl">
              Get Early Access
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

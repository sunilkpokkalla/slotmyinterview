import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogCover } from '@/components/blog/blog-cover';
import posts from '@/data/blog-posts.json';

export const metadata = {
  title: 'Blog & Insights | SlotMyInterview',
  description: 'Read our latest insights on technical hiring, AI engineering, and modern developer assessments.',
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-ink-0 flex flex-col pt-24 border-t border-hair">
      {/* Header */}
      <div className="bg-ink-1 text-fg-0 py-20 px-6 border-b border-hair">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4 block">Hiring Intelligence</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 mt-4">
              Engineering <em>Insights.</em>
            </h1>
            <p className="text-fg-2 text-lg md:text-xl">
              Research, technical guides, and thought leadership on scaling engineering teams and eliminating resume theater in hiring.
            </p>
          </div>
          
          <div className="bezel-outer w-full max-w-sm hidden lg:block">
            <div className="bezel-inner">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-purple-400 w-5 h-5" />
                <h3 className="font-bold text-fg-0">Briefings Newsletter</h3>
              </div>
              <p className="text-xs text-fg-2 mb-4">Get the latest proof-economy updates directly in your inbox.</p>
              <input type="email" placeholder="Email address" className="w-full bg-ink-0 border border-hair-2 rounded-lg h-10 px-3 text-xs mb-3 text-fg-0 outline-none" />
              <button className="w-full btn btn-primary py-2 text-xs">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id} 
              className="group flex flex-col bg-ink-1 rounded-2xl border border-hair overflow-hidden hover:border-hair-2 transition-all duration-300"
            >
              <div className="w-full h-48 sm:h-56 overflow-hidden relative">
                <BlogCover title={post.title} slug={post.slug} className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-medium text-purple-400">
                    {post.tag}
                  </span>
                  <span className="text-xs text-fg-3 font-mono">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-fg-0 mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-fg-2 text-sm mb-6 line-clamp-3 flex-1">
                  {post.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-semibold text-fg-1 group-hover:text-purple-400 transition-colors">
                  Read article <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogCover } from '@/components/blog/blog-cover';
import posts from '@/data/blog-posts.json';

export const metadata = {
  title: 'Blog & Insights | SlotMyInterview',
  description: 'Read our latest insights on technical hiring, AI engineering, and modern developer assessments.',
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pt-24">
      {/* Header */}
      <div className="bg-slate-950 text-white py-20 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Engineering Insights
            </h1>
            <p className="text-slate-400 text-lg md:text-xl">
              Thoughts, research, and technical guides on scaling elite engineering teams and eliminating the noise in technical hiring.
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 w-full max-w-sm hidden lg:block shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-[#6B47ED] w-6 h-6" />
              <h3 className="font-bold">Newsletter</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Get the latest hiring trends directly in your inbox.</p>
            <input type="email" placeholder="Email address" className="w-full bg-slate-950 border border-slate-800 rounded-lg h-10 px-3 text-sm mb-3 text-white" />
            <Button className="w-full bg-[#6B47ED] hover:bg-[#5839C7] text-white h-10">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any, index: number) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id} 
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-full h-48 sm:h-56 overflow-hidden">
                <BlogCover title={post.title} slug={post.slug} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B47ED]">
                    {post.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#6B47ED] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">
                  {post.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-semibold text-slate-900 group-hover:text-[#6B47ED] transition-colors">
                  Read article <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

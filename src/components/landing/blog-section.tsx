"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import { useEffect, useState } from "react";

export function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    // Dynamically import the generated JSON data
    import('@/data/blog-posts.json')
      .then(module => {
        // Take the top 3 featured posts
        setBlogPosts(module.default.slice(0, 3));
      })
      .catch(err => console.error("Failed to load blog posts", err));
  }, []);

  if (blogPosts.length === 0) return null;

  return (
    <section className="py-24 bg-ink-0 border-t border-hair">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <span className="eyebrow">Insights</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-fg-0">
              Technical hiring <em>briefings.</em>
            </h2>
          </div>
          <div className="flex gap-4">
            <Link href="/blog" className="btn btn-ghost flex items-center gap-2">
              <span>View all articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col cursor-pointer h-full"
            >
              {/* Image Container with Dynamic BlogCover */}
              <Link href={`/blog/${post.slug}`} className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-hair-2 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                <BlogCover title={post.title} slug={post.slug} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </Link>

              {/* Content Container */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3 text-xs font-mono font-medium text-purple-400">
                  <span>{post.tag}</span>
                </div>
                
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-fg-0 mb-3 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-fg-2 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {post.description}
                </p>

                <div className="mt-auto pt-4 border-t border-hair-2">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-semibold text-fg-1 group-hover:text-purple-400 transition-colors">
                    Read the article
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            Master Your Technical Hiring Strategy
          </motion.h2>
          <div className="flex gap-4">
            <Link href="/blog">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-600" />
              </Button>
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
              <Link href={`/blog/${post.slug}`} className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-slate-200 shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                <BlogCover title={post.title} slug={post.slug} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </Link>

              {/* Content Container */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3 text-sm font-semibold text-[#6B47ED]">
                  <span>{post.tag}</span>
                </div>
                
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-[#6B47ED] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-slate-500 text-base leading-relaxed mb-6 line-clamp-3 flex-1">
                  {post.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-[#6B47ED] transition-colors">
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

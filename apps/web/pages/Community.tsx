
import React, { useMemo } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Search, PlusSquare, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackPosts, normalizeStories } from '../lib/healthData';

const motion = motionBase as any;

export const Community: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data: storiesResponse } = useQuery({
    queryKey: ['web-stories'],
    queryFn: () => api.getStories().catch(() => null),
  });

  const posts = useMemo(() => normalizeStories(unwrapData<any[]>(storiesResponse)), [storiesResponse]);
  const filteredPosts = posts.filter((post) =>
    post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.badge.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-cyan-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Community feed</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">FitSocial</h1>
          <p className="text-slate-400 font-medium mt-3 max-w-2xl">Share milestones, cheer on competitors, and keep your circle motivated.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black flex items-center gap-2">
          <PlusSquare size={18} /> Share Update
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search posts, athletes, or badges..."
          className="w-full glass rounded-[2rem] border border-white/5 py-5 pl-14 pr-6 text-slate-200 outline-none focus:border-emerald-500/40"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {fallbackPosts.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="min-w-[220px] rounded-[1.5rem] p-4 bg-white/5 border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-[2px]">
                <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-slate-950" />
              </div>
              <div>
                <div className="text-sm font-black text-white">{story.name}</div>
                <div className="text-xs text-slate-500">@{story.username}</div>
              </div>
            </div>
            <div className="mt-4 text-xs font-black text-emerald-300 uppercase tracking-widest">Story</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-[2.5rem] border border-white/5 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={post.avatar} alt={post.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-black text-white">{post.name}</div>
                  <div className="text-sm text-slate-500">@{post.username}</div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-black">Follow</button>
            </div>
            <img src={post.mediaUrl} alt={post.caption} className="w-full h-72 object-cover" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span className="text-xs font-black uppercase tracking-widest">{post.badge}</span>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed">{post.caption}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-5 text-slate-400">
                  <button className="flex items-center gap-2 hover:text-rose-300 transition-colors"><Heart size={20} /> {post.likes.toLocaleString()}</button>
                  <button className="flex items-center gap-2 hover:text-cyan-300 transition-colors"><MessageCircle size={20} /> {post.comments}</button>
                  <button className="flex items-center gap-2 hover:text-emerald-300 transition-colors"><Share2 size={20} /> Share</button>
                </div>
                <button className="text-slate-400 hover:text-amber-300 transition-colors"><Bookmark size={20} /></button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="glass rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-white">No posts found</h2>
          <p className="text-slate-400 mt-2">Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

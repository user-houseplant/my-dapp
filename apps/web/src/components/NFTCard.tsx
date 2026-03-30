'use client';

import { Image as ImageIcon, ExternalLink, User } from 'lucide-react';
import { cn } from '@/lib/erc721-stylus/src/cn';

interface NFTCardProps {
  id: string;
  owner: string;
  name: string;
  imageUrl?: string;
  explorerUrl?: string;
}

export function NFTCard({ id, owner, name, imageUrl, explorerUrl }: NFTCardProps) {
  return (
    <div className="group relative bg-white/5 dark:bg-black/20 rounded-xl border border-white/10 overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10">
      <div className="aspect-square relative flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-cyan-600/20 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} #${id}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-50">
            <ImageIcon className="w-12 h-12 text-violet-400/50" />
            <span className="text-[10px] font-mono text-violet-400/50">#{id}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
           {explorerUrl && (
             <a
               href={`${explorerUrl}/token/${id}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 mb-2"
             >
               View on Explorer <ExternalLink className="w-3 h-3" />
             </a>
           )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
            {name}
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full border border-violet-500/20">
            #{id}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-3 p-2 bg-white/5 rounded-lg border border-white/5">
          <User className="w-3 h-3 text-forge-muted" />
          <p className="text-[10px] text-forge-muted font-mono truncate">
            {owner.slice(0, 6)}...{owner.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}

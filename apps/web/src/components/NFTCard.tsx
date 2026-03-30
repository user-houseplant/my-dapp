import { motion } from 'framer-motion';
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
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-violet-500/50 transition-colors duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]"
    >
      <div className="aspect-square relative flex items-center justify-center bg-gradient-to-br from-violet-600/10 via-slate-900 to-cyan-600/10 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} #${id}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-50">
            <ImageIcon className="w-12 h-12 text-violet-400/50" />
            <span className="text-[10px] font-mono text-violet-400/50">#{id}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
           {explorerUrl && (
             <motion.a
               whileHover={{ x: 5 }}
               href={`${explorerUrl}/token/${id}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300"
             >
               Explorer <ExternalLink className="w-3 h-3" />
             </motion.a>
           )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
            {name}
          </h3>
          <span className="text-[10px] px-2.5 py-1 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20 font-bold">
            #{id}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-4 p-2.5 bg-black/40 rounded-xl border border-white/5 group-hover:border-violet-500/20 transition-colors">
          <div className="p-1.5 bg-white/5 rounded-lg">
            <User className="w-3 h-3 text-violet-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-forge-muted font-bold uppercase tracking-widest">Collector</span>
            <p className="text-[10px] text-white/70 font-mono truncate max-w-[120px]">
              {owner.slice(0, 6)}...{owner.slice(-4)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

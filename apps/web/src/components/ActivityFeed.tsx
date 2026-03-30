'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, History, ArrowRight, User, ExternalLink } from 'lucide-react';
import { ERC721_ABI } from '../lib/erc721-stylus/src/abi';
import { cn } from '../lib/erc721-stylus/src/cn';

interface ActivityFeedProps {
  contractAddress: string;
  explorerUrl?: string;
}

interface ActivityItem {
  id: string;
  from: string;
  to: string;
  tokenId: string;
  timestamp?: number;
  hash: string;
}

export function ActivityFeed({ contractAddress, explorerUrl }: ActivityFeedProps) {
  const publicClient = usePublicClient();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivity = useCallback(async () => {
    if (!contractAddress || !publicClient) return;

    setIsLoading(true);
    try {
      const currentBlock = await publicClient.getBlockNumber();
      const logs = await publicClient.getLogs({
        address: contractAddress as `0x${string}`,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { type: 'address', name: 'from', indexed: true },
            { type: 'address', name: 'to', indexed: true },
            { type: 'uint256', name: 'token_id', indexed: true },
          ],
        },
        fromBlock: currentBlock - 2000n,
        toBlock: 'latest',
      });

      const formattedActivities = logs.map((log: any) => ({
        id: log.transactionHash,
        from: log.args.from,
        to: log.args.to,
        tokenId: log.args.token_id.toString(),
        hash: log.transactionHash,
      })).reverse();

      setActivities(formattedActivities.slice(0, 10));
    } catch (err) {
      console.error('Activity fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, publicClient]);

  useEffect(() => {
    if (contractAddress) {
      fetchActivity();
      const interval = setInterval(fetchActivity, 10000);
      return () => clearInterval(interval);
    }
  }, [contractAddress, fetchActivity]);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">Live Activity</h2>
        </div>
        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-violet-400" />}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 max-h-[500px]">
        <AnimatePresence initial={false} mode="popLayout">
          {activities.map((activity) => (
            <motion.div 
              key={activity.hash} 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ x: 5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                    activity.from === '0x0000000000000000000000000000000000000000' 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                  )}>
                    {activity.from === '0x0000000000000000000000000000000000000000' ? '✨ New Mint' : '🔄 Transfer'}
                  </span>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={`${explorerUrl}/tx/${activity.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3 text-violet-400" />
                  </motion.a>
                </div>
                
                <div className="flex items-center gap-3 text-[10px] text-white/50 mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-black/20 rounded-lg">
                    <User className="w-2.5 h-2.5 opacity-50" />
                    <span className="font-mono">{activity.from.slice(0, 4)}...{activity.from.slice(-4)}</span>
                  </div>
                  <ArrowRight className="w-2.5 h-2.5 opacity-30" />
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-black/20 rounded-lg">
                    <User className="w-2.5 h-2.5 opacity-50" />
                    <span className="font-mono">{activity.to.slice(0, 4)}...{activity.to.slice(-4)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-forge-muted font-bold opacity-60">Asset ID</span>
                  <span className="text-[10px] text-white font-bold bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                    #{activity.tokenId}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="py-12 text-center"
          >
            <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p className="text-xs font-bold tracking-widest uppercase">Awaiting Signals...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
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
      // Fetch last 1000 blocks of Transfer events
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
        fromBlock: currentBlock - 2000n, // Look back 2000 blocks
        toBlock: 'latest',
      });

      const formattedActivities = logs.map((log: any) => ({
        id: log.transactionHash,
        from: log.args.from,
        to: log.args.to,
        tokenId: log.args.token_id.toString(),
        hash: log.transactionHash,
      })).reverse();

      setActivities(formattedActivities.slice(0, 10)); // Just show top 10
    } catch (err) {
      console.error('Activity fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, publicClient]);

  useEffect(() => {
    if (contractAddress) {
      fetchActivity();
      // Poll every 10 seconds for new activity
      const interval = setInterval(fetchActivity, 10000);
      return () => clearInterval(interval);
    }
  }, [contractAddress, fetchActivity]);

  return (
    <div className="bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Activity</h2>
        </div>
        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-forge-muted" />}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 max-h-[500px]">
        {activities.map((activity) => (
          <div 
            key={activity.hash} 
            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded-full font-bold">
                {activity.from === '0x0000000000000000000000000000000000000000' ? '✨ MINT' : '🔄 TRANSFER'}
              </span>
              <a 
                href={`${explorerUrl}/tx/${activity.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="w-3 h-3 text-forge-muted hover:text-white" />
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-white/70">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 opacity-50" />
                <span className="font-mono">{activity.from.slice(0, 4)}...{activity.from.slice(-4)}</span>
              </div>
              <ArrowRight className="w-2.5 h-2.5 opacity-30" />
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 opacity-50" />
                <span className="font-mono">{activity.to.slice(0, 4)}...{activity.to.slice(-4)}</span>
              </div>
            </div>
            
            <p className="mt-2 text-[10px] text-forge-muted bg-black/40 p-1.5 rounded-md border border-white/5">
              Token ID <span className="text-white font-bold">#{activity.tokenId}</span>
            </p>
          </div>
        ))}

        {activities.length === 0 && !isLoading && (
          <div className="py-10 text-center opacity-30">
            <p className="text-xs">No recent activity detected</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { WalletButton } from '@/components/wallet-button';
import { ERC721InteractionPanel } from '@/lib/erc721-stylus/src/ERC721InteractionPanel';
import { NFTGallery } from '@/components/NFTGallery';
import { ActivityFeed } from '@/components/ActivityFeed';
import { Sparkles, LayoutDashboard, History, Zap } from 'lucide-react';

export default function Home() {
  const [activeNetwork, setActiveNetwork] = useState<string>('arbitrum-sepolia');
  const [contractAddress, setContractAddress] = useState<string>('0xe2a8cd01354ecc63a8341a849e9b89f14ff9f08f');

  // Network Explorer URLs
  const explorerUrls: Record<string, string> = {
    'arbitrum-sepolia': 'https://sepolia.arbiscan.io',
    'arbitrum': 'https://arbiscan.io',
    'superposition-testnet': 'https://testnet-explorer.superposition.so',
    'robinhood-testnet': 'https://explorer.testnet.chain.robinhood.com',
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(76,29,149,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(8,145,178,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/20 backdrop-blur-sm shadow-xl shadow-violet-500/10">
                <LayoutDashboard className="w-8 h-8 text-violet-400" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                DApp Dashboard
              </h1>
            </div>
            <p className="text-forge-muted font-medium ml-1">
              Real-time Web3 analytics and contract interaction.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="px-4 py-2 bg-violet-600/20 rounded-xl border border-violet-500/20 flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Stylus Optimized</span>
            </div>
            <WalletButton />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="w-full">
                  <ERC721InteractionPanel 
                    onNetworkChange={setActiveNetwork}
                    onAddressChange={setContractAddress}
                  />
               </div>
               
               <div className="h-full">
                  <ActivityFeed 
                    contractAddress={contractAddress}
                    explorerUrl={explorerUrls[activeNetwork]}
                  />
               </div>
            </div>

            <div className="bg-white/5 dark:bg-black/10 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-sm min-h-[600px]">
              <NFTGallery 
                contractAddress={contractAddress}
                network={activeNetwork}
                explorerUrl={explorerUrls[activeNetwork]}
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 flex flex-col items-center">
            <div className="w-full p-6 rounded-3xl bg-gradient-to-br from-violet-600/10 to-transparent border border-white/10 text-center">
              <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              <h3 className="text-sm font-bold mb-2">Community Ecosystem</h3>
              <p className="text-xs text-forge-muted leading-relaxed">
                Explore the latest mints and transactions across the Arbitrum Stylus network. 
                Interact with the most efficient smart contracts in Web3.
              </p>
            </div>
            
            <div className="w-full p-6 rounded-3xl bg-white/5 border border-white/10">
               <h4 className="text-xs font-bold uppercase tracking-widest text-forge-muted mb-4 flex items-center gap-2">
                 <History className="w-3 h-3" /> Network Status
               </h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-forge-muted">Active Protocol</span>
                    <span className="text-xs font-bold text-green-400">Online</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-forge-muted">Relay Sync</span>
                    <span className="text-xs font-bold text-violet-400">Wait-Free</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

       <footer className="mt-32 pb-12 text-center text-[10px] text-forge-muted/50 border-t border-white/5 pt-12">
          <p>© 2026 My DApp. Powered by Stylus & [N]skills.</p>
       </footer>
    </main>
  );
}
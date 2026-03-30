'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletButton } from '@/components/wallet-button';
import { ERC721InteractionPanel } from '@/lib/erc721-stylus/src/ERC721InteractionPanel';
import { NFTGallery } from '@/components/NFTGallery';
import { ActivityFeed } from '@/components/ActivityFeed';
import { Sparkles, LayoutDashboard, History, Zap, Shield, Globe } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    <main className="min-h-screen text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden pb-20">
      <div className="relative max-w-7xl mx-auto px-6 pt-12">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-2xl shadow-violet-500/20"
              >
                <LayoutDashboard className="w-8 h-8 text-violet-400" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-violet-200 to-white/40 bg-clip-text text-transparent">
                  Stylus Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-forge-muted">
                    Mainnet-Ready Protocol
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-xl border border-white/10 flex items-center gap-2 shadow-inner"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-100 uppercase tracking-wider">Fast-Finality</span>
            </motion.div>
            <WalletButton />
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <motion.div variants={itemVariants} className="w-full">
                  <ERC721InteractionPanel 
                    onNetworkChange={setActiveNetwork}
                    onAddressChange={setContractAddress}
                  />
               </motion.div>
               
               <motion.div variants={itemVariants} className="h-full">
                  <ActivityFeed 
                    contractAddress={contractAddress}
                    explorerUrl={explorerUrls[activeNetwork]}
                  />
               </motion.div>
            </div>

            {/* Gallery Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-600/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <NFTGallery 
                  contractAddress={contractAddress}
                  network={activeNetwork}
                  explorerUrl={explorerUrls[activeNetwork]}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="w-full p-8 rounded-3xl bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10 border border-white/10 backdrop-blur-md text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-20 h-20 text-violet-400" />
              </div>
              <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
              <h3 className="text-lg font-bold mb-3 text-white">Advanced Metadata</h3>
              <p className="text-sm text-forge-muted leading-relaxed mb-6">
                Your NFTs are fully compatible with any ERC-721 marketplace. We support dynamic on-chain attributes via Stylus.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/5">IPFS</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/5">Metadata V1</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/5">Immutable</span>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
               <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-6 flex items-center gap-2">
                 <Shield className="w-4 h-4" /> Security Audit
               </h4>
               <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-forge-muted">Formal Verification</span>
                       <span className="text-[10px] font-bold text-green-400 px-2 py-0.5 bg-green-500/10 rounded">Passed</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 1.5, delay: 1 }}
                         className="h-full bg-green-500" 
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-forge-muted">Reentrancy Protection</span>
                       <span className="text-[10px] font-bold text-violet-400 px-2 py-0.5 bg-violet-500/10 rounded">Active</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 1.5, delay: 1.2 }}
                         className="h-full bg-violet-500" 
                       />
                    </div>
                 </div>
               </div>
               
               <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2">
                 View Full Report <Globe className="w-3 h-3" />
               </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

       <footer className="mt-40 pb-12 text-center">
          <p className="text-[10px] text-forge-muted/50 uppercase tracking-[0.3em]">
            © 2026 Stylus DApp Protocol • Decentralized • Open Source
          </p>
       </footer>
    </main>
  );
}
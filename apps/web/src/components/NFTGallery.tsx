'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import { Image as ImageIcon, Loader2, Sparkles, User, RefreshCw } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { ERC721_ABI } from '../lib/erc721-stylus/src/abi';
import { cn } from '../lib/erc721-stylus/src/cn';

interface NFTGalleryProps {
  contractAddress: string;
  network?: string;
  explorerUrl?: string;
}

interface NFTItem {
  id: string;
  owner: string;
  name: string;
  imageUrl: string | undefined;
}

export function NFTGallery({ contractAddress, network, explorerUrl }: NFTGalleryProps) {
  const { address: userAddress, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSupply, setTotalSupply] = useState<number>(0);

  const fetchNFTs = useCallback(async () => {
    if (!contractAddress || !publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get total supply
      const supply = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'total_supply',
      }) as bigint;

      const supplyNum = Number(supply);
      setTotalSupply(supplyNum);

      // 2. Fetch last 20 NFTs (or all if less than 20)
      const startId = Math.max(0, supplyNum - 20);
      const ids = Array.from({ length: supplyNum - startId }, (_, i) => BigInt(startId + i));

      // Fetch names and owners
      const nftData = await Promise.all(
        ids.map(async (id) => {
          try {
            const owner = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: ERC721_ABI,
              functionName: 'owner_of',
              args: [id],
            }) as string;

            const name = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: ERC721_ABI,
              functionName: 'name',
            }) as string;

            // Optional: try to fetch token_uri
            let imageUrl: string | undefined = undefined;
            try {
              const uri = await publicClient.readContract({
                address: contractAddress as `0x${string}`,
                abi: ERC721_ABI,
                functionName: 'token_uri',
                args: [id],
              }) as string;
              // Simple heuristic: if it's an IPFS or HTTP URL, use it (or mock it for now)
              if (uri.startsWith('http')) imageUrl = uri;
            } catch (e) {
              // Metadata function might not exists yet on old contracts
            }

            return {
              id: id.toString(),
              owner,
              name: `${name} #${id}`,
              imageUrl,
            };
          } catch (e) {
            console.error(`Error fetching NFT ${id}:`, e);
            return null;
          }
        })
      );

      const filteredNfts = nftData.filter((n): n is NFTItem => n !== null);
      setNfts(filteredNfts.reverse());
    } catch (err: any) {
      console.error('Gallery fetch error:', err);
      setError('Could not load gallery contents. Make sure the contract is deployed on this network.');
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, publicClient]);

  useEffect(() => {
    if (contractAddress) {
      fetchNFTs();
    }
  }, [contractAddress, fetchNFTs]);

  const userNfts = nfts.filter(nft => nft.owner.toLowerCase() === userAddress?.toLowerCase());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-600/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">NFT Gallery</h2>
            <p className="text-xs text-forge-muted">Total Collection: {totalSupply} NFTs</p>
          </div>
        </div>
        <button
          onClick={fetchNFTs}
          disabled={isLoading}
          className="p-2 hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4 text-violet-400", isLoading && "animate-spin")} />
        </button>
      </div>

      {isLoading && nfts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
          <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
          <p className="text-sm font-medium animate-pulse">Syncing with chain...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isConnected && userNfts.length > 0 && (
            <div className="col-span-full border-b border-white/10 pb-4 mb-2">
              <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Your Assets
              </h3>
            </div>
          )}
          
          {isConnected && userNfts.map((nft) => (
            <NFTCard
              key={`user-${nft.id}`}
              id={nft.id}
              owner={nft.owner}
              name={nft.name}
              imageUrl={nft.imageUrl}
              explorerUrl={explorerUrl}
            />
          ))}

          <div className="col-span-full border-b border-white/10 pb-4 mb-2 mt-4">
            <h3 className="text-xs font-bold text-forge-muted uppercase tracking-widest">
              Recent Collection
            </h3>
          </div>

          {nfts.map((nft) => (
            <NFTCard
              key={`recent-${nft.id}`}
              id={nft.id}
              owner={nft.owner}
              name={nft.name}
              imageUrl={nft.imageUrl}
              explorerUrl={explorerUrl}
            />
          ))}

          {nfts.length === 0 && !isLoading && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
                <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-forge-muted text-sm">No NFTs found in this collection yet.</p>
              </div>
          )}
        </div>
      )}
    </div>
  );
}

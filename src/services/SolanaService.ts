import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { MarketPrice } from '../types';

export class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(CONFIG.SOLANA.RPC_ENDPOINT!);
  }

  async getPrices(marketAddresses: PublicKey[]): Promise<MarketPrice[]> {
    try {
      const prices = await Promise.all(
        marketAddresses.map(async (address) => {
          const market = await Market.load(
            this.connection,
            address,
            {},
            Program.SERUM_DEX_PROGRAM_ID
          );
          
          const bids = await market.loadBids(this.connection);
          const asks = await market.loadAsks(this.connection);
          
          const bestBid = bids.getBestBid()?.price || 0;
          const bestAsk = asks.getBestAsk()?.price || 0;
          
          return {
            exchange: 'solana',
            symbol: market.address.toBase58(),
            price: (bestBid + bestAsk) / 2,
            timestamp: Date.now(),
            volume24h: 0  // Need additional API call
          };
        })
      );
      
      return prices;
    } catch (error) {
      console.error('Error fetching Solana prices:', error);
      throw error;
    }
  }
}

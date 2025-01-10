import { Spot } from '@binance/connector';
import { MarketPrice } from '../types';

export class BinanceService {
  private client: Spot;
  private ws: WebSocket | null = null;

  constructor() {
    this.client = new Spot(
      CONFIG.BINANCE.API_KEY!,
      CONFIG.BINANCE.API_SECRET!
    );
  }

  async getPrices(symbols: string[]): Promise<MarketPrice[]> {
    try {
      const tickers = await this.client.tickerPrice();
      return tickers.data
        .filter(ticker => symbols.includes(ticker.symbol))
        .map(ticker => ({
          exchange: 'binance',
          symbol: ticker.symbol,
          price: parseFloat(ticker.price),
          timestamp: Date.now(),
          volume24h: 0  // Need to fetch separately
        }));
    } catch (error) {
      console.error('Error fetching Binance prices:', error);
      throw error;
    }
  }

  setupWebSocket(symbols: string[], callback: (price: MarketPrice) => void) {
    const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`);
    const wsUrl = `wss://stream.binance.com:9443/ws/${streams.join('/')}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback({
        exchange: 'binance',
        symbol: data.s,
        price: parseFloat(data.c),
        timestamp: data.E,
        volume24h: parseFloat(data.v)
      });
    };
  }
}

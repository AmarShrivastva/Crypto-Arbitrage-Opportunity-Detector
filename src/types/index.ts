export interface MarketPrice {
    exchange: 'binance' | 'solana';
    symbol: string;
    price: number;
    timestamp: number;
    volume24h: number;
  }
  
  export interface ArbitrageOpportunity {
    symbol: string;
    buyExchange: string;
    sellExchange: string;
    buyPrice: number;
    sellPrice: number;
    profitPercentage: number;
    estimatedProfit: number;
    timestamp: number;
  }
  
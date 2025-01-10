import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  BINANCE: {
    API_KEY: process.env.BINANCE_API_KEY,
    API_SECRET: process.env.BINANCE_SECRET_KEY,
    MAKER_FEE: 0.001,  // 0.1%
    TAKER_FEE: 0.001   // 0.1%
  },
  SOLANA: {
    RPC_ENDPOINT: process.env.SOLANA_RPC_ENDPOINT,
    DEX_FEE: 0.003,    // 0.3%
    ESTIMATED_TX_COST: 0.000005  // SOL
  },
  GENERAL: {
    MIN_PROFIT_THRESHOLD: 0.005,  // 0.5%
    UPDATE_INTERVAL: 1000,        // 1 second
    MAX_SLIPPAGE: 0.01           // 1%
  }
};
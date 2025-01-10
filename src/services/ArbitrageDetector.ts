export class ArbitrageDetector {
    private binanceService: BinanceService;
    private solanaService: SolanaService;
    private opportunities: ArbitrageOpportunity[] = [];
  
    constructor() {
      this.binanceService = new BinanceService();
      this.solanaService = new SolanaService();
    }
  
    calculateProfitability(
      binancePrice: MarketPrice,
      solanaPrice: MarketPrice
    ): ArbitrageOpportunity | null {
      const binanceFee = CONFIG.BINANCE.TAKER_FEE;
      const solanaFee = CONFIG.SOLANA.DEX_FEE;
      const txCost = CONFIG.SOLANA.ESTIMATED_TX_COST;
  
      // Calculate total costs including fees
      const binanceCost = binancePrice.price * (1 + binanceFee);
      const solanaCost = solanaPrice.price * (1 + solanaFee) + txCost;
  
      // Check both directions for arbitrage
      const binanceToSolana = solanaPrice.price - binanceCost;
      const solanaToBinance = binancePrice.price - solanaCost;
  
      if (binanceToSolana > CONFIG.GENERAL.MIN_PROFIT_THRESHOLD * binancePrice.price) {
        return {
          symbol: binancePrice.symbol,
          buyExchange: 'binance',
          sellExchange: 'solana',
          buyPrice: binancePrice.price,
          sellPrice: solanaPrice.price,
          profitPercentage: (binanceToSolana / binancePrice.price) * 100,
          estimatedProfit: binanceToSolana,
          timestamp: Date.now()
        };
      }
  
      if (solanaToBinance > CONFIG.GENERAL.MIN_PROFIT_THRESHOLD * solanaPrice.price) {
        return {
          symbol: binancePrice.symbol,
          buyExchange: 'solana',
          sellExchange: 'binance',
          buyPrice: solanaPrice.price,
          sellPrice: binancePrice.price,
          profitPercentage: (solanaToBinance / solanaPrice.price) * 100,
          estimatedProfit: solanaToBinance,
          timestamp: Date.now()
        };
      }
  
      return null;
    }
  
    async startMonitoring(symbols: string[]) {
      // Set up WebSocket for Binance
      this.binanceService.setupWebSocket(symbols, async (binancePrice) => {
        try {
          // Get corresponding Solana price
          const solanaPrice = await this.solanaService.getPrices([
            new PublicKey(binancePrice.symbol)
          ]);
  
          const opportunity = this.calculateProfitability(
            binancePrice,
            solanaPrice[0]
          );
  
          if (opportunity) {
            this.opportunities.push(opportunity);
            this.emitOpportunity(opportunity);
          }
        } catch (error) {
          console.error('Error in arbitrage detection:', error);
        }
      });
    }
  
    private emitOpportunity(opportunity: ArbitrageOpportunity) {
      // Implement event emitter or WebSocket to notify frontend
      console.log('New arbitrage opportunity:', opportunity);
    }
  }
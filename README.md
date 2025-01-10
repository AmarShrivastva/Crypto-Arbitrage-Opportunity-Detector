# Crypto Arbitrage Monitor

A real-time arbitrage monitoring system for cryptocurrency trading opportunities between Binance CEX and Solana DEX markets.

## Overview

This project monitors price differences between Binance and Solana DEX markets for USDC trading pairs, identifying profitable arbitrage opportunities while accounting for all associated fees and transaction costs.

### Key Features

- Real-time price monitoring
- Automated fee calculation
- Profit viability analysis
- Interactive dashboard
- Historical data tracking
- Support for multiple trading pairs

## Technical Implementation

### Backend

- Python async/await for efficient API polling
- Decimal type for precise calculations
- Comprehensive fee consideration:
  - Binance maker/taker fees
  - Solana DEX swap fees
  - Network transaction costs
- Error handling and rate limiting

### Frontend

- React for UI components
- Recharts for data visualization
- Real-time updates via polling
- Responsive design
- Error handling and loading states

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-arbitrage-monitor.git
cd crypto-arbitrage-monitor
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Binance API credentials:
```
BIN

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, RefreshCcw, DollarSign, AlertCircle } from 'lucide-react';

const ArbitrageDashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Simulated data for development
  useEffect(() => {
    const mockData = {
      opportunities: [
        {
          symbol: "BTC/USDC",
          buyExchange: "binance",
          sellExchange: "solana",
          buyPrice: 65420.50,
          sellPrice: 65520.75,
          profitPercentage: 0.153,
          estimatedProfit: 100.25,
          timestamp: Date.now()
        },
        {
          symbol: "ETH/USDC",
          buyExchange: "solana",
          sellExchange: "binance",
          buyPrice: 3280.25,
          sellPrice: 3285.50,
          profitPercentage: 0.160,
          estimatedProfit: 5.25,
          timestamp: Date.now() - 5000
        }
      ],
      historical: Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() - i * 3600000).toLocaleTimeString(),
        btcSpread: Math.random() * 0.3,
        ethSpread: Math.random() * 0.25,
      })).reverse()
    };

    setOpportunities(mockData.opportunities);
    setHistoricalData(mockData.historical);
    setIsConnected(true);
    setLastUpdate(new Date());

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setOpportunities(prev => [
        ...prev,
        {
          symbol: Math.random() > 0.5 ? "BTC/USDC" : "ETH/USDC",
          buyExchange: Math.random() > 0.5 ? "binance" : "solana",
          sellExchange: Math.random() > 0.5 ? "binance" : "solana",
          buyPrice: 65420.50 + Math.random() * 100,
          sellPrice: 65520.75 + Math.random() * 100,
          profitPercentage: 0.1 + Math.random() * 0.1,
          estimatedProfit: 80 + Math.random() * 40,
          timestamp: Date.now()
        }
      ].slice(-5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 w-auto mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Arbitrage Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span><br />
          {lastUpdate && (
            <span className="text-sm  text-gray-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2">
            <TrendingUp className="h-4 w-4" />
            Active Opportunities
          </div>
          <div className="text-3xl font-bold">{opportunities.length}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2">
            <DollarSign className="h-4 w-4" />
            Best Current Spread
          </div>
          <div className="text-3xl font-bold">
            {Math.max(...opportunities.map(o => o.profitPercentage)).toFixed(3)}%
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 text-lg font-semibold mb-2">
            <RefreshCcw className="h-4 w-4" />
            Update Frequency
          </div>
          <div className="text-3xl font-bold">1s</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-lg font-semibold mb-4">Recent Opportunities</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-black-200">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Symbol</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Buy At</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Sell At</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Profit %</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Est. Profit</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{opp.symbol}</td>
                    <td className="px-4 py-2">{opp.buyExchange} (${opp.buyPrice.toFixed(2)})</td>
                    <td className="px-4 py-2">{opp.sellExchange} (${opp.sellPrice.toFixed(2)})</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        opp.profitPercentage > 0.15 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {opp.profitPercentage.toFixed(3)}%
                      </span>
                    </td>
                    <td className="px-4 py-2">${opp.estimatedProfit.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-lg font-semibold mb-4">Spread History (24h)</div>
          <LineChart
            width={700}
            height={300}
            data={historicalData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="btcSpread" stroke="#ff7300" name="BTC/USDC Spread %" />
            <Line type="monotone" dataKey="ethSpread" stroke="#387908" name="ETH/USDC Spread %" />
          </LineChart>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <div className="font-semibold text-blue-700">Important Notice</div>
        </div>
        <div className="mt-2 text-blue-700">
          Arbitrage opportunities shown here are indicative only. Actual profits may vary due to execution speed, 
          slippage, and changing market conditions. Always verify prices before trading.
        </div>
      </div>
    </div>
  );
};

export default ArbitrageDashboard;
// StockCrypto Analyzer - Complete JavaScript Implementation
class StockCryptoAnalyzer {
    constructor() {
        this.currentSymbol = '';
        this.currentAssetType = 'crypto';
        this.currentTimeframe = '1d';
        this.chart = null;
        this.watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        this.priceData = [];
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeChart();
        this.loadWatchlist();
        this.loadDefaultData();
    }

    setupEventListeners() {
        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeAsset();
        });

        // Enter key support
        document.getElementById('symbolInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeAsset();
            }
        });

        // Watchlist functionality
        document.getElementById('addToWatchlist').addEventListener('click', () => {
            this.addToWatchlist();
        });

        document.getElementById('watchlistInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addToWatchlist();
            }
        });

        // Asset type change
        document.getElementById('assetType').addEventListener('change', (e) => {
            this.currentAssetType = e.target.value;
            this.updatePlaceholder();
        });

        // Timeframe change
        document.getElementById('timeframe').addEventListener('change', (e) => {
            this.currentTimeframe = e.target.value;
            if (this.currentSymbol) {
                this.analyzeAsset();
            }
        });
    }

    updatePlaceholder() {
        const input = document.getElementById('symbolInput');
        if (this.currentAssetType === 'crypto') {
            input.placeholder = 'Masukkan symbol (contoh: BTC, ETH, ADA)';
        } else {
            input.placeholder = 'Masukkan symbol (contoh: AAPL, GOOGL, TSLA)';
        }
    }

    async analyzeAsset() {
        const symbol = document.getElementById('symbolInput').value.trim().toUpperCase();
        if (!symbol) {
            this.showStatus('Masukkan symbol terlebih dahulu!', 'error');
            return;
        }

        this.currentSymbol = symbol;
        this.showStatus('Menganalisis data...', 'loading');
        
        try {
            // Simulate API calls with realistic data
            const priceData = await this.fetchPriceData(symbol);
            const technicalData = await this.fetchTechnicalData(symbol);
            const marketData = await this.fetchMarketData(symbol);

            this.updatePriceDisplay(priceData);
            this.updateQuickStats(marketData);
            this.updateTechnicalAnalysis(technicalData);
            this.updateTradingSignals(technicalData);
            this.updatePrediction(technicalData);
            this.updateMarketOverview();
            this.updateChart(priceData.historical);

            this.showStatus(`Analisis ${symbol} berhasil dimuat!`, 'success');
            
            // Auto refresh every 30 seconds
            this.startAutoRefresh();
            
        } catch (error) {
            console.error('Error analyzing asset:', error);
            this.showStatus('Gagal mengambil data. Coba lagi nanti.', 'error');
        }
    }

    async fetchPriceData(symbol) {
        // Simulate real API call with realistic crypto/stock data
        await this.delay(1000);
        
        const basePrice = this.currentAssetType === 'crypto' ? 
            this.getCryptoBasePrice(symbol) : 
            this.getStockBasePrice(symbol);
            
        const change = (Math.random() - 0.5) * 0.1; // -5% to +5%
        const currentPrice = basePrice * (1 + change);
        const priceChange = currentPrice - basePrice;
        const percentChange = (priceChange / basePrice) * 100;

        return {
            symbol: symbol,
            currentPrice: currentPrice,
            priceChange: priceChange,
            percentChange: percentChange,
            high24h: currentPrice * (1 + Math.random() * 0.05),
            low24h: currentPrice * (1 - Math.random() * 0.05),
            volume24h: Math.random() * 1000000000,
            historical: this.generateHistoricalData(basePrice, 30)
        };
    }

    async fetchTechnicalData(symbol) {
        await this.delay(800);
        
        const rsi = 30 + Math.random() * 40; // 30-70
        const macd = (Math.random() - 0.5) * 2;
        const ma20 = Math.random() * 100;
        
        return {
            rsi: rsi,
            rsiSignal: rsi > 70 ? 'bearish' : rsi < 30 ? 'bullish' : 'neutral',
            macd: macd,
            macdSignal: macd > 0 ? 'bullish' : 'bearish',
            ma20: ma20,
            maSignal: Math.random() > 0.5 ? 'bullish' : 'bearish',
            support: Math.random() * 50000,
            resistance: Math.random() * 60000,
            overallSignal: this.calculateOverallSignal(rsi, macd)
        };
    }

    async fetchMarketData(symbol) {
        await this.delay(600);
        
        return {
            marketCap: Math.random() * 100000000000,
            rank: Math.floor(Math.random() * 100) + 1,
            supply: Math.random() * 1000000000,
            fearGreedIndex: Math.floor(Math.random() * 100),
            vix: 15 + Math.random() * 20
        };
    }

    getCryptoBasePrice(symbol) {
        const cryptoPrices = {
            'BTC': 45000,
            'ETH': 3000,
            'ADA': 0.5,
            'DOT': 25,
            'LINK': 15,
            'UNI': 8,
            'DOGE': 0.08,
            'XRP': 0.6,
            'LTC': 150,
            'BCH': 400
        };
        return cryptoPrices[symbol] || Math.random() * 1000;
    }

    getStockBasePrice(symbol) {
        const stockPrices = {
            'AAPL': 175,
            'GOOGL': 2800,
            'TSLA': 800,
            'AMZN': 3200,
            'MSFT': 300,
            'NVDA': 220,
            'META': 320,
            'NFLX': 400,
            'AMD': 100,
            'BABA': 85
        };
        return stockPrices[symbol] || Math.random() * 500;
    }

    generateHistoricalData(basePrice, days) {
        const data = [];
        let price = basePrice;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Simulate price movement
            price *= (1 + (Math.random() - 0.5) * 0.05);
            
            data.push({
                date: date.toISOString().split('T')[0],
                price: price,
                volume: Math.random() * 1000000
            });
        }
        
        return data;
    }

    calculateOverallSignal(rsi, macd) {
        let bullishCount = 0;
        let bearishCount = 0;
        
        if (rsi < 30) bullishCount++;
        if (rsi > 70) bearishCount++;
        if (macd > 0) bullishCount++;
        if (macd < 0) bearishCount++;
        
        if (bullishCount > bearishCount) return 'buy';
        if (bearishCount > bullishCount) return 'sell';
        return 'hold';
    }

    updatePriceDisplay(data) {
        document.getElementById('currentPrice').textContent = this.formatCurrency(data.currentPrice);
        
        const changeElement = document.getElementById('priceChange');
        const changeText = `${data.priceChange >= 0 ? '+' : ''}${this.formatCurrency(data.priceChange)} (${data.percentChange.toFixed(2)}%)`;
        changeElement.textContent = changeText;
        changeElement.className = `price-change ${data.priceChange >= 0 ? 'positive' : 'negative'}`;
        
        document.getElementById('high24h').textContent = this.formatCurrency(data.high24h);
        document.getElementById('low24h').textContent = this.formatCurrency(data.low24h);
        document.getElementById('volume24h').textContent = this.formatVolume(data.volume24h);
        document.getElementById('lastUpdate').textContent = `Terakhir update: ${new Date().toLocaleTimeString('id-ID')}`;
    }

    updateQuickStats(data) {
        document.getElementById('marketCap').textContent = this.formatCurrency(data.marketCap, true);
        document.getElementById('marketRank').textContent = `#${data.rank}`;
        document.getElementById('supply').textContent = this.formatVolume(data.supply);
    }

    updateTechnicalAnalysis(data) {
        // RSI
        document.getElementById('rsi').textContent = data.rsi.toFixed(2);
        const rsiSignal = document.getElementById('rsiSignal');
        rsiSignal.textContent = data.rsiSignal.toUpperCase();
        rsiSignal.className = `indicator-signal ${data.rsiSignal}`;

        // MACD
        document.getElementById('macd').textContent = data.macd.toFixed(4);
        const macdSignal = document.getElementById('macdSignal');
        macdSignal.textContent = data.macdSignal.toUpperCase();
        macdSignal.className = `indicator-signal ${data.macdSignal}`;

        // Moving Average
        document.getElementById('ma').textContent = data.ma20.toFixed(2);
        const maSignal = document.getElementById('maSignal');
        maSignal.textContent = data.maSignal.toUpperCase();
        maSignal.className = `indicator-signal ${data.maSignal}`;

        // Support & Resistance
        document.getElementById('support1').textContent = this.formatCurrency(data.support);
        document.getElementById('resistance1').textContent = this.formatCurrency(data.resistance);

        // Technical Summary
        const summary = this.getTechnicalSummary(data);
        const summaryElement = document.getElementById('technicalSummary');
        summaryElement.textContent = summary.text;
        summaryElement.className = `summary-badge ${summary.signal}`;
    }

    updateTradingSignals(data) {
        const signalElement = document.getElementById('currentSignal');
        signalElement.textContent = data.overallSignal.toUpperCase();
        signalElement.className = `signal-badge ${data.overallSignal}`;

        const strength = this.getSignalStrength(data);
        document.getElementById('signalStrength').textContent = `Kekuatan: ${strength}`;

        // Entry/Exit Points
        const currentPrice = parseFloat(document.getElementById('currentPrice').textContent.replace(/[^0-9.-]+/g, ''));
        document.getElementById('entryPoint').textContent = this.formatCurrency(currentPrice * 0.98);
        document.getElementById('stopLoss').textContent = this.formatCurrency(currentPrice * 0.95);
        document.getElementById('takeProfit').textContent = this.formatCurrency(currentPrice * 1.05);
    }

    updatePrediction(data) {
        // Short term prediction
        const shortTerm = this.generatePrediction('short');
        document.getElementById('shortTermPrediction').innerHTML = `
            <div class="prediction-direction ${shortTerm.direction.toLowerCase()}">${shortTerm.direction}</div>
            <div class="prediction-confidence">Confidence: ${shortTerm.confidence}%</div>
        `;

        // Medium term prediction
        const mediumTerm = this.generatePrediction('medium');
        document.getElementById('mediumTermPrediction').innerHTML = `
            <div class="prediction-direction ${mediumTerm.direction.toLowerCase()}">${mediumTerm.direction}</div>
            <div class="prediction-confidence">Confidence: ${mediumTerm.confidence}%</div>
        `;

        // Price targets
        const currentPrice = parseFloat(document.getElementById('currentPrice').textContent.replace(/[^0-9.-]+/g, ''));
        document.getElementById('bullishTarget').textContent = this.formatCurrency(currentPrice * 1.15);
        document.getElementById('bearishTarget').textContent = this.formatCurrency(currentPrice * 0.85);

        // Risk assessment
        const riskLevel = this.calculateRiskLevel(data);
        const riskElement = document.getElementById('riskLevel');
        riskElement.textContent = `${riskLevel} Risk`;
        riskElement.className = `risk-level ${riskLevel.toLowerCase()}`;
    }

    updateMarketOverview() {
        const fearGreed = 20 + Math.random() * 60;
        const vix = 15 + Math.random() * 20;
        
        document.getElementById('fearGreedIndex').textContent = `${fearGreed.toFixed(0)} (${this.getFearGreedLabel(fearGreed)})`;
        document.getElementById('vixIndex').textContent = vix.toFixed(2);
    }

    updateChart(historicalData) {
        if (!this.chart) {
            this.initializeChart();
        }

        const ctx = document.getElementById('priceChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: historicalData.map(d => new Date(d.date).toLocaleDateString('id-ID')),
                datasets: [{
                    label: `${this.currentSymbol} Price`,
                    data: historicalData.map(d => d.price),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initializeChart() {
        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
            script.onload = () => {
                this.initializeChart();
            };
            document.head.appendChild(script);
            return;
        }
    }

    addToWatchlist() {
        const symbol = document.getElementById('watchlistInput').value.trim().toUpperCase();
        if (!symbol) return;

        if (!this.watchlist.includes(symbol)) {
            this.watchlist.push(symbol);
            this.saveWatchlist();
            this.renderWatchlist();
            document.getElementById('watchlistInput').value = '';
        }
    }

    removeFromWatchlist(symbol) {
        this.watchlist = this.watchlist.filter(s => s !== symbol);
        this.saveWatchlist();
        this.renderWatchlist();
    }

    loadWatchlist() {
        this.renderWatchlist();
    }

    renderWatchlist() {
        const container = document.getElementById('watchlistItems');
        
        if (this.watchlist.length === 0) {
            container.innerHTML = '<p>Watchlist kosong. Tambahkan symbol untuk monitoring.</p>';
            return;
        }

        container.innerHTML = this.watchlist.map(symbol => `
            <div class="watchlist-item">
                <div>
                    <strong>${symbol}</strong>
                    <span class="watchlist-price" id="price-${symbol}">Loading...</span>
                </div>
                <button onclick="analyzer.removeFromWatchlist('${symbol}')" style="background: #e53e3e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">Remove</button>
            </div>
        `).join('');

        // Update prices for watchlist items
        this.updateWatchlistPrices();
    }

    async updateWatchlistPrices() {
        for (const symbol of this.watchlist) {
            try {
                const data = await this.fetchPriceData(symbol);
                const priceElement = document.getElementById(`price-${symbol}`);
                if (priceElement) {
                    priceElement.innerHTML = `
                        <span>${this.formatCurrency(data.currentPrice)}</span>
                        <span class="${data.priceChange >= 0 ? 'positive' : 'negative'}" style="font-size: 0.9rem; margin-left: 0.5rem;">
                            ${data.percentChange.toFixed(2)}%
                        </span>
                    `;
                }
            } catch (error) {
                console.error(`Error updating price for ${symbol}:`, error);
            }
        }
    }

    saveWatchlist() {
        localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    }

    startAutoRefresh() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (this.currentSymbol) {
                this.analyzeAsset();
            }
        }, 30000); // Refresh every 30 seconds
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        statusElement.style.display = 'block';

        if (type !== 'loading') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        }
    }

    // Utility functions
    formatCurrency(value, abbreviated = false) {
        if (abbreviated && value >= 1e9) {
            return `$${(value / 1e9).toFixed(2)}B`;
        } else if (abbreviated && value >= 1e6) {
            return `$${(value / 1e6).toFixed(2)}M`;
        } else if (abbreviated && value >= 1e3) {
            return `$${(value / 1e3).toFixed(2)}K`;
        }
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: value < 1 ? 4 : 2,
            maximumFractionDigits: value < 1 ? 4 : 2
        }).format(value);
    }

    formatVolume(value) {
        if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
        } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(2)}K`;
        }
        return value.toFixed(0);
    }

    getTechnicalSummary(data) {
        let bullishCount = 0;
        let bearishCount = 0;

        if (data.rsiSignal === 'bullish') bullishCount++;
        if (data.rsiSignal === 'bearish') bearishCount++;
        if (data.macdSignal === 'bullish') bullishCount++;
        if (data.macdSignal === 'bearish') bearishCount++;
        if (data.maSignal === 'bullish') bullishCount++;
        if (data.maSignal === 'bearish') bearishCount++;

        if (bullishCount > bearishCount) {
            return { signal: 'bullish', text: 'Bullish' };
        } else if (bearishCount > bullishCount) {
            return { signal: 'bearish', text: 'Bearish' };
        } else {
            return { signal: 'neutral', text: 'Netral' };
        }
    }

    getSignalStrength(data) {
        const strength = Math.abs(data.rsi - 50) + Math.abs(data.macd) * 10;
        if (strength > 25) return 'Strong';
        if (strength > 15) return 'Medium';
        return 'Weak';
    }

    generatePrediction(term) {
        const directions = ['Bullish', 'Bearish', 'Sideways'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const confidence = term === 'short' ? 
            Math.floor(60 + Math.random() * 25) : 
            Math.floor(40 + Math.random() * 35);
        
        return { direction, confidence };
    }

    calculateRiskLevel(data) {
        if (data.rsi > 70 || data.rsi < 30) return 'High';
        if (Math.abs(data.macd) > 1) return 'Medium';
        return 'Low';
    }

    getFearGreedLabel(value) {
        if (value < 25) return 'Extreme Fear';
        if (value < 45) return 'Fear';
        if (value < 55) return 'Neutral';
        if (value < 75) return 'Greed';
        return 'Extreme Greed';
    }

    loadDefaultData() {
        // Load default crypto data (Bitcoin)
        document.getElementById('symbolInput').value = 'BTC';
        setTimeout(() => {
            this.analyzeAsset();
        }, 1000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
let analyzer;
document.addEventListener('DOMContentLoaded', () => {
    analyzer = new StockCryptoAnalyzer();
});

// Export for global access
window.analyzer = analyzer;
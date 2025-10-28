const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default;

const Balance = require("../model/BalanceModel");
const Holdings = require("../model/HoldingsModel");
const WatchList = require("../model/WatchListModel");
const Positions = require("../model/PositionsModel");
const Order = require("../model/OrdersModel");
const User = require("../model/UserModel");



function getRandomSymbols(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomType() {
  return Math.random() < 0.5 ? "CNC" : "NORMAL";
}

function randomFluctuation(price) {
  const change = price * (Math.random() * 0.04 - 0.02); // ±2%
  return +(price + change).toFixed(2);
}


const orderSymbols = [
  "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "LT.NS", "BHARTIARTL.NS",
  "ASIANPAINT.NS", "AXISBANK.NS", "ITC.NS", "HINDUNILVR.NS", "MARUTI.NS", "ULTRACEMCO.NS", "WIPRO.NS", "POWERGRID.NS",
  "BAJFINANCE.NS", "HCLTECH.NS", "SUNPHARMA.NS", "TITAN.NS", "COALINDIA.NS", "ONGC.NS", "NTPC.NS", "KOTAKBANK.NS",
  "NESTLEIND.NS", "TECHM.NS", "ADANIENT.NS", "ADANIPORTS.NS", "HEROMOTOCO.NS", "TATAMOTORS.NS", "TATASTEEL.NS",
  "BPCL.NS", "BRITANNIA.NS", "HDFCLIFE.NS", "SBILIFE.NS", "GRASIM.NS", "INDUSINDBK.NS", "BAJAJFINSV.NS", "DRREDDY.NS",
  "EICHERMOT.NS", "DIVISLAB.NS", "UPL.NS", "HINDALCO.NS", "JSWSTEEL.NS", "TATACONSUM.NS", "BAJAJ_AUTO.NS",
  "CIPLA.NS", "M&M.NS", "APOLLOHOSP.NS", "PIDILITIND.NS", "HAVELLS.NS", "GAIL.NS", "DLF.NS", "BEL.NS", "CANBK.NS",
  "BANKBARODA.NS", "IDFCFIRSTB.NS", "INDIGO.NS", "VOLTAS.NS", "CHOLAFIN.NS", "AMBUJACEM.NS", "ACC.NS", "OBEROIRLTY.NS",
  "ZEEL.NS", "BANDHANBNK.NS", "MFSL.NS", "PNB.NS", "BIOCON.NS", "TORNTPHARM.NS", "TVSMOTOR.NS", "INDHOTEL.NS",
  "FEDERALBNK.NS", "RECLTD.NS", "IRCTC.NS", "LICI.NS", "PAYTM.NS", "POLYCAB.NS", "MUTHOOTFIN.NS", "TRENT.NS",
  "ADANIGREEN.NS", "ADANIPOWER.NS", "IRFC.NS", "ZOMATO.NS", "NYKAA.NS", "DELHIVERY.NS", "TATAPOWER.NS", "LODHA.NS",
  "IDEA.NS", "BHEL.NS", "ESCORTS.NS", "IRB.NS", "MOTHERSON.NS", "NATIONALUM.NS", "RVNL.NS", "POWERINDIA.NS",
  "PETRONET.NS", "GLENMARK.NS", "GUJGASLTD.NS", "IOC.NS", "IEX.NS", "FORTIS.NS", "INDUSTOWER.NS"
];

const watchlistSymbols = [
  "MARICO.NS", "BOSCHLTD.NS", "PIIND.NS", "LTIM.NS", "MGL.NS", "PEL.NS", "TORNTPOWER.NS",
  "HINDPETRO.NS", "BPCL.NS", "TATAELXSI.NS", "CROMPTON.NS", "TATACHEM.NS", "VEDL.NS", "SRF.NS",
  "NBCC.NS", "CASTROLIND.NS", "AUROPHARMA.NS", "PFIZER.NS", "ABB.NS", "MRF.NS", "SIEMENS.NS",
  "ADANITRANS.NS", "APOLLOTYRE.NS", "ASHOKLEY.NS", "GRANULES.NS", "PRSMJOHNSN.NS", "LTI.NS",
  "MCDOWELL-N.NS", "GODREJCP.NS", "TATAINVEST.NS", "HINDCOPPER.NS", "PAGEIND.NS", "INDIACEM.NS",
  "KEI.NS", "ALKEM.NS", "CENTURYTEX.NS", "SHREECEM.NS", "COROMANDEL.NS", "BALKRISIND.NS",
  "JUBILANT.NS", "MANAPPURAM.NS", "WHIRLPOOL.NS", "ZENSARTECH.NS", "POLYMED.NS", "GICRE.NS", 
  "VINATIORGA.NS", "FINCABLES.NS", "ASTRAL.NS"
];



async function fetchStockData(symbols) {
  const stocksData = [];
  for (const symbol of symbols) {
    try {
      const quote = await yahooFinance.quote(symbol);
      const data = quote?.quoteResponse?.result?.[0] || quote;
      if (!data?.symbol) continue;
      stocksData.push({
        symbol: data.symbol,
        dayLow: data.regularMarketDayLow,
        dayHigh: data.regularMarketDayHigh,
        currentPrice: data.regularMarketPrice,
        type1: randomType(),
      });
    } catch (err) {
      console.error(`Error fetching ${symbol}:`, err.message);
    }
  }
  return stocksData;
}

async function createDailyOrderList() {
  const stocksData = await fetchStockData(orderSymbols);
  const selectedStocks = getRandomSymbols(stocksData, 50);
  await Order.deleteMany({});
  const newOrders = new Order({ stocks: selectedStocks, lastFetchedAt: new Date() });
  await newOrders.save();
  console.log("New Daily Orders created:", new Date().toLocaleString());
  return newOrders;
}

async function createDailyWatchlist() {
  const stocksData = await fetchStockData(watchlistSymbols);
  const selectedStocks = getRandomSymbols(stocksData, 10);
  await WatchList.deleteMany({});
  const newWatchlist = new WatchList({ stocks: selectedStocks, lastFetchedAt: new Date() });
  await newWatchlist.save();
  console.log("New Daily Watchlist created:", new Date().toLocaleString());
  return newWatchlist;
}


async function updateStockPrices(Model) {
  const latest = await Model.findOne().sort({ createdAt: -1 });
  if (!latest) return;

  for (const stock of latest.stocks) {
    const newPrice = randomFluctuation(stock.currentPrice);


    stock.previousPrices.push({ price: stock.currentPrice, recordedAt: new Date() });

    if (stock.previousPrices.length > 30)
      stock.previousPrices = stock.previousPrices.slice(-30);

    stock.currentPrice = newPrice;
    stock.lastUpdated = new Date();
  }

  await latest.save();
  console.log(`Updated ${Model.modelName} prices at ${new Date().toLocaleTimeString()}`);
}

async function syncHoldingsWithMarket() {
  const latestOrders = await Order.findOne().sort({ createdAt: -1 });
  const latestWatchlist = await WatchList.findOne().sort({ createdAt: -1 });

  const holdings = await Holdings.find();
  for (const h of holdings) {
    for (const s of h.stocks) {
      let refStock =
        latestOrders?.stocks.find(st => st.symbol === s.symbol) ||
        latestWatchlist?.stocks.find(st => st.symbol === s.symbol);

      if (refStock) {
        if (s.currentPrice !== refStock.currentPrice) {
          s.priceHistory.push({ date: new Date().toISOString().slice(0, 10), price: s.currentPrice });
          if (s.priceHistory.length > 30) s.priceHistory = s.priceHistory.slice(-30);
          s.currentPrice = refStock.currentPrice;
          s.todayPrice = refStock.currentPrice;
          s.lastPriceUpdate = new Date();
        }
      } else {
        const newPrice = randomFluctuation(s.currentPrice);
        s.priceHistory.push({ date: new Date().toISOString().slice(0, 10), price: s.currentPrice });
        s.currentPrice = newPrice;
        s.todayPrice = newPrice;
        s.lastPriceUpdate = new Date();
      }
    }
    await h.save();
  }
  console.log("Holdings synced with market data");
}


setInterval(async () => {
  try {
    await updateStockPrices(Order);
    await updateStockPrices(WatchList);
    await syncHoldingsWithMarket();
  } catch (err) {
    console.error(" Error during scheduled update:", err.message);
  }
}, 5 * 60 * 1000);


router.get("/order", async (req, res) => {
  try {
    let latest = await Order.findOne().sort({ createdAt: -1 });
    if (latest) {
      const ageHours = (Date.now() - new Date(latest.lastFetchedAt).getTime()) / (1000 * 60 * 60);
      if (ageHours >= 24) latest = await createDailyOrderList();
      else console.log(` Orderlist still fresh (${ageHours.toFixed(2)}h old).`);
    } else latest = await createDailyOrderList();
    res.json(latest);
  } catch (err) {
    console.error("Error in /order:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/watchlist", async (req, res) => {
  try {
    let latest = await WatchList.findOne().sort({ createdAt: -1 });
    if (latest) {
      const ageHours = (Date.now() - new Date(latest.lastFetchedAt).getTime()) / (1000 * 60 * 60);
      if (ageHours >= 24) latest = await createDailyWatchlist();
      else console.log(`Watchlist still fresh (${ageHours.toFixed(2)}h old).`);
    } else latest = await createDailyWatchlist();
    res.json(latest);
  } catch (err) {
    console.error("Error in /watchlist:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/holdings/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const holdings = await Holdings.findOne({ userId });

    if (!holdings || !holdings.stocks || holdings.stocks.length === 0) {
      return res.json({ message: "You haven’t bought any normal product yet" });
    }

    const today = new Date().toISOString().slice(0, 10); 

    const updatedStocks = holdings.stocks.map((stock) => {
      const lastDate = stock.lastPriceUpdate
        ? stock.lastPriceUpdate.toISOString().slice(0, 10)
        : null;

      let todayPrice = stock.todayPrice;

    
      if (lastDate !== today) {
        const fluctuation = stock.currentPrice * (Math.random() * 0.10 - 0.05);
        todayPrice = +(stock.currentPrice + fluctuation).toFixed(2);
        stock.todayPrice = todayPrice;
        stock.lastPriceUpdate = new Date();
      }

      return { ...stock.toObject(), todayPrice };
    });

    await holdings.save(); 

    return res.json({ stocks: updatedStocks });
  } catch (e) {
    console.error("Error fetching holdings:", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});
router.get("/positions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.json({ message: "User not found" });

    const balance = await Balance.findOne({ userId });
    const positions = await Positions.findOne({ userId });

    if (!positions || positions.stocks.length === 0) {
      return res.json({ message: "No positions yet", stocks: [] });
    }

    const today = new Date().toISOString().split("T")[0]; 
    let totalAdded = 0;

    if (!positions.lastSoldDate || positions.lastSoldDate < today) {
     
      positions.stocks.forEach((stock) => {
        const fluctuation = stock.currentPrice * (Math.random() * 0.10 - 0.05);
        const sellPrice = +(stock.currentPrice + fluctuation).toFixed(2);
        totalAdded += sellPrice * stock.qty;
      });

 
      positions.stocks = [];
      positions.lastSoldDate = today;
      await positions.save();


      balance.bal += totalAdded;
      await balance.save();
    }

    return res.json({ stocks: positions.stocks, balance: balance.bal });
  } catch (e) {
    console.error("Error fetching positions:", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

router.get("/stock-history/:id", async (req, res) => {
  try {
    const stockId = req.params.id;
    const history = await Holdings.find({ stockId }).sort({ date: 1 });

    if (!history || history.length === 0) {
      return res.json({ history: [] });
    }
    const formattedHistory = history.map((h) => ({
      date: h.date.toISOString().split("T")[0], 
      price: h.price,
    }));

    res.json({ history: formattedHistory });
  } catch (err) {
    console.error("Error fetching stock history:", err);
    res.status(500).json({ error: "Failed to fetch stock history" });
  }
});

router.post("/sell-holding/:userId/:stockId", async (req, res) => {
  const { userId, stockId } = req.params;

  try {
    const holdings = await Holdings.findOne({ userId });
    const balance = await Balance.findOne({ userId });

    if (!holdings || holdings.stocks.length === 0) {
      return res.json({ message: "No holdings to sell" });
    }

    const stock = holdings.stocks.id(stockId);
    if (!stock) return res.json({ message: "Stock not found" });
    const totalSell = stock.todayPrice * stock.qty;
    balance.bal += totalSell;
    await balance.save();

    holdings.stocks.remove(stockId);
    await holdings.save();

    return res.json({ message: `Sold ${stock.symbol} for ₹${totalSell.toFixed(2)}`, balance: balance.bal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;

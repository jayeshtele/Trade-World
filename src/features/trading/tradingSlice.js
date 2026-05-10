import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';
import { marketAssets } from '../../data/markets.js';

const formatTime = () =>
  new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

const roundMoney = (value) => Number(value.toFixed(2));

const calculateCharges = (value) => Math.max(20, value * 0.00032);

const createInitialState = () => ({
  account: {
    name: 'Trade World Demo',
    mode: 'Paper',
    currency: 'INR',
    startingCash: 1000000,
    cash: 1000000,
    riskProfile: 'Balanced',
    marginEnabled: false,
  },
  assets: marketAssets,
  selectedSymbol: 'RELIANCE',
  watchlist: ['NIFTYBEES', 'RELIANCE', 'HDFCBANK', 'INFY', 'TATAMOTORS'],
  holdings: {},
  orders: [],
  tradeNotice: null,
  preferences: {
    sound: false,
    compactRows: false,
    confirmOrders: true,
  },
});

const addOrder = (state, order) => {
  state.orders.unshift(order);
  state.orders = state.orders.slice(0, 60);
};

const rejectOrder = (state, draftOrder, reason) => {
  addOrder(state, {
    ...draftOrder,
    status: 'Rejected',
    reason,
    executedAt: formatTime(),
  });
  state.tradeNotice = {
    tone: 'danger',
    title: 'Order rejected',
    message: reason,
  };
};

const executeOrder = (state, draftOrder, asset, executionPrice) => {
  const quantity = Number(draftOrder.quantity);
  const value = roundMoney(quantity * executionPrice);
  const charges = roundMoney(calculateCharges(value));

  if (draftOrder.side === 'BUY') {
    const total = roundMoney(value + charges);
    if (total > state.account.cash) {
      return { ok: false, reason: 'Insufficient demo balance for this buy order.' };
    }

    state.account.cash = roundMoney(state.account.cash - total);
    const existing = state.holdings[asset.symbol] || {
      symbol: asset.symbol,
      quantity: 0,
      averagePrice: 0,
      invested: 0,
    };

    const newQuantity = existing.quantity + quantity;
    const newInvested = roundMoney(existing.invested + value + charges);
    state.holdings[asset.symbol] = {
      ...existing,
      quantity: newQuantity,
      averagePrice: roundMoney(newInvested / newQuantity),
      invested: newInvested,
    };
  } else {
    const holding = state.holdings[asset.symbol];
    if (!holding || holding.quantity < quantity) {
      return { ok: false, reason: 'Not enough holdings available for this sell order.' };
    }

    const proceeds = roundMoney(value - charges);
    state.account.cash = roundMoney(state.account.cash + proceeds);
    const remainingQuantity = holding.quantity - quantity;

    if (remainingQuantity <= 0) {
      delete state.holdings[asset.symbol];
    } else {
      const reducedInvested = roundMoney(holding.averagePrice * remainingQuantity);
      state.holdings[asset.symbol] = {
        ...holding,
        quantity: remainingQuantity,
        invested: reducedInvested,
      };
    }
  }

  return {
    ok: true,
    executionPrice,
    value,
    charges,
  };
};

const shouldExecuteLimitOrder = (order, price) => {
  if (order.type !== 'LIMIT') {
    return true;
  }

  return order.side === 'BUY' ? price <= order.limitPrice : price >= order.limitPrice;
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState: createInitialState(),
  reducers: {
    selectSymbol(state, action) {
      state.selectedSymbol = action.payload;
    },
    toggleWatchlist(state, action) {
      const symbol = action.payload;
      if (state.watchlist.includes(symbol)) {
        state.watchlist = state.watchlist.filter((item) => item !== symbol);
      } else {
        state.watchlist.push(symbol);
      }
    },
    updatePreference(state, action) {
      const { key, value } = action.payload;
      state.preferences[key] = value;
    },
    cancelOrder(state, action) {
      const order = state.orders.find((item) => item.id === action.payload);
      if (order && order.status === 'Pending') {
        order.status = 'Cancelled';
        order.reason = 'Cancelled by user';
        state.tradeNotice = {
          tone: 'neutral',
          title: 'Order cancelled',
          message: `${order.symbol} ${order.side.toLowerCase()} order was cancelled.`,
        };
      }
    },
    clearTradeNotice(state) {
      state.tradeNotice = null;
    },
    resetDemo() {
      return createInitialState();
    },
    pulseMarket(state) {
      state.assets.forEach((asset) => {
        const directionBias = asset.price >= asset.previousClose ? 0.02 : -0.01;
        const randomMove = (Math.random() - 0.48) * asset.volatility + directionBias;
        const nextPrice = roundMoney(Math.max(1, asset.price * (1 + randomMove / 100)));
        const lastPoint = asset.history[asset.history.length - 1];

        asset.price = nextPrice;
        asset.dayHigh = Math.max(asset.dayHigh, nextPrice);
        asset.dayLow = Math.min(asset.dayLow, nextPrice);
        asset.volume += Math.floor(1800 + Math.random() * 26000);
        asset.history = [
          ...asset.history.slice(-39),
          {
            label: formatTime().slice(0, 5),
            price: nextPrice,
          },
        ];

        if (lastPoint && Math.abs(lastPoint.price - nextPrice) < 0.01) {
          asset.price = roundMoney(nextPrice + asset.volatility * 0.02);
        }
      });

      state.orders.forEach((order) => {
        if (order.status !== 'Pending') {
          return;
        }

        const asset = state.assets.find((item) => item.symbol === order.symbol);
        if (!asset || !shouldExecuteLimitOrder(order, asset.price)) {
          return;
        }

        const result = executeOrder(state, order, asset, asset.price);
        if (result.ok) {
          order.status = 'Executed';
          order.executionPrice = result.executionPrice;
          order.value = result.value;
          order.charges = result.charges;
          order.executedAt = formatTime();
        } else {
          order.status = 'Rejected';
          order.reason = result.reason;
          order.executedAt = formatTime();
        }
      });
    },
    placeOrder: {
      reducer(state, action) {
        const { symbol, side, quantity, type, limitPrice, id, createdAt } = action.payload;
        const asset = state.assets.find((item) => item.symbol === symbol);
        const normalizedQuantity = Number(quantity);
        const normalizedLimit = Number(limitPrice);

        const draftOrder = {
          id,
          symbol,
          side,
          quantity: normalizedQuantity,
          type,
          limitPrice: type === 'LIMIT' ? normalizedLimit : null,
          requestedPrice: asset?.price || 0,
          status: 'Pending',
          createdAt,
        };

        if (!asset) {
          rejectOrder(state, draftOrder, 'Selected instrument is not available.');
          return;
        }

        if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
          rejectOrder(state, draftOrder, 'Quantity must be greater than zero.');
          return;
        }

        if (type === 'LIMIT' && (!Number.isFinite(normalizedLimit) || normalizedLimit <= 0)) {
          rejectOrder(state, draftOrder, 'Limit price must be greater than zero.');
          return;
        }

        if (!shouldExecuteLimitOrder(draftOrder, asset.price)) {
          addOrder(state, draftOrder);
          state.tradeNotice = {
            tone: 'neutral',
            title: 'Limit order queued',
            message: `${symbol} will execute when the market reaches ₹${normalizedLimit.toLocaleString('en-IN')}.`,
          };
          return;
        }

        const result = executeOrder(state, draftOrder, asset, asset.price);
        if (!result.ok) {
          rejectOrder(state, draftOrder, result.reason);
          return;
        }

        addOrder(state, {
          ...draftOrder,
          status: 'Executed',
          executionPrice: result.executionPrice,
          value: result.value,
          charges: result.charges,
          executedAt: formatTime(),
        });

        state.tradeNotice = {
          tone: side === 'BUY' ? 'success' : 'warning',
          title: `${side === 'BUY' ? 'Buy' : 'Sell'} order executed`,
          message: `${normalizedQuantity} ${symbol} at ₹${asset.price.toLocaleString('en-IN')}.`,
        };
      },
      prepare(payload) {
        return {
          payload: {
            ...payload,
            id: nanoid(10).toUpperCase(),
            createdAt: formatTime(),
          },
        };
      },
    },
  },
});

export const {
  cancelOrder,
  clearTradeNotice,
  placeOrder,
  pulseMarket,
  resetDemo,
  selectSymbol,
  toggleWatchlist,
  updatePreference,
} = tradingSlice.actions;

export const selectTrading = (state) => state.trading;
export const selectAssets = (state) => state.trading.assets;
export const selectSelectedSymbol = (state) => state.trading.selectedSymbol;
export const selectSelectedAsset = createSelector(
  [selectAssets, selectSelectedSymbol],
  (assets, symbol) => assets.find((asset) => asset.symbol === symbol) || assets[0],
);
export const selectWatchlistAssets = createSelector(
  [selectAssets, (state) => state.trading.watchlist],
  (assets, watchlist) => assets.filter((asset) => watchlist.includes(asset.symbol)),
);
export const selectOpenOrders = createSelector(
  [(state) => state.trading.orders],
  (orders) => orders.filter((order) => order.status === 'Pending'),
);
export const selectHoldingsList = createSelector(
  [selectAssets, (state) => state.trading.holdings],
  (assets, holdings) =>
    Object.values(holdings).map((holding) => {
      const asset = assets.find((item) => item.symbol === holding.symbol);
      const marketValue = roundMoney((asset?.price || 0) * holding.quantity);
      const pnl = roundMoney(marketValue - holding.invested);

      return {
        ...holding,
        asset,
        marketValue,
        pnl,
        pnlPercent: holding.invested ? (pnl / holding.invested) * 100 : 0,
      };
    }),
);
export const selectPortfolioSummary = createSelector(
  [selectHoldingsList, (state) => state.trading.account],
  (holdings, account) => {
    const invested = roundMoney(holdings.reduce((sum, item) => sum + item.invested, 0));
    const marketValue = roundMoney(holdings.reduce((sum, item) => sum + item.marketValue, 0));
    const unrealized = roundMoney(marketValue - invested);
    const dayPnl = roundMoney(
      holdings.reduce((sum, item) => {
        const previous = item.asset?.previousClose || item.asset?.price || 0;
        return sum + (item.asset.price - previous) * item.quantity;
      }, 0),
    );
    const equity = roundMoney(account.cash + marketValue);

    return {
      cash: account.cash,
      invested,
      marketValue,
      unrealized,
      dayPnl,
      equity,
      netPnl: roundMoney(equity - account.startingCash),
      netPnlPercent: ((equity - account.startingCash) / account.startingCash) * 100,
    };
  },
);

export default tradingSlice.reducer;

import Bottleneck from "bottleneck";

// Long-term limit: 100 requests per 2 minutes
const longTermLimiter = new Bottleneck({
  reservoir: 100,
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 2 * 60 * 1000,
});

// Short-term limit: 20 requests per 1 second
const shortTermLimiter = new Bottleneck({
  reservoir: 20,
  reservoirRefreshAmount: 20,
  reservoirRefreshInterval: 1000,
});

export const RiotLimiter = shortTermLimiter.chain(longTermLimiter);

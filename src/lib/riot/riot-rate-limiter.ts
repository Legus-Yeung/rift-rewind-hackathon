import Bottleneck from "bottleneck";

// Long-term limit: 100 requests per 2 minutes
const longTermLimiter = new Bottleneck({
  reservoir: 99,
  reservoirRefreshAmount: 99,
  reservoirRefreshInterval: 2 * 60 * 1000,
});

// Short-term limit: 20 requests per 1 second
const shortTermLimiter = new Bottleneck({
  reservoir: 20,
  reservoirRefreshAmount: 20,
  reservoirRefreshInterval: 1000,
  minTime: 1000 / 20,
});

const limiter = shortTermLimiter.chain(longTermLimiter);

limiter.on("failed", async (error, jobInfo) => {
  const { retryCount } = jobInfo;
  const maxRetries = 3;
  const id = jobInfo.options.id;

  if (retryCount < maxRetries) {
    console.warn(`Job ${id} failed on retry attempt #${retryCount}: ${error}`);
    return 1000;
  }
  console.warn(`Job ${id} dropped after retry attempt #${retryCount}`, error);
  return null;
});

limiter.on("retry", (error, jobInfo) =>
  console.log(`Now retrying ${jobInfo.options.id}`),
);

limiter.on("done", async (jobInfo) => {
  const { retryCount } = jobInfo;
  const id = jobInfo.options.id;
  console.log(`Job ${id} completed on retry attempt #${retryCount}`);
});

export const RiotLimiter = limiter;

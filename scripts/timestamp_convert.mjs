function toEDT(timestampMs) {
    return new Date(timestampMs).toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour12: false,
    });
  }
  
  const timestamp = 1736380800000;
  console.log("UTC:", new Date(timestamp).toISOString());
  console.log("Eastern (EDT/EST):", toEDT(timestamp));
  
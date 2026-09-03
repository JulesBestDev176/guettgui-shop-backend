export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  commissionRate: Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.08),
});

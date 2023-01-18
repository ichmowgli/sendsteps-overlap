import { createTRPCRouter } from "./trpc";
import { overlapRouter } from "./routers/overlap";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  overlap: overlapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const overlapRouter = createTRPCRouter({
  calculate: publicProcedure
    .input(z.object({ 
      first: z.string(),
      second: z.string(),
    }))
    .mutation(({ input: { first, second } }) => {

      const [ smaller, bigger ] = [first, second].sort((a,b) => a.length - b.length) as [string, string];

      const shouldSwapPositions = smaller === second;

      const charsOfBigger: Array<string | undefined> = bigger.split('');


      let amountFound = 0;
      const positions: number[][] = []

      for (let idxInSmaller = 0; idxInSmaller < smaller.length; idxInSmaller++) {
        const char = smaller[idxInSmaller];

        const idxInBigger = charsOfBigger.findIndex((c) => c == char);

        if(idxInBigger >= 0) {
          amountFound++;

          const pos = shouldSwapPositions ? [idxInBigger, idxInSmaller] : [idxInSmaller, idxInBigger]
          positions.push(pos);

          charsOfBigger[idxInBigger] = undefined;
        }
      }

      return {
        amount: amountFound,
        positions
      };
    }),
});

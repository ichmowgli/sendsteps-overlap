import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const overlapRouter = createTRPCRouter({
  calculate: publicProcedure
    .input(
      z.object({
        first: z.string().transform((s) => s.toLowerCase()),
        second: z.string().transform((s) => s.toLowerCase()),
        countSpaceAsChar: z.boolean().default(true),
      })
    )
    .mutation(({ input: { first, second, countSpaceAsChar } }) => {
      const strings = [first, second].sort((a, b) => {
        if (countSpaceAsChar) {
          return a.length - b.length;
        }

        return a.replaceAll(" ", "").length - b.replaceAll(" ", "").length;
      });

      const [smaller, bigger] = strings as [string, string];

      const shouldSwapPositions = smaller === second;

      const charsOfBigger: Array<string | undefined> = bigger.split("");

      let amountFound = 0;
      const positions: number[][] = [];

      let lastIndexInBigger = -1;

      for (
        let idxInSmaller = 0;
        idxInSmaller < smaller.length;
        idxInSmaller++
      ) {
        const char = smaller[idxInSmaller];

        if (char == " " && !countSpaceAsChar) {
          continue;
        }

        const idxInBigger = charsOfBigger.findIndex(
          (c, i) => i > lastIndexInBigger && c == char
        );

        if (idxInBigger >= 0) {
          lastIndexInBigger = idxInBigger;
          amountFound++;

          const pos = shouldSwapPositions
            ? [idxInBigger, idxInSmaller]
            : [idxInSmaller, idxInBigger];
          positions.push(pos);

          charsOfBigger[idxInBigger] = undefined;
        }
      }

      return {
        amount: amountFound,
        positions,
      };
    }),
});

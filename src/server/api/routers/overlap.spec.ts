/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type inferProcedureInput } from "@trpc/server";
import { createInnerTRPCContext } from "../../api/trpc";
import { overlapRouter } from "./overlap";

describe("overlap router", () => {
  describe("calculate", () => {
    type Input = inferProcedureInput<(typeof overlapRouter)["calculate"]>;

    const ctx = createInnerTRPCContext({});
    const caller = overlapRouter.createCaller(ctx);

    describe("validations", () => {
      it("no first", async () => {
        const input: Input = {
          first: null as any,
          second: "second",
        };

        await expect(caller.calculate(input)).rejects.toThrow();
      });

      it("no second", async () => {
        const input: Input = {
          first: "first",
          second: null as any,
        };

        await expect(caller.calculate(input)).rejects.toThrow();
      });
    });

    describe("one-word cases", () => {
      it("should find MAX overlap instead of first one", async () => {
        const input: Input = {
          first: "orange",
          second: "rhinoceros",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 3,
          positions: [
            [1, 0],
            [3, 3],
            [5, 6],
          ],
        });
      });

      it("works [1]", async () => {
        const input: Input = {
          first: "first",
          second: "second",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({ amount: 1, positions: [[3, 0]] });
      });

      it("works [2]", async () => {
        const input: Input = {
          first: "device",
          second: "ice",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 3,
          positions: [
            [3, 0],
            [4, 1],
            [5, 2],
          ],
        });
      });

      it("works [3]", async () => {
        const input: Input = {
          first: "intercities",
          second: "ice",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 3,
          positions: [
            [0, 0],
            [5, 1],
            [9, 2],
          ],
        });
      });

      it("works [4]", async () => {
        const input: Input = {
          first: "client",
          second: "ice",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 2,
          positions: [
            [2, 0],
            [3, 2],
          ],
        });
      });

      it("same strings", async () => {
        const input: Input = {
          first: "first",
          second: "first",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 5,
          positions: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
          ],
        });
      });

      it("first.length > second.length", async () => {
        const input: Input = {
          first: "development",
          second: "mint",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 3,
          positions: [
            [7, 0],
            [9, 2],
            [10, 3],
          ],
        });
      });

      it("first.length < second.length", async () => {
        const input: Input = {
          first: "less",
          second: "listening",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 2,
          positions: [
            [0, 0],
            [1, 4],
          ],
        });
      });

      it("empty strings", async () => {
        const input: Input = {
          first: "",
          second: "",
        };

        const result = await caller.calculate(input);
        expect(result).toMatchObject({
          amount: 0,
          positions: [],
        });
      });
    });

    describe("multi-word cases", () => {
      describe("countSpaceAsChar == true", () => {
        it("works", async () => {
          const input: Input = {
            first: "first abc",
            second: "second ed",
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 2,
            positions: [
              [3, 0],
              [5, 6],
            ],
          });
        });

        it("same strings", async () => {
          const input: Input = {
            first: "same sentences",
            second: "same sentences",
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 14,
            positions: [
              [0, 0],
              [1, 1],
              [2, 2],
              [3, 3],
              [4, 4],
              [5, 5],
              [6, 6],
              [7, 7],
              [8, 8],
              [9, 9],
              [10, 10],
              [11, 11],
              [12, 12],
              [13, 13],
            ],
          });
        });

        it("first.length > second.length", async () => {
          const input: Input = {
            first: "Think about your experience",
            second: "Guests count",
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 4,
            positions: [
              [0, 4],
              [5, 6],
              [8, 8],
              [10, 11],
            ],
          });
        });

        it("first.length < second.length", async () => {
          const input: Input = {
            first: "You got",
            second: "Find overlap of words",
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 3,
            positions: [
              [1, 5],
              [3, 12],
              [5, 13],
            ],
          });
        });

        it("strings containing only spaces", async () => {
          const input: Input = {
            first: "      ",
            second: "     ",
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 5,
            positions: [
              [0, 0],
              [1, 1],
              [2, 2],
              [3, 3],
              [4, 4],
            ],
          });
        });
      });

      describe("countSpaceAsChar == false", () => {
        it("works", async () => {
          const input: Input = {
            first: "first abc",
            second: "second ed",
            countSpaceAsChar: false,
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 2,
            positions: [
              [3, 0],
              [8, 2],
            ],
          });
        });

        it("same strings [1]", async () => {
          const input: Input = {
            first: "one two",
            second: "one two",
            countSpaceAsChar: false,
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 6,
            positions: [
              [0, 0],
              [1, 1],
              [2, 2],
              [4, 4],
              [5, 5],
              [6, 6],
            ],
          });
        });

        it("same strings [2]", async () => {
          const input: Input = {
            first: "same sentences",
            second: "same sentences",
            countSpaceAsChar: false,
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 13,
            positions: [
              [0, 0],
              [1, 1],
              [2, 2],
              [3, 3],
              [5, 5],
              [6, 6],
              [7, 7],
              [8, 8],
              [9, 9],
              [10, 10],
              [11, 11],
              [12, 12],
              [13, 13],
            ],
          });
        });

        it("first.length > second.length", async () => {
          const input: Input = {
            first: "Think about your experience",
            second: "Guests count",
            countSpaceAsChar: false,
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 3,
            positions: [
              [9, 1],
              [17, 2],
              [25, 7],
            ],
          });
        });

        it("first.length < second.length", async () => {
          const input: Input = {
            first: "You got",
            second: "Find overlap of words",
            countSpaceAsChar: false,
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 2,
            positions: [
              [1, 5],
              [5, 13],
            ],
          });
        });

        it("strings containing only spaces", async () => {
          const input: Input = {
            first: "      ",
            second: "     ",
            countSpaceAsChar: false,
          };

          const result = await caller.calculate(input);
          expect(result).toMatchObject({
            amount: 0,
            positions: [],
          });
        });
      });
    });
  });
});

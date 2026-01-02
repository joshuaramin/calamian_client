import { extendType, idArg, inputObjectType, list, nonNull } from "nexus";
import { prisma } from "@/lib/prisma";
import { ExpenseSchema } from "@/lib/validation/ExpenseSchema";

export const ExpensesInput = inputObjectType({
  name: "expenseInput",
  definition(t) {
    t.string("expense");
    t.float("amount");
    t.string("mod");
    t.date("payDate");
  },
});

export const ExepensesMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createExpense", {
      type: "ExpensePayload",
      args: { expenses: "expenseInput", expFolderID: nonNull(idArg()) },
      resolve: async (_, { expenses, expFolderID }): Promise<any> => {
        const parsedData = ExpenseSchema.safeParse(expenses);

        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: parsedData.error.issues,
          };
        }

        const { amount, expense, mod, payDate } = await parsedData.data;

        const result = await prisma.expense.create({
          data: {
            expense,
            amount,
            mod,
            payDate,
            expFolder: {
              connect: {
                expFolderID,
              },
            },
          },
        });

        return {
          __typename: "expenses",
          ...result,
        };
      },
    });
    t.field("updateExpense", {
      type: "expenses",
      args: { expenses: "expenseInput", expenseID: nonNull(idArg()) },
      resolve: async (_, { expenses, expenseID }): Promise<any> => {
        const parsedData = ExpenseSchema.safeParse(expenses);

        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: "Invalid Schema Parse",
          };
        }

        const { amount, expense, mod, payDate } = await parsedData.data;
        return await prisma.expense.update({
          where: { expenseID },
          data: {
            amount,
            expense,
            mod,
            payDate,
          },
        });
      },
    });
    t.list.field("deleteExpense", {
      type: "expenses",
      args: { expenseID: nonNull(list(idArg())) },
      resolve: async (_, { expenseID }): Promise<any> => {
        expenseID.map(async (expenseID: any) => {
          return await prisma.expense.deleteMany({
            where: { expenseID },
          });
        });
      },
    });
  },
});

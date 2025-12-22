import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "@/lib/util/index";

export const expenseQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllExpense", {
      type: "expenses",
      args: { expFolderID: nonNull(idArg()) },
      resolve: async (_, { expFolderID }): Promise<any> => {
        return await prisma.expense.findFirst({
          where: {
            is_deleted: false,
            expFolder: {
              expFolderID,
            },
          },
        });
      },
    });
    t.list.field("getAllExpenseByGroup", {
      type: "expenses",
      args: { expFolderID: nonNull(idArg()) },
      resolve: async (_, { expFolderID }): Promise<any> => {
        return await prisma.expense.groupBy({
          by: ["expense", "amount"],
          where: { expFolderID },
        });
      },
    });
  },
});

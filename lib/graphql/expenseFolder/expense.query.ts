import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "@/lib/util/index";

export const expFolderQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllExpenseFolder", {
      type: "expenseFolder",
      args: { search: stringArg() },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.expFolder.findMany({
          where: {
            is_deleted: false,
            exFolder: {
              contains: search || undefined,
              mode: "insensitive",
            },
          },
        });
      },
    });

    t.list.field("getExpenseFolderById", {
      type: "expenseFolder",
      args: { expFolderID: nonNull(idArg()) },
      resolve: async (_, { expFolderID }): Promise<any> => {
        return await prisma.expFolder.findFirst({
          where: {
            expFolderID,
          },
        });
      },
    });
  },
});

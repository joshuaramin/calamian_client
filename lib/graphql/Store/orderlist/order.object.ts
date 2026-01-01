import { objectType } from "nexus";
import { prisma } from "@/lib/util/index";

export const OrderObject = objectType({
  name: "orderCart",
  definition(t) {
    t.id("orderListItemID");
    t.int("quantity");
    t.float("total");
    t.datetime("createdAt");
    t.list.field("cartItem", {
      type: "item",
      resolve: async ({ orderListItemID }): Promise<any> => {
        return await prisma.items.findMany({
          where: {
            OrderListItem: {
              some: {
                orderListItemID: orderListItemID as string,
              },
            },
          },
        });
      },
    });
  },
});

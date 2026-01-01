import { extendType, inputObjectType, nonNull, stringArg, list } from "nexus";
import { prisma } from "@/lib/util/index";


export const OrderInput = inputObjectType({
  name: "OrderInput",
  definition(t) {
    t.nonNull.id("itemsID");
    t.nonNull.int("quantity");
    t.nonNull.float("total");
  },
});


function makeid(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQWERTUVWXYZ1234567890";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export const OrderMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAnOrder", {
      type: "order",
      args: {
        orders: nonNull(list(nonNull("OrderInput"))),
      },
      async resolve(_, { orders }): Promise<any> {
        if (orders.length === 0) {
          throw new Error("No orders provided");
        }

        const reduceTotal = orders.reduce(
          (acc, curr: any) => acc + curr.total,
          0
        );

        return prisma.$transaction(async (tx: { order: { create: (arg0: { data: { order: string; total: number; createdAt: Date; orderList: { create: { quantity: any; total: any; items: { connect: { itemsID: any; }; }; }[]; }; }; }) => any; }; items: { findUnique: (arg0: { where: { itemsID: string; }; include: { info: boolean; }; }) => any; }; storeInfo: { update: (arg0: { where: { itemsID: string; }; data: { quantity: number; }; include: { items: boolean; }; }) => any; }; notification: { create: (arg0: { data: { notification: string; } | { notification: string; }; }) => any; }; }) => {
          const order = await tx.order.create({
            data: {
              order: `#${makeid(8)}`,
              total: reduceTotal * 1.12,
              createdAt: new Date(),
              orderList: {
                create: orders.map(({ itemsID, quantity, total }: any) => ({
                  quantity,
                  total,
                  items: {
                    connect: { itemsID },
                  },
                })),
              },
            },
          });

          for (const order of orders) {
            const prod = await tx.items.findUnique({
              where: { itemsID: order.itemsID as string },
              include: { info: true },
            });

            if (!prod?.info) continue;

            if (!order.quantity) {
              return;
            }

            const newQuantity = Math.max(
              prod.info.quantity - order.quantity,
              0
            );

            const updatedStoreInfo = await tx.storeInfo.update({
              where: { itemsID: order.itemsID as string },
              data: { quantity: newQuantity },
              include: { items: true },
            });

            if (newQuantity <= 0) {
              await tx.notification.create({
                data: {
                  notification: `Attention! ${updatedStoreInfo.items?.items} is out of stock. Please contact your supplier.`,
                },
              });
            } else if (newQuantity < 50) {
              await tx.notification.create({
                data: {
                  notification: `Attention! ${updatedStoreInfo.items?.items} quantity is currently ${newQuantity}. Consider reordering soon.`,
                },
              });
            }
          }

          return order;
        });
      },
    });

    t.list.field("generateOrderReport", {
      type: "order",
      args: {
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
      },
      async resolve(_, { startDate, endDate }) {
        return prisma.order.findMany({
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        });
      },
    });
  },
});

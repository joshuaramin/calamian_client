import { extendType, inputObjectType, list, nonNull, stringArg } from "nexus";
import { prisma } from "@/lib/util/index";

export const orderInput = inputObjectType({
  name: "orderInput",
  definition(t) {
    t.id("itemsID");
    t.int("quantity");
    t.float("total");
  },
});

function makeid(length: number) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQWERTUVWXYZ1234567890";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const OrderMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAnOrder", {
      type: "order",
      args: {
        orders: nonNull(list(nonNull("orderInput"))),
      },
      resolve: async (_, { orders }): Promise<any> => {
        if (!orders || orders.length === 0) {
          throw new Error("No orders provided");
        }

        // Correct reduce usage
        const reduceTotal = orders.reduce(
          (acc: number, curr: { total: number }) => acc + curr.total,
          0
        );

        return prisma.$transaction(async () => {
          const order = await prisma.order.create({
            data: {
              order: `#${makeid(8)}`,
              total: reduceTotal + reduceTotal * 0.12,
              createdAt: new Date(),
              orderList: {
                create: orders.map(({ itemsID, quantity, total }) => ({
                  quantity,
                  total,
                  items: { connect: { itemsID } },
                })),
              },
            },
          });

          for (const { itemsID, quantity } of orders) {
            const prod = await prisma.items.findUnique({
              where: { itemsID },
              include: { info: true },
            });
            if (!prod) continue;

            const updatedStoreInfo = await prisma.storeInfo.update({
              where: { itemsID },
              data: { quantity: prod.info.quantity - quantity },
              include: { items: true },
            });

            if (updatedStoreInfo.quantity < 50) {
              await prisma.notification.create({
                data: {
                  notification: `Attention! ${prod.items} quantity is currently ${updatedStoreInfo.quantity}. Consider reordering soon.`,
                },
              });
            }

            if (updatedStoreInfo.quantity <= 0) {
              await prisma.notification.create({
                data: {
                  notification: `Attention! ${prod.items} is out of stock. Please contact your supplier.`,
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
      args: { startDate: nonNull(stringArg()), endDate: nonNull(stringArg()) },
      resolve: async (_, { startDate, endDate }): Promise<any> => {
        return await prisma.order.findMany({
          where: {
            createdAt: {
              lte: new Date(endDate),
              gte: new Date(startDate),
            },
          },
        });
      },
    });
  },
});

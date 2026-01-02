import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "@/lib/prisma";
import { ItemSchema } from "@/lib/validation/ItemSchema";
export const itemInput = inputObjectType({
  name: "itemInput",
  definition(t) {
    t.string("items");
    t.float("price");
    t.int("quantity");
    t.nullable.date("expiredDate");
    t.string("dosage");
  },
});

export const ItemMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createMedicalItems", {
      type: "ItemPayload",
      args: {
        item: "itemInput",
        categoryID: nonNull(idArg()),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { categoryID, item, userID }) => {
        const parsedData = ItemSchema.safeParse(item);
        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: parsedData.error.message,
          };
        }

        const { dosage, expiredDate, items, price, quantity } = parsedData.data;

        console.log(parsedData.data);

        console.log("Creating item:", {
          categoryID,
          item,
          dosage,
          expiredDate,
          price,
          quantity,
        });

        const createdItem = await prisma.items.create({
          data: {
            items,
            dosage,
            category: { connect: { categoryID } },
            info: { create: { price, expiredDate, quantity } },
          },
          include: {
            info: true,
          },
        });

        await prisma.logs.create({
          data: {
            logs: "Created an Item",
            descriptions: "You have created a new item.",
            User: { connect: { userID } },
          },
        });

        return {
          __typename: "item",
          ...createdItem,
        };
      },
    });
    t.field("updateMedicalitems", {
      type: "item",
      args: {
        item: "itemInput",
        itemsID: nonNull(idArg()),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { item, itemsID, userID }): Promise<any> => {
        const parsedData = ItemSchema.safeParse(item);
        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: "Invalid Schema Parse",
          };
        }

        const { dosage, expiredDate, items, price, quantity } =
          await parsedData.data;

        await prisma.logs.create({
          data: {
            logs: "Updated an Item",
            descriptions: `You updated an Item: ${items}`,
            User: {
              connect: {
                userID,
              },
            },
          },
        });
        return await prisma.items.update({
          data: {
            items,
            dosage,
            updatedAt: new Date(Date.now()),
            info: {
              update: {
                expiredDate,
                price,
                quantity,
              },
            },
          },
          where: { itemsID },
        });
      },
    });
    t.field("deleteMedicalItem", {
      type: "item",
      args: { itemsID: nonNull(idArg()), userID: nonNull(idArg()) },
      resolve: async (_, { itemsID, userID }): Promise<any> => {
        const item = await prisma.items.delete({
          where: { itemsID },
        });

        await prisma.logs.create({
          data: {
            logs: "Deleted an Item",
            descriptions: `You deleted an Item: ${item.items}`,
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        return item;
      },
    });
  },
});

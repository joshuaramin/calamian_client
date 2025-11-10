import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "@/lib/util/index";
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
        items: "itemInput",
        categoryID: nonNull(idArg()),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { categoryID, items, userID }): Promise<any> => {
        const parsedData = ItemSchema.safeParse(items);
        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: "Invalid Schema Parse",
          };
        }

        const { dosage, expiredDate, item, price, quantity } =
          await parsedData.data;
        const itemss = await prisma.items.create({
          data: {
            items: item,
            dosage,
            category: {
              connect: {
                categoryID,
              },
            },
            info: {
              create: {
                price,
                expiredDate,
                quantity,
              },
            },
          },
        });

        await prisma.logs.create({
          data: {
            logs: "Created an Item",
            descriptions: "You have been created new Item.",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        return itemss;
      },
    });

    t.field("updateMedicalitems", {
      type: "item",
      args: {
        items: "itemInput",
        itemsID: nonNull(idArg()),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { items, itemsID, userID }): Promise<any> => {
        const parsedData = ItemSchema.safeParse(items);
        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: "Invalid Schema Parse",
          };
        }

        const { dosage, expiredDate, item, price, quantity } =
          await parsedData.data;

        await prisma.logs.create({
          data: {
            logs: "Updated an Item",
            descriptions: `You updated an Item: ${item}`,
            User: {
              connect: {
                userID,
              },
            },
          },
        });
        return await prisma.items.update({
          data: {
            items: item,
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

import { objectType } from "nexus";
import { prisma } from "@/lib/prisma";

export const ProfleObject = objectType({
  name: "profile",
  definition(t) {
    t.id("profileID");
    t.string("fullname", {
      resolve: async ({ firstname, lastname }): Promise<any> => {
        return `${firstname} ${lastname}`;
      },
    });
    t.string("firstname");
    t.string("lastname");
    t.phone("phone");
    t.date("birthday");
    t.list.field("myUser", {
      type: "user",
      resolve: async ({ profileID }) => {
        return await prisma.profile.findMany({
          where: {
            profileID: profileID as string,
          },
        });
      },
    });
  },
});

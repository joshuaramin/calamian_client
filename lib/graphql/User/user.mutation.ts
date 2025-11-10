import {
  enumType,
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  stringArg,
} from "nexus";
import { prisma } from "@/lib/util/index";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import {
  AuthSchema,
  UserCreation,
  UserSchema,
} from "@/lib/validation/UserSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const { sign } = jsonwebtoken;

export const UserEnum = enumType({
  name: "role",
  members: ["admin", "manager", "staff"],
});

export const UserInput = inputObjectType({
  name: "userInput",
  definition(t) {
    t.email("email");
    t.string("firstname");
    t.string("lastname");
    t.phone("phone");
    t.date("birthday");
    t.float("salary");
    t.string("role");
  },
});

export const AuthInput = inputObjectType({
  name: "AuthInput",
  definition(t) {
    t.string("email");
    t.string("password");
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserAccount", {
      type: "UserPaylaod",
      args: { input: "userInput" },

      resolve: async (_: unknown, { input }): Promise<any> => {
        const parsedData = await UserCreation.safeParse(input);

        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: parsedData.error.message,
          };
        }

        const { email, birthday, firstname, lastname, phone, salary, role } =
          parsedData.data;

        const pass = await bcrypt.hash(
          new Date(birthday).toISOString().slice(0, 10).replaceAll("-", ""),
          12
        );

        const users = await prisma.user.create({
          data: {
            email,
            password: pass,
            role,
            Profile: {
              create: {
                firstname,
                lastname,
                birthday: new Date(birthday).toISOString(),
                phone,
              },
            },
            salary: {
              create: {
                salary,
              },
            },
          },
        });

        return {
          __typename: "user",
          ...users,
        };
      },
    });
    t.field("deleteUserAccount", {
      type: "user",
      args: { userID: nonNull(idArg()), main: nonNull(idArg()) },
      resolve: async (_, { userID, main }): Promise<any> => {
        const user = await prisma.user.delete({
          where: {
            userID,
          },
        });

        await prisma.logs.create({
          data: {
            logs: "Deleted Account",
            descriptions: "You delete an User Account",
            User: {
              connect: {
                userID: main,
              },
            },
          },
        });

        return user;
      },
    });
    t.field("login", {
      type: "AuthPayload",
      args: { input: "AuthInput" },
      resolve: async (_, { input }, { res }): Promise<any> => {
        const parsedData = AuthSchema.safeParse(input);

        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: parsedData.error.flatten().fieldErrors,
          };
        }

        const { email, password } = parsedData.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) throw new GraphQLError("Email Address is not found");

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          return {
            __typename: "ErrorObject",
            message: "Password is mismatched",
          };
        }

        const token = sign(
          { userId: user.userID, role: user.role },
          "pharmaceutical",
          {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 24 * 1000,
          }
        );

        // NextApi.("pha-tkn", token);

        // NextResponse.next().cookies.set("pha-tkn", token);

        await prisma.logs.create({
          data: {
            logs: "Logged In",
            descriptions: "",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });

        return {
          __typename: "token",
          user: user,
          token,
        };
      },
    });
    t.field("resetUserPasswordToDefault", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        const usersProfile = await prisma.profile.findUnique({
          where: {
            userID,
          },
        });

        if (!usersProfile) {
          return {
            message: "User Profile not found",
          };
        }

        const pass = await bcrypt.hash(
          new Date(usersProfile.birthday)
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", ""),
          12
        );

        await prisma.logs.create({
          data: {
            logs: "Reset Password",
            descriptions: "Your password has been reset to default",
            User: {
              connect: {
                userID: usersProfile.userID,
              },
            },
          },
        });
        return await prisma.user.update({
          data: {
            password: pass,
            updatedAt: new Date(Date.now()),
          },
          where: { userID },
        });
      },
    });

    t.field("updateUserAccounts", {
      type: "UserPaylaod",
      args: { userID: nonNull(idArg()), user: "userInput" },
      resolve: async (_, { userID, user }): Promise<any> => {
        const parsedData = UserCreation.safeParse(user);

        await prisma.logs.create({
          data: {
            logs: "Updated Account",
            descriptions: "You updated your account details",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        if (!parsedData.success) {
          return {
            __typename: "ErrorObject",
            message: "Invalid Schema Parse",
          };
        }

        const { email, birthday, firstname, lastname, phone, salary } =
          parsedData.data;
        return await prisma.user.update({
          data: {
            email,
            Profile: {
              update: {
                birthday,
                firstname,
                lastname,
                phone,
              },
            },
            salary: {
              update: {
                salary,
              },
            },
            updatedAt: new Date(Date.now()),
          },
          where: {
            userID,
          },
        });
      },
    });
    t.field("updateUserEmailAddress", {
      type: "user",
      args: { email: nonNull("EmailAddress"), userID: nonNull(idArg()) },
      resolve: async (_, { userID, email }): Promise<any> => {
        await prisma.logs.create({
          data: {
            logs: "Email Address Updated",
            descriptions: "You updated your email address",
            User: {
              connect: {
                userID,
              },
            },
          },
        });
        return await prisma.user.update({
          where: { userID },
          data: { email },
        });
      },
    });
    t.field("updateUserPassword", {
      type: "user",
      args: {
        userID: nonNull(idArg()),
        currentPasword: nonNull(stringArg()),
        password: nonNull(stringArg()),
        retype: nonNull(stringArg()),
      },

      resolve: async (
        _,
        { userID, password, retype, currentPasword }
      ): Promise<any> => {
        if (password !== retype)
          throw new GraphQLError("Password is not the same. Retype it again");
        const pass = await bcrypt.hash(password, 12);

        await prisma.logs.create({
          data: {
            logs: "Changed Password",
            descriptions: "You updated your password",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        const users = await prisma.user.findUnique({
          where: {
            userID,
          },
        });

        if (!users) throw new GraphQLError("User not found");

        const validPassword = await bcrypt.compare(
          currentPasword,
          users.password
        );
        if (!validPassword) throw new GraphQLError("Password is not match");

        return await prisma.user.update({
          data: {
            password: pass,
            updatedAt: new Date(Date.now()),
          },
          where: {
            userID,
          },
        });
      },
    });
  },
});

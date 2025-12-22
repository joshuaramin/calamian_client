import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { makeSchema, declarativeWrappingPlugin } from "nexus";
import { join } from "node:path";

import * as Scalar from "@/lib/graphql/scalar/scalar";
import * as Store from "@/lib/graphql/Store/store";
import * as User from "@/lib/graphql/User/user";
import * as Expense from "@/lib/graphql/expenseFolder/expense";
import * as Notification from "@/lib/graphql/Notification/notification";
import * as ErrorObject from "@/lib/graphql/error/error.object";
import * as Union from "@/lib/graphql/union/index";

export const config = {
  api: {
    bodyParser: false,
  },
};

let apolloServer: ApolloServer | null = null;

function getApolloServer() {
  if (!apolloServer) {
    const schema = makeSchema({
      types: [Scalar, Store, User, Expense, Notification, ErrorObject, Union],
      outputs: {
        schema: join(process.cwd(), "src/api/generated/schema.graphql"),
        typegen: join(process.cwd(), "src/api/generated/schema.ts"),
      },
      features: {
        abstractTypeStrategies: {
          resolveType: false,
          isTypeOf: false,
        },
      },
      plugins: [declarativeWrappingPlugin()],
    });

    apolloServer = new ApolloServer({
      schema,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    });
  }

  return apolloServer;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const server = getApolloServer();
  const apolloHandler = startServerAndCreateNextHandler(server);

  if (
    req.method === "POST" &&
    req.headers["content-type"]?.includes("application/json")
  ) {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch {
      req.body = {};
    }
  }

  return apolloHandler(req, res);
}

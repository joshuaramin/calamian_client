import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeSchema, declarativeWrappingPlugin } from "nexus";
import { join } from "node:path";

import * as Scalar from "@/lib/graphql/scalar/scalar";
import * as Store from "@/lib/graphql/Store/store";
import * as User from "@/lib/graphql/User/user";
import * as Expense from "@/lib/graphql/expenseFolder/expense";
import * as Notification from "@/lib/graphql/Notification/notification";
import * as ErrorObject from "@/lib/graphql/error/error.object";
import * as Union from "@/lib/graphql/union/index";

let apolloServer: ApolloServer;

function getApolloServer() {
  if (!apolloServer) {
    const schema = makeSchema({
      types: [Scalar, Store, User, Expense, Notification, ErrorObject, Union],
      outputs: {
        schema: join(process.cwd(), "src/api/generated/schema.graphql"),
        typegen: join(process.cwd(), "src/api/generated/schema.ts"),
      },
      plugins: [declarativeWrappingPlugin()],
    });

    apolloServer = new ApolloServer({
      schema,
      introspection: true,
    });
  }

  return apolloServer;
}

// Singleton wrapper to start the server **once**
let serverHandler: any;
export default async function handler(req: any, res: any) {
  if (!serverHandler) {
    const server = getApolloServer();
    serverHandler = startServerAndCreateNextHandler(server);
  }

  return serverHandler(req, res);
}

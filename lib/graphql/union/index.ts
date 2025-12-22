import { unionType } from "nexus";

export const UserPayload = unionType({
  name: "UserPaylaod",
  definition(t) {
    t.members("user", "ErrorObject");
  },
});

export const AuthPayload = unionType({
  name: "AuthPayload",
  definition(t) {
    t.members("token", "ErrorObject");
  },
});

export const ExpensePayload = unionType({
  name: "ExpensePayload",
  definition(t) {
    t.members("expenses", "ErrorObject");
  },
});

export const ItemPayload = unionType({
  name: "ItemPayload",
  definition(t) {
    t.members("item", "ErrorObject");
  },
});

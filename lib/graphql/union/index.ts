import { unionType } from "nexus";

export const UserPayload = unionType({
  name: "UserPaylaod",
  definition(t) {
    t.members("user", "ErrorObject");
  },
  resolveType: (item) => {
    if ("userId" in item) return "user";
    if ("message" in item) return "ErrorObject";
    return null;
  },
});

export const AuthPayload = unionType({
  name: "AuthPayload",
  definition(t) {
    t.members("token", "ErrorObject");
  },
  resolveType: (item) => {
    if ("token" in item) return "token";
    if ("message" in item) return "ErrorObject";
    return null;
  },
});

export const ExpensePayload = unionType({
  name: "ExpensePayload",
  definition(t) {
    t.members("expenses", "ErrorObject");
  },
  resolveType: (item) => {
    if ("expenseId" in item) return "expenses";
    if ("message" in item) return "ErrorObject";
    return null;
  },
});

export const ItemPayload = unionType({
  name: "ItemPayload",
  definition(t) {
    t.members("item", "ErrorObject");
  },
  resolveType: (item) => {
    if ("itemsID" in item) return "item";
    if ("message" in item) return "ErrorObject";
    return null;
  },
});

import { items } from "@prisma/client";

enum Roles {
  admin,
  manager,
  sales,
}

interface User {
  userID: string;
  email: string;
  password: string;
  role: Roles;
  Profile: Profile;
}

interface Profile {
  profileID: string;
  firstname: string;
  lastname: string;
  phone: string;
  birthday: string;
}

interface Category {
  categoryID: string;
  category: string;
  is_deleted: boolean;
  createdAt: any;
  updatedAt: any;
}

interface Items {
  itemsID: string;
  items: string;
  dosage: string;
  category: Category[];
  is_deleted: boolean;
  createdAt: any;
  updatedAt: any;
}

interface StoreInfo {
  storeinfoID: string;
  price: number;
  quantiity: number;
  expiredDate: any;
  createdAt: any;
  updatedAt: any;
  items: Items;
}

interface OrderListItem {
  orderListItemD: string;
  total: number;
  quiantity: number;
  items: Items[];
  createdAt: any;
}

interface Order {
  orderID: string;
  order: string;
  total: number;
  orderList: OrderListItem[];
  createdAt: any;
}

interface CartItem {
  items: items;
}

interface OrderCart {
  orderListItemID: string;
  cartItem: CartItem;
  quantity: number;
  total: number;
}

export interface getAllOrders {
  Order: Order[];
  orderCart: OrderCart;
}

interface Logs {
  logsID: string;
  logs: string;
  description: string;
  createdAt: any;
  User: User;
}

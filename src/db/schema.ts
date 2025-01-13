import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import * as t from "drizzle-orm/pg-core";
export const rolesEnum = pgEnum("roles", ["free", "paid", "admin"]);
export const UserModel = pgTable('userModel', {
  user_id: text('user_id').primaryKey().notNull(),
  user_name: text('user_name').notNull(),
  email: text('email').notNull(),
  usertype: rolesEnum().default("free"),
  subscription: text('subscription').default("0 free").notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
})
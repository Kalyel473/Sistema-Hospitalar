import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['CLIENT', 'EMPLOYEE', 'MANAGER']);

// Equipment status enum
export const equipmentStatusEnum = pgEnum('equipment_status', ['PENDING', 'CLEANING', 'FINISHED', 'RETURNED']);

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default('CLIENT'),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Clients schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

export const insertClientSchema = createInsertSchema(clients);
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Equipment schema
export const equipments = pgTable("equipments", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull().default(1),
  clientId: integer("client_id").notNull(),
  receivedBy: integer("received_by").notNull(),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
  status: equipmentStatusEnum("status").notNull().default('PENDING'),
  cleaningStartedAt: timestamp("cleaning_started_at"),
  cleaningFinishedAt: timestamp("cleaning_finished_at"),
  returnedAt: timestamp("returned_at"),
  returnedBy: integer("returned_by"),
});

export const insertEquipmentSchema = createInsertSchema(equipments).omit({
  id: true,
  code: true,
  receivedAt: true,
  cleaningStartedAt: true,
  cleaningFinishedAt: true,
  returnedAt: true,
  status: true,
});

export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipments.$inferSelect;

// Cleaning progress schema
export const cleaningSteps = pgTable("cleaning_steps", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  step: text("step").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export const insertCleaningStepSchema = createInsertSchema(cleaningSteps).omit({
  id: true,
  completedAt: true,
});

export type InsertCleaningStep = z.infer<typeof insertCleaningStepSchema>;
export type CleaningStep = typeof cleaningSteps.$inferSelect;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { equipmentStatusEnum, insertEquipmentSchema } from "@shared/schema";
import { generateEquipmentCode } from "../client/src/lib/utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes
  setupAuth(app);

  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clients" });
    }
  });

  // Create a new client
  app.post("/api/clients", async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ message: "Error creating client" });
    }
  });

  // Delete a client
  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting client" });
    }
  });

  // Get all employees (users with EMPLOYEE role)
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Error fetching employees" });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Delete a user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // Get all equipments
  app.get("/api/equipments", async (req, res) => {
    try {
      const equipments = await storage.getEquipments();
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipments" });
    }
  });

  // Get equipments with status FINISHED
  app.get("/api/equipments/finished", async (req, res) => {
    try {
      const equipments = await storage.getEquipmentsByStatus("FINISHED");
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching finished equipments" });
    }
  });

  // Create a new equipment
  app.post("/api/equipments", async (req, res) => {
    try {
      const parsedData = insertEquipmentSchema.parse(req.body);
      const nextId = await storage.getNextEquipmentId();
      const code = generateEquipmentCode(nextId);
      
      const equipment = await storage.createEquipment({
        ...parsedData,
        code,
        status: "PENDING"
      });
      
      res.status(201).json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error creating equipment" });
    }
  });

  // Update equipment status
  app.post("/api/equipments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!Object.values(equipmentStatusEnum.enumValues).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const equipment = await storage.updateEquipmentStatus(parseInt(id), status);
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error updating equipment status" });
    }
  });

  // Register equipment return
  app.post("/api/equipments/return", async (req, res) => {
    try {
      const { equipmentId, returnedBy, comments } = req.body;
      
      const equipment = await storage.returnEquipment(
        parseInt(equipmentId),
        parseInt(returnedBy),
        comments
      );
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error returning equipment" });
    }
  });

  // Get cleaning steps for an equipment
  app.get("/api/equipments/:id/cleaning-steps", async (req, res) => {
    try {
      const { id } = req.params;
      const cleaningSteps = await storage.getCleaningSteps(parseInt(id));
      res.json(cleaningSteps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cleaning steps" });
    }
  });

  // Update cleaning step status
  app.put("/api/cleaning-steps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      
      const cleaningStep = await storage.updateCleaningStep(parseInt(id), completed);
      res.json(cleaningStep);
    } catch (error) {
      res.status(500).json({ message: "Error updating cleaning step" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

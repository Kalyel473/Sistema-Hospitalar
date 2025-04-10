import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  equipments, type Equipment, type InsertEquipment,
  cleaningSteps, type CleaningStep, type InsertCleaningStep
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  getEmployees(): Promise<User[]>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Equipment operations
  getEquipment(id: number): Promise<Equipment | undefined>;
  getEquipments(): Promise<Equipment[]>;
  getEquipmentsByStatus(status: string): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment & { code: string }): Promise<Equipment>;
  updateEquipmentStatus(id: number, status: string): Promise<Equipment>;
  returnEquipment(id: number, returnedBy: number, comments?: string): Promise<Equipment>;
  getNextEquipmentId(): Promise<number>;
  
  // Cleaning steps operations
  getCleaningSteps(equipmentId: number): Promise<CleaningStep[]>;
  createCleaningStep(step: InsertCleaningStep): Promise<CleaningStep>;
  updateCleaningStep(id: number, completed: boolean): Promise<CleaningStep>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private equipments: Map<number, Equipment>;
  private cleaningSteps: Map<number, CleaningStep>;
  
  sessionStore: session.SessionStore;
  
  private userCurrentId: number;
  private clientCurrentId: number;
  private equipmentCurrentId: number;
  private cleaningStepCurrentId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.equipments = new Map();
    this.cleaningSteps = new Map();
    
    this.userCurrentId = 1;
    this.clientCurrentId = 1;
    this.equipmentCurrentId = 1;
    this.cleaningStepCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add some initial data for testing
    this.createInitialData();
  }

  // Initialize with some data for development
  private async createInitialData() {
    // Add some clients
    this.createClient({
      name: "Hospital Santa Clara",
      email: "contato@santaclara.com.br",
      phone: "(11) 3555-9000"
    });
    
    this.createClient({
      name: "Hospital São Lucas",
      email: "atendimento@saolucas.com.br",
      phone: "(11) 3777-8520"
    });
    
    this.createClient({
      name: "Clínica Médica Bem Estar",
      email: "clinica@bemestar.com.br",
      phone: "(11) 2222-3333"
    });
    
    // Add employee role to existing user if there's one logged in
    const users = Array.from(this.users.values());
    if (users.length > 0) {
      const existingUser = users[0];
      existingUser.role = "EMPLOYEE";
      this.users.set(existingUser.id, existingUser);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getEmployees(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "EMPLOYEE"
    );
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async deleteClient(id: number): Promise<void> {
    this.clients.delete(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientCurrentId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  // Equipment operations
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipments.get(id);
  }
  
  async getEquipments(): Promise<Equipment[]> {
    return Array.from(this.equipments.values());
  }
  
  async getEquipmentsByStatus(status: string): Promise<Equipment[]> {
    return Array.from(this.equipments.values()).filter(
      (equipment) => equipment.status === status
    );
  }
  
  async createEquipment(equipment: InsertEquipment & { code: string }): Promise<Equipment> {
    const id = this.equipmentCurrentId++;
    const now = new Date();
    
    const newEquipment: Equipment = {
      ...equipment,
      id,
      receivedAt: now.toISOString(),
      cleaningStartedAt: null,
      cleaningFinishedAt: null,
      returnedAt: null,
      returnedBy: null
    };
    
    this.equipments.set(id, newEquipment);
    
    // Create default cleaning steps for this equipment
    const steps = ["Recebimento", "Triagem Inicial", "Limpeza Básica", "Limpeza Profunda", "Esterilização", "Inspeção Final"];
    
    for (const step of steps) {
      await this.createCleaningStep({
        equipmentId: id,
        step,
        completed: false
      });
    }
    
    return newEquipment;
  }
  
  async updateEquipmentStatus(id: number, status: string): Promise<Equipment> {
    const equipment = await this.getEquipment(id);
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    
    const now = new Date();
    let updatedEquipment: Equipment = { ...equipment };
    
    // Update timestamps based on status change
    if (status === "CLEANING" && equipment.status !== "CLEANING") {
      updatedEquipment.cleaningStartedAt = now.toISOString();
    } else if (status === "FINISHED" && equipment.status !== "FINISHED") {
      updatedEquipment.cleaningFinishedAt = now.toISOString();
    }
    
    updatedEquipment.status = status;
    this.equipments.set(id, updatedEquipment);
    
    return updatedEquipment;
  }
  
  async returnEquipment(id: number, returnedBy: number, comments?: string): Promise<Equipment> {
    const equipment = await this.getEquipment(id);
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    
    const now = new Date();
    const updatedEquipment: Equipment = {
      ...equipment,
      status: "RETURNED",
      returnedAt: now.toISOString(),
      returnedBy
    };
    
    this.equipments.set(id, updatedEquipment);
    return updatedEquipment;
  }
  
  async getNextEquipmentId(): Promise<number> {
    return this.equipmentCurrentId;
  }

  // Cleaning steps operations
  async getCleaningSteps(equipmentId: number): Promise<CleaningStep[]> {
    return Array.from(this.cleaningSteps.values()).filter(
      (step) => step.equipmentId === equipmentId
    );
  }
  
  async createCleaningStep(step: InsertCleaningStep): Promise<CleaningStep> {
    const id = this.cleaningStepCurrentId++;
    const newStep: CleaningStep = {
      ...step,
      id,
      completedAt: null
    };
    
    this.cleaningSteps.set(id, newStep);
    return newStep;
  }
  
  async updateCleaningStep(id: number, completed: boolean): Promise<CleaningStep> {
    const step = this.cleaningSteps.get(id);
    if (!step) {
      throw new Error("Cleaning step not found");
    }
    
    const now = new Date();
    const updatedStep: CleaningStep = {
      ...step,
      completed,
      completedAt: completed ? now.toISOString() : null
    };
    
    this.cleaningSteps.set(id, updatedStep);
    
    // If this step was completed, check if we need to update equipment status
    if (completed) {
      const steps = await this.getCleaningSteps(step.equipmentId);
      const allCompleted = steps.every(s => s.completed || s.id === id);
      
      if (allCompleted) {
        // All steps completed, update equipment status to FINISHED
        await this.updateEquipmentStatus(step.equipmentId, "FINISHED");
      } else if (step.step === "Recebimento") {
        // First step completed, update equipment status to CLEANING
        await this.updateEquipmentStatus(step.equipmentId, "CLEANING");
      }
    }
    
    return updatedStep;
  }
}

export const storage = new MemStorage();

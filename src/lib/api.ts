import { Presenter, Table, User } from "@/app/types";
import { initialPresenters } from "@/app/mocks/data/presenters";
import { initialTables } from "@/app/mocks/data/tables";
import { initialUsers } from "@/app/mocks/data/users";
import { v4 as uuidv4 } from "uuid";
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  initializeStorage,
  updateStorageIfChanged,
} from "./storage";

// This is to simulate latency just like it would be in a real API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize localStorage data
if (typeof window !== "undefined") {
  // First ensure the storage has initial data
  initializeStorage(STORAGE_KEYS.PRESENTERS, initialPresenters);
  initializeStorage(STORAGE_KEYS.TABLES, initialTables);
  initializeStorage(STORAGE_KEYS.USERS, initialUsers);

  // This is to check if the data needs to be updated (for example: if schema or mock data changed)
  updateStorageIfChanged(STORAGE_KEYS.TABLES, initialTables);
  updateStorageIfChanged(STORAGE_KEYS.PRESENTERS, initialPresenters);
}

// To simulate API requests
export const api = {
  // Authentication
  auth: {
    login: async (username: string, password: string): Promise<User | null> => {
      await delay(500);
      const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, initialUsers);

      /* In a real app, passwords would be hashed and properly stored
      For this demo app, I'll use fixed passwords */
      const validCredentials = [
        { username: "admin", password: "password" },
        { username: "manager", password: "password" },
        { username: "viewer", password: "password" },
      ];

      // Check if credentials match
      const isValidCredential = validCredentials.some(
        (cred) => cred.username === username && cred.password === password
      );

      if (!isValidCredential) {
        return null;
      }

      // Find the user object
      const user = users.find((u) => u.username === username);

      if (user) {
        const authToken =
          "fake-jwt-token-" + Math.random().toString(36).substring(2);
        setStorageItem(STORAGE_KEYS.AUTH_TOKEN, authToken);

        return {
          ...user,
          token: authToken,
        };
      }

      return null;
    },

    getCurrentUser: async (): Promise<User | null> => {
      await delay(300);
      const token = getStorageItem<string | null>(
        STORAGE_KEYS.AUTH_TOKEN,
        null
      );

      if (!token) {
        return null;
      }

      // In a real app, I would need to validate the token
      const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, initialUsers);
      return users[0];
    },

    logout: async (): Promise<void> => {
      await delay(300);
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    },
  },

  // Game Presenters
  presenters: {
    getAll: async (): Promise<Presenter[]> => {
      await delay(800);
      return getStorageItem<Presenter[]>(
        STORAGE_KEYS.PRESENTERS,
        initialPresenters
      );
    },

    getById: async (id: string): Promise<Presenter | null> => {
      await delay(500);
      const presenters = getStorageItem<Presenter[]>(
        STORAGE_KEYS.PRESENTERS,
        initialPresenters
      );
      const presenter = presenters.find((p) => p.id === id);
      return presenter || null;
    },

    create: async (
      data: Omit<Presenter, "id" | "createdAt" | "updatedAt">
    ): Promise<Presenter> => {
      await delay(1000);
      const now = new Date().toISOString();
      const newPresenter: Presenter = {
        id: uuidv4(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const presenters = getStorageItem<Presenter[]>(
        STORAGE_KEYS.PRESENTERS,
        initialPresenters
      );
      const updatedPresenters = [...presenters, newPresenter];
      setStorageItem(STORAGE_KEYS.PRESENTERS, updatedPresenters);

      return newPresenter;
    },

    update: async (
      id: string,
      data: Partial<Presenter>
    ): Promise<Presenter | null> => {
      await delay(800);
      const presenters = getStorageItem<Presenter[]>(
        STORAGE_KEYS.PRESENTERS,
        initialPresenters
      );
      const index = presenters.findIndex((p) => p.id === id);

      if (index === -1) {
        return null;
      }

      const updatedPresenter = {
        ...presenters[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const updatedPresenters = [...presenters];
      updatedPresenters[index] = updatedPresenter;
      setStorageItem(STORAGE_KEYS.PRESENTERS, updatedPresenters);

      return updatedPresenter;
    },

    delete: async (id: string): Promise<boolean> => {
      await delay(700);
      const presenters = getStorageItem<Presenter[]>(
        STORAGE_KEYS.PRESENTERS,
        initialPresenters
      );
      const initialLength = presenters.length;
      const updatedPresenters = presenters.filter((p) => p.id !== id);

      if (initialLength > updatedPresenters.length) {
        setStorageItem(STORAGE_KEYS.PRESENTERS, updatedPresenters);
        return true;
      }

      return false;
    },
  },

  // Tables
  tables: {
    getAll: async (): Promise<Table[]> => {
      await delay(600);
      return getStorageItem<Table[]>(STORAGE_KEYS.TABLES, initialTables);
    },

    getById: async (id: string): Promise<Table | null> => {
      await delay(400);
      const tables = getStorageItem<Table[]>(
        STORAGE_KEYS.TABLES,
        initialTables
      );
      const table = tables.find((t) => t.id === id);
      return table || null;
    },

    create: async (
      data: Omit<Table, "id" | "createdAt" | "updatedAt">
    ): Promise<Table> => {
      await delay(800);
      const now = new Date().toISOString();
      const newTable: Table = {
        id: uuidv4(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const tables = getStorageItem<Table[]>(
        STORAGE_KEYS.TABLES,
        initialTables
      );
      const updatedTables = [...tables, newTable];
      setStorageItem(STORAGE_KEYS.TABLES, updatedTables);

      return newTable;
    },

    update: async (id: string, data: Partial<Table>): Promise<Table | null> => {
      await delay(700);
      const tables = getStorageItem<Table[]>(
        STORAGE_KEYS.TABLES,
        initialTables
      );
      const index = tables.findIndex((t) => t.id === id);

      if (index === -1) {
        return null;
      }

      const updatedTable = {
        ...tables[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const updatedTables = [...tables];
      updatedTables[index] = updatedTable;
      setStorageItem(STORAGE_KEYS.TABLES, updatedTables);

      return updatedTable;
    },

    delete: async (id: string): Promise<boolean> => {
      await delay(600);
      const tables = getStorageItem<Table[]>(
        STORAGE_KEYS.TABLES,
        initialTables
      );
      const initialLength = tables.length;
      const updatedTables = tables.filter((t) => t.id !== id);

      if (initialLength > updatedTables.length) {
        setStorageItem(STORAGE_KEYS.TABLES, updatedTables);
        return true;
      }

      return false;
    },
  },
};

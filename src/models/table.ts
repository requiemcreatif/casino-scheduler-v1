import { Table } from "../app/types";
import { v4 as uuidv4 } from "uuid";

export const createTable = (
  data: Omit<Table, "id" | "createdAt" | "updatedAt">
): Table => {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTable = (table: Table, data: Partial<Table>): Table => {
  return {
    ...table,
    ...data,
    updatedAt: new Date().toISOString(),
  };
};

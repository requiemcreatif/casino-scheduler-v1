import { Presenter } from "../app/types";
import { v4 as uuidv4 } from "uuid";

export const createPresenter = (
  data: Omit<Presenter, "id" | "createdAt" | "updatedAt">
): Presenter => {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

export const updatePresenter = (
  presenter: Presenter,
  data: Partial<Presenter>
): Presenter => {
  return {
    ...presenter,
    ...data,
    updatedAt: new Date().toISOString(),
  };
};

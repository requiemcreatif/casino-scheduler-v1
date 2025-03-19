import { User } from "@/app/types";
import { v4 as uuidv4 } from "uuid";

export const initialUsers: User[] = [
  {
    id: uuidv4(),
    username: "admin",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: uuidv4(),
    username: "manager",
    email: "manager@example.com",
    role: "manager",
  },
  {
    id: uuidv4(),
    username: "viewer",
    email: "viewer@example.com",
    role: "viewer",
  },
];

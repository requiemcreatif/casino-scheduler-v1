export type Shift = "morning" | "afternoon" | "night";

export interface Presenter {
  id: string;
  name: string;
  email: string;
  phone: string;
  shift: Shift;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  name: string;
  number: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RotationSlot {
  time: string;
  endTime: string;
  presenterId: string;
  presenterName: string;
  assignment: string; // 'Table 1', 'Table 2', 'Break'
}

export interface DailySchedule {
  morning: RotationSlot[][];
  afternoon: RotationSlot[][];
  night: RotationSlot[][];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  token?: string;
}

export type ViewMode = "grid" | "list";

import { z } from "zod";

export const addTaskInput = z.object({
  title: z.string().min(1, "Title is required").max(255),
});

export const taskIdInput = z.object({
  id: z.string().cuid("Invalid task ID"),
});

export const updateTaskInput = z.object({
  id: z.string().cuid("Invalid task ID"),
  title: z.string().min(1).max(255).optional(),
});


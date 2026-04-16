import { z } from "zod";

// Validation schema for addTask mutation.
export const addTaskInput = z.object({
  title: z.string().min(1, "Title is required").max(255),
});

// Shared validation for operations that require a Task id.
export const taskIdInput = z.object({
  id: z.string().cuid("Invalid task ID"),
});

// Validation schema for bonus updateTask mutation.
export const updateTaskInput = z.object({
  id: z.string().cuid("Invalid task ID"),
  title: z.string().min(1).max(255).optional(),
});


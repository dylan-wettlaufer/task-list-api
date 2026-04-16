import { builder } from "../builder.js";
import { prisma } from "../db.js";
import { GraphQLError } from "graphql";
import { addTaskInput, taskIdInput, updateTaskInput } from "./validators.js";

// Creates a new task with
builder.mutationField("addTask", (t) =>
    t.prismaField({
        type: "Task",
        args: {
            title: t.arg.string({ required: true })
        },
        resolve: async (query, _root, args) => {
            const parsedArgs = addTaskInput.safeParse(args);
            if (!parsedArgs.success) {
                throw new GraphQLError(parsedArgs.error.issues[0]?.message ?? "Invalid task input");
            }

            const { title } = parsedArgs.data;
            const task = await prisma.task.create({ ...query, data: { title } });
            return task;
        }
    })
);

// Flips the completed state for a task.
builder.mutationField("toggleTask", (t) =>
    t.prismaField({
        type: "Task",
        nullable: true,
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, _root, args) => {
            const parsedArgs = taskIdInput.safeParse(args);
            if (!parsedArgs.success) {
                throw new GraphQLError(parsedArgs.error.issues[0]?.message ?? "Invalid task ID");
            }

            const { id } = parsedArgs.data;
            const task = await prisma.task.findUnique({ ...query, where: { id } });
            if (!task) throw new GraphQLError(`Task ${id} not found`);
            const updatedTask = await prisma.task.update({ ...query, where: { id }, data: { completed: { set: !task.completed } } });
            return updatedTask;
        }
    })
);

// Removes a task permanently.
builder.mutationField("deleteTask", (t) =>
    t.prismaField({
      type: "Task",
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, _root, args) => {
        const parsedArgs = taskIdInput.safeParse(args);
        if (!parsedArgs.success) {
            throw new GraphQLError(parsedArgs.error.issues[0]?.message ?? "Invalid task ID");
        }

        const { id } = parsedArgs.data;
        const task = await prisma.task.findUnique({ ...query, where: { id } });
        if (!task) throw new GraphQLError(`Task ${id} not found`);
        return prisma.task.delete({ ...query, where: { id } });
      },
    })
  );


// BONUS: Update Task
builder.mutationField("updateTask", (t) =>
    t.prismaField({
        type: "Task",
        nullable: true,
        args: {
            id: t.arg.string({ required: true }),
            title: t.arg.string({ required: false }),
        },
        resolve: async (query, _root, args) => {
            const parsedArgs = updateTaskInput.safeParse(args);
            if (!parsedArgs.success) {
                throw new GraphQLError(parsedArgs.error.issues[0]?.message ?? "Invalid task input");
            }

            const { id, title } = parsedArgs.data;
            const task = await prisma.task.findUnique({ ...query, where: { id } });
            if (!task) throw new GraphQLError(`Task ${id} not found`);
            const updatedTask = await prisma.task.update({ ...query, where: { id }, data: { title: title ?? task.title } });
            return updatedTask;
        }
    })
);
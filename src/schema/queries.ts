import { builder } from "../builder.js";
import { prisma } from "../db.js";
import { GraphQLError } from "graphql";
import { taskIdInput } from "./validators.js";

builder.queryField("tasks",  (t) =>
    t.prismaField({
        type: ["Task"],
        resolve: (query) =>
            prisma.task.findMany({...query, orderBy: { createdAt: "desc" }}),
    })
);

builder.queryField("task", (t) =>
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
            return task;
        }
    })
);

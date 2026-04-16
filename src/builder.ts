import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { getDatamodel } from "@pothos/plugin-prisma/generated";
import { prisma } from "./db.js";

export const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
}>({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
        dmmf: getDatamodel(),
        filterConnectionTotalCount: true,
        onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
    },
});

builder.queryType({});
builder.mutationType({});
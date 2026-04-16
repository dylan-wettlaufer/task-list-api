import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { getDatamodel } from "@pothos/plugin-prisma/generated";
import { prisma } from "./db.js";
import { DateTimeResolver } from "graphql-scalars";

// Central Pothos builder used by every object, query, and mutation definition.
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    filterConnectionTotalCount: true,
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
});

// Reuse a shared DateTime scalar for Prisma timestamp fields.
builder.addScalarType("DateTime", DateTimeResolver, {});
builder.queryType({});
builder.mutationType({});
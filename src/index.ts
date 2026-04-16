import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { builder } from "./builder.js";
import "./schema/task.type.js";
import "./schema/queries.js";
import "./schema/mutations.js";

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000, () => {
  console.log("Visit http://localhost:3000/graphql");
});

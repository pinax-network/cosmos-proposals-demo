import { GraphQLClient } from "graphql-request";

const THE_GRAPH_API_KEY = process.env.THE_GRAPH_API_KEY;

// Add a type for supported networks
export const SUBGRAPH_IDS = {
  injective: "2aYHh1GtHqHTU782VMxg5Hzpzsc4q4WdxniKW7MAvBBj",
} as const;

export type Network = keyof typeof SUBGRAPH_IDS;

// Shared client creation function
export function getClient(network: Network) {
  return new GraphQLClient(
    `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/${SUBGRAPH_IDS[network]}`
  );
}

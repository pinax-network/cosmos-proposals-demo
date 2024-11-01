import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";

const THE_GRAPH_API_KEY = process.env.THE_GRAPH_API_KEY;

// Initialize the GraphQL client
const client = new GraphQLClient(
  `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/2aYHh1GtHqHTU782VMxg5Hzpzsc4q4WdxniKW7MAvBBj`
);

// Define the query
const PROPOSALS_QUERY = gql`
  query GetProposals {
    proposals(first: 100, orderBy: block__number, orderDirection: desc) {
      id
      title
      type
      status
      submit_time
      deposit_end_time
      voting_end_time
      voting_start_time
      messages {
        type
      }
    }
  }
`;

interface Proposal {
  id: string;
  title: string;
  type: string;
  status: string;
  submit_time: string;
  deposit_end_time: string;
  voting_end_time: string;
  voting_start_time: string;
  messages: {
    type: string;
  }[];
}

export interface ProposalsResponse {
  proposals: Proposal[];
}

export async function GET() {
  try {
    const data = await client.request<ProposalsResponse>(PROPOSALS_QUERY);

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return Response.json(
      { error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}

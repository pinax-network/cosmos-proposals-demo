import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";

const THE_GRAPH_API_KEY = process.env.THE_GRAPH_API_KEY;

// Initialize the GraphQL client
const client = new GraphQLClient(
  `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/2aYHh1GtHqHTU782VMxg5Hzpzsc4q4WdxniKW7MAvBBj`
);

// Define the query
const PROPOSAL_QUERY = gql`
  query GetProposal($id: ID!) {
    proposal(id: $id) {
      id
      title
      summary
      type
      status
      submit_time
      deposit_end_time
      voting_end_time
      voting_start_time
      messages {
        type
      }
      votes {
        voter
        option
        block {
          timestamp
        }
      }
    }
  }
`;

interface Vote {
  voter: string;
  option: string;
  block: {
    timestamp: string;
  };
}

export interface Proposal {
  id: string;
  title: string;
  summary: string;
  type: string;
  status: string;
  submit_time: string;
  deposit_end_time: string;
  voting_end_time: string;
  voting_start_time: string;
  messages: {
    type: string;
  }[];
  votes: Vote[];
}

export interface ProposalResponse {
  proposal: Proposal;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Proposal ID is required" }, { status: 400 });
  }

  try {
    const data = await client.request<ProposalResponse>(PROPOSAL_QUERY, { id });
    return Response.json(data.proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return Response.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}

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

interface ProposalRaw {
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

export interface Proposal {
  id: string;
  title: string;
  summary: string;
  type: string;
  status: string;
  submit_time: number;
  deposit_end_time: number;
  voting_end_time?: number;
  voting_start_time?: number;
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

    const sortedVotes = data.proposal.votes.sort((a, b) => {
      return Number(b.block.timestamp) - Number(a.block.timestamp);
    });

    const proposal: Proposal = {
      ...data.proposal,
      submit_time: Number(data.proposal.submit_time) / 1000,
      deposit_end_time: Number(data.proposal.deposit_end_time) / 1000,
      voting_end_time: data.proposal.voting_end_time
        ? Number(data.proposal.voting_end_time) / 1000
        : undefined,
      voting_start_time: data.proposal.voting_start_time
        ? Number(data.proposal.voting_start_time) / 1000
        : undefined,
      votes: sortedVotes,
    };

    return Response.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return Response.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}
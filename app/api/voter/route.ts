import { getClient, type Network } from "@/app/utils/graphql";
import { gql } from "graphql-request";
import type { GraphQLClient } from "graphql-request";

export interface VoterVote {
  option: string;
  weight: string;
  block: {
    timestamp: string;
  };
  proposal: {
    id: string;
    title: string;
  };
}

export interface VoterResponse {
  votes: VoterVote[];
}

const voterQuery = gql`
  query GetVoterVotes($voter: String!) {
    votes(where: { voter: $voter }) {
      option
      weight
      block {
        timestamp
      }
      proposal {
        id
        title
      }
    }
  }
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const voter = searchParams.get("voter");
  const network = searchParams.get("network");

  if (!voter || !network) {
    return new Response("Missing voter or network parameter", { status: 400 });
  }

  try {
    const client = getClient(network as Network);
    const data: VoterResponse = await client.request(voterQuery, {
      voter,
    });

    return new Response(JSON.stringify(data.votes), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching voter data:", error);
    return new Response("Error fetching voter data", { status: 500 });
  }
}

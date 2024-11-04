import { gql } from "graphql-request";
import type { GraphQLClient } from "graphql-request";
import { getClient, type Network } from "@/app/utils/graphql";

const PROPOSAL_QUERY = gql`
  query GetProposal($id: ID!, $first: Int!, $skip: Int!) {
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
      deposits {
        amount
        denom
      }
      votes(first: $first, skip: $skip) {
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
  deposits: {
    amount: string;
    denom: string;
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
  total_deposit: string;
}

export interface ProposalResponse {
  proposal: ProposalRaw;
}

async function fetchAllVotes(
  client: GraphQLClient,
  id: string
): Promise<Vote[]> {
  const BATCH_SIZE = 1000;
  let allVotes: Vote[] = [];
  let hasMore = true;
  let skip = 0;

  while (hasMore) {
    const data = await client.request<ProposalResponse>(PROPOSAL_QUERY, {
      id,
      first: BATCH_SIZE,
      skip,
    });

    const batchVotes = data.proposal.votes;
    allVotes = [...allVotes, ...batchVotes];

    hasMore = batchVotes.length === BATCH_SIZE;
    skip += BATCH_SIZE;
  }

  return allVotes;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const network = searchParams.get("network") as Network;

  if (!id) {
    return Response.json({ error: "Proposal ID is required" }, { status: 400 });
  }
  if (!network) {
    return Response.json({ error: "Network is required" }, { status: 400 });
  }

  const client = getClient(network);

  try {
    // Fetch initial data with first batch of votes
    const data = await client.request<ProposalResponse>(PROPOSAL_QUERY, {
      id,
      first: 1000,
      skip: 0,
    });

    // Fetch all votes
    const allVotes = await fetchAllVotes(client, id);

    const sortedVotes = allVotes.sort((a, b) => {
      return Number(b.block.timestamp) - Number(a.block.timestamp);
    });
    const total_deposit =
      data.proposal.deposits.reduce(
        (acc: number, deposit: { amount: string; denom: string }) =>
          acc + Number(deposit.amount),
        0
      ) / 1e18;
    const total_deposit_string =
      data.proposal.deposits.length > 0
        ? `${total_deposit} ${data.proposal.deposits[0].denom.toUpperCase()}`
        : "0";

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
      total_deposit: total_deposit_string,
      votes: sortedVotes,
    };

    return Response.json(proposal, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return Response.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}

import { getClient, type Network } from "@/app/utils/graphql";

// Define the query
const PROPOSALS_QUERY = `
  query GetProposals {
    proposals(first: 1000, orderBy: block__number, orderDirection: desc) {
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
  submit_time: number;
  deposit_end_time: number;
  voting_end_time: number;
  voting_start_time: number;
  messages: {
    type: string;
  }[];
}

export interface ProposalsResponse {
  proposals: Proposal[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get("network") as Network;
    

    if (!network) {
      return Response.json({ error: "Network is required" }, { status: 400 });
    }

    const client = getClient(network);

    const data = await client.request<ProposalsResponse>(PROPOSALS_QUERY);

    const proposals = data.proposals.map((proposal) => ({
      ...proposal,
      submit_time: Number(proposal.submit_time) / 1000,
      deposit_end_time: Number(proposal.deposit_end_time) / 1000,
      voting_end_time: Number(proposal.voting_end_time) / 1000,
      voting_start_time: Number(proposal.voting_start_time) / 1000,
    }));

    console.log(proposals);

    return Response.json(
      { proposals },
      {
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

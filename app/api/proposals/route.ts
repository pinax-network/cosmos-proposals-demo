import { getClient, type Network } from "@/app/utils/graphql";

// Define the query
const PROPOSALS_QUERY = `
  query GetProposals {
    proposals(orderBy: block__number, orderDirection: desc) {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get("network") as Network;

    if (!network) {
      return Response.json({ error: "Network is required" }, { status: 400 });
    }

    const client = getClient(network);

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

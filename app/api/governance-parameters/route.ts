import { getClient, type Network } from "@/app/utils/graphql";

const GOVERNANCE_PARAMETERS_QUERY = `
  query GetGovernanceParameters {
    governanceParameters(orderBy: block__number, orderDirection: desc) {
      block {
        number
        timestamp
      }
      deposit_params {
        expedited_min_deposit
        max_deposit_period
        min_deposit
      }
      tally_params {
        expedited_threshold
        expedited_quorum
        threshold
        quorum
        veto_threshold
      }
      voting_params {
        expedited_voting_period
        voting_period
      }
    }
  }
`;

interface GovernanceParameters {
  block: {
    number: string;
    timestamp: string;
  };
  deposit_params: {
    expedited_min_deposit: string[];
    max_deposit_period: string;
    min_deposit: string[];
  };
  tally_params: {
    expedited_threshold: string;
    expedited_quorum: string;
    threshold: string;
    quorum: string;
    veto_threshold: string;
  };
  voting_params: {
    expedited_voting_period: string;
    voting_period: string;
  };
}

export interface GovernanceParametersResponse {
  governanceParameters: GovernanceParameters[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get("network") as Network;

    if (!network) {
      return Response.json({ error: "Network is required" }, { status: 400 });
    }

    const client = getClient(network);
    const data = await client.request<GovernanceParametersResponse>(
      GOVERNANCE_PARAMETERS_QUERY
    );

    // Convert timestamp to seconds if needed for all parameters
    const parameters = data.governanceParameters.map(param => ({
      ...param,
      block: {
        ...param.block,
        timestamp: Number(param.block.timestamp) * 1000,
      },
    }));

    return Response.json(
      { parameters },
      { }
    );
  } catch (error) {
    console.error("Error fetching governance parameters:", error);
    return Response.json(
      { error: "Failed to fetch governance parameters" },
      { status: 500 }
    );
  }
}
import Image from "next/image";

const MOCK_PROPOSALS = [
  {
    id: 452,
    title: "Update Kira Liquidity Pool Locker",
    type: "Msg Store Code",
    status: "VOTING_PERIOD",
    endTime: "Nov 1st, 2024 13:26:53",
    votingPeriod: "Oct 28th 2024, 13:26:53 - Nov 1st 2024, 13:26:53",
    remainingTime: "0 Days",
  },
  {
    id: 451,
    title: "Paradyze Mainnet Provider Oracle",
    type: "Grant Provider Privilege",
    status: "VOTING_PERIOD",
    endTime: "Oct 31st, 2024 20:26:15",
    votingPeriod: "Oct 27th 2024, 20:26:15 - Oct 31st 2024, 20:26:15",
    remainingTime: "0 Days",
  },
  // ... more mock proposals
];

const SUMMARY = {
  total: 401,
  votingPeriod: 2,
  passed: 361,
  rejected: 34,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] p-8 space-y-8 text-white">
      {/* Proposals Summary */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#FF9B9B]">
          Proposals Summary
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{SUMMARY.total}</p>
          </div>
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Voting Period</p>
            <p className="text-2xl font-bold text-white">
              {SUMMARY.votingPeriod}
            </p>
          </div>
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Passed</p>
            <p className="text-2xl font-bold text-white">{SUMMARY.passed}</p>
          </div>
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Rejected</p>
            <p className="text-2xl font-bold text-white">{SUMMARY.rejected}</p>
          </div>
        </div>
      </div>

      {/* Live Proposals */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#FF9B9B]">
            Live Proposals{" "}
            <span className="text-[#7EE7D0]">{SUMMARY.votingPeriod}</span>
          </h2>
          <button className="text-[#7EE7D0] hover:text-white transition-colors">
            Show All Proposals
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_PROPOSALS.slice(0, 2).map((proposal) => (
            <div
              key={proposal.id}
              className="bg-[#1C2128]/50 p-4 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#7EE7D0]/20 text-[#7EE7D0] px-2 py-1 rounded-md text-sm">
                  {proposal.type}
                </span>
                <span className="text-[#7EE7D0]">
                  Remaining Time: {proposal.remainingTime}
                </span>
              </div>
              <p className="font-medium">
                #{proposal.id}. {proposal.title}
              </p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="text-[#FF9B9B]">Voting Period:</span>{" "}
                  <span className="text-[#7EE7D0]">
                    {proposal.votingPeriod}
                  </span>
                </p>
                <div className="w-full h-2 bg-[#1C2128] rounded-full mt-2">
                  <div className="w-3/4 h-full bg-gradient-to-r from-[#7EE7D0] to-[#FF9B9B] rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Proposals */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#FF9B9B]">
            All Proposals
          </h2>
          <div className="flex gap-4">
            <input
              type="search"
              placeholder="Search"
              className="px-4 py-2 bg-[#1C2128]/50 border border-[#1C2128] rounded-md text-white placeholder-[#7EE7D0]/50 focus:outline-none focus:border-[#7EE7D0]"
            />
            <button className="text-[#7EE7D0] hover:text-white transition-colors">
              Show All Proposals
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#1C2128]">
              <th className="pb-2 text-[#7EE7D0]">ID</th>
              <th className="pb-2 text-[#7EE7D0]">Title</th>
              <th className="pb-2 text-[#7EE7D0]">Type</th>
              <th className="pb-2 text-[#7EE7D0]">Status</th>
              <th className="pb-2 text-[#7EE7D0]">End Time</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PROPOSALS.map((proposal) => (
              <tr
                key={proposal.id}
                className="border-b border-[#1C2128] hover:bg-[#1C2128]/30"
              >
                <td className="py-4">#{proposal.id}</td>
                <td>{proposal.title}</td>
                <td>
                  <span className="bg-[#7EE7D0]/20 text-[#7EE7D0] px-2 py-1 rounded-md text-sm">
                    {proposal.type}
                  </span>
                </td>
                <td>
                  <span className="text-[#FF9B9B] font-medium">
                    {proposal.status.replace("_", " ")}
                  </span>
                </td>
                <td className="text-[#7EE7D0]">{proposal.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

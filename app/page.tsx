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
    <div className="min-h-screen bg-white p-8 space-y-8">
      {/* Proposals Summary */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Proposals Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold">{SUMMARY.total}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Voting Period</p>
            <p className="text-2xl font-bold">{SUMMARY.votingPeriod}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Passed</p>
            <p className="text-2xl font-bold">{SUMMARY.passed}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-2xl font-bold">{SUMMARY.rejected}</p>
          </div>
        </div>
      </div>

      {/* Live Proposals */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Live Proposals{" "}
            <span className="text-gray-500">{SUMMARY.votingPeriod}</span>
          </h2>
          <button className="text-gray-600 hover:text-gray-800">
            Show All Proposals
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_PROPOSALS.slice(0, 2).map((proposal) => (
            <div key={proposal.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  {proposal.type}
                </span>
                <span className="text-gray-500">
                  Remaining Time: {proposal.remainingTime}
                </span>
              </div>
              <p className="font-medium">
                #{proposal.id}. {proposal.title}
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="text-orange-600">Voting Period:</span>{" "}
                  {proposal.votingPeriod}
                </p>
                {/* Add voting progress bar here if needed */}
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Proposals */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Proposals</h2>
          <div className="flex gap-4">
            <input
              type="search"
              placeholder="Search"
              className="px-4 py-2 border rounded-md"
            />
            <button className="text-gray-600 hover:text-gray-800">
              Show All Proposals
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">ID</th>
              <th className="pb-2">Title</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PROPOSALS.map((proposal) => (
              <tr key={proposal.id} className="border-b hover:bg-gray-50">
                <td className="py-4">#{proposal.id}</td>
                <td>{proposal.title}</td>
                <td>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                    {proposal.type}
                  </span>
                </td>
                <td>
                  <span className="text-orange-600 font-medium">
                    {proposal.status.replace("_", " ")}
                  </span>
                </td>
                <td className="text-gray-600">{proposal.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

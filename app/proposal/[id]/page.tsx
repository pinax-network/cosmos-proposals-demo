"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Proposal, ProposalResponse } from "@/app/api/proposal/route";

export default function ProposalPage() {
  const params = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const response = await fetch(`/api/proposal?id=${params.id}`);
        const data: Proposal = await response.json();
        if (data) {
          setProposal(data);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposal();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-black">Loading...</div>;
  }

  if (!proposal) {
    return <div className="p-8 text-black">Proposal not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          #{proposal.id} {proposal.title}
        </h1>
        <div className="grid gap-4">
          <div className="bg-[#1C2128]/50 p-4 rounded-md">
            <h2 className="text-[#7EE7D0] text-sm mb-2">Summary</h2>
            <p>{proposal.summary}</p>
          </div>

          <div className="bg-[#1C2128]/50 p-4 rounded-md">
            <h2 className="text-[#7EE7D0] text-sm mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Type</p>
                <p>{proposal.type}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p>{proposal.status}</p>
              </div>
              <div>
                <p className="text-gray-400">Submit Time</p>
                <p>{new Date(Number(proposal.submit_time)).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Deposit End Time</p>
                <p>
                  {new Date(Number(proposal.deposit_end_time)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Voting Start Time</p>
                <p>
                  {new Date(
                    Number(proposal.voting_start_time)
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Voting End Time</p>
                <p>
                  {new Date(Number(proposal.voting_end_time)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2128]/50 p-4 rounded-md">
            <h2 className="text-[#7EE7D0] text-sm mb-2">Votes</h2>
            <div className="space-y-2">
              {proposal.votes.map((vote, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-sm">{vote.voter}</p>
                  <p className="text-sm text-[#7EE7D0]">{vote.option}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

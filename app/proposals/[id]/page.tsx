"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ProposalsResponse } from "../../api/proposals/route";

export default function ProposalPage() {
  const params = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const response = await fetch(`/api/proposals?id=${params.id}`);
        const data: ProposalsResponse = await response.json();
        if (data.proposals && data.proposals[0]) {
          setProposal(data.proposals[0]);
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
    return <div className="p-8 text-white">Loading...</div>;
  }

  if (!proposal) {
    return <div className="p-8 text-white">Proposal not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          #{proposal.id} {proposal.title}
        </h1>
        {/* Add more proposal details here */}
      </div>
    </div>
  );
}

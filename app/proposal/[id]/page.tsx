"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Proposal, ProposalResponse } from "@/app/api/proposal/route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeToggle } from "@/components/theme-toggle";

function VotingResults({ proposal }: { proposal: Proposal }) {
  // Calculate vote counts
  const voteCounts = proposal.votes.reduce((acc, vote) => {
    acc[vote.option] = (acc[vote.option] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md mb-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-green-500/20 bg-green-50 dark:bg-green-500/10 rounded-md p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">YES</div>
          <div className="text-xl font-semibold text-green-600 dark:text-green-500">
            {voteCounts.Yes || 0}
          </div>
        </div>

        <div className="border border-red-500/20 bg-red-50 dark:bg-red-500/10 rounded-md p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">NO</div>
          <div className="text-xl font-semibold text-red-600 dark:text-red-500">
            {voteCounts.No || 0}
          </div>
        </div>

        <div className="border border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 rounded-md p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">VETO</div>
          <div className="text-xl font-semibold text-orange-600 dark:text-orange-500">
            {voteCounts.NoWithVeto || 0}
          </div>
        </div>

        <div className="border border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 rounded-md p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ABSTAIN
          </div>
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-500">
            {voteCounts.Abstain || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProposalPage() {
  const params = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const votesPerPage = 20;

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

  const getPagedVotes = () => {
    if (!proposal) return [];
    const startIndex = (currentPage - 1) * votesPerPage;
    const endIndex = startIndex + votesPerPage;
    return proposal.votes.slice(startIndex, endIndex);
  };

  const totalPages = proposal
    ? Math.ceil(proposal.votes.length / votesPerPage)
    : 0;

  if (loading) {
    return <div className="p-8 text-black">Loading...</div>;
  }

  if (!proposal) {
    return <div className="p-8 text-black">Proposal not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white dark:from-[#0D1117] dark:via-[#161B22] dark:to-[#0D1117] p-8 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            #{proposal.id} {proposal.title}
          </h1>
          <ThemeToggle />
        </div>

        <VotingResults proposal={proposal} />

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-[#1C2128]">
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#2D333B] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#2D333B] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="votes"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#2D333B] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              Votes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md">
              <h2 className="text-[#7EE7D0] text-sm mb-2">Summary</h2>
              <p className="whitespace-pre-line">{proposal.summary}</p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md">
              <h2 className="text-[#7EE7D0] text-sm mb-2">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Type</p>
                  <p>{proposal.messages[0].type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p>{proposal.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">Submit Time</p>
                  <p>{new Date(proposal.submit_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Deposit End Time</p>
                  <p>{new Date(proposal.deposit_end_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Voting Start Time</p>
                  <p>
                    {proposal.voting_start_time
                      ? new Date(proposal.voting_start_time).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Voting End Time</p>
                  <p>
                    {proposal.voting_end_time
                      ? new Date(proposal.voting_end_time).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total Deposit</p>
                  <p>{proposal.total_deposit}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="votes" className="mt-4">
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md">
              <h2 className="text-[#7EE7D0] text-sm mb-4">Votes</h2>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#2D333B]/50 border-[#2D333B]">
                    <TableHead className="text-[#7EE7D0]">Voter</TableHead>
                    <TableHead className="text-[#7EE7D0]">Time</TableHead>
                    <TableHead className="text-right text-[#7EE7D0]">
                      Vote
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPagedVotes().map((vote) => (
                    <TableRow
                      key={vote.voter}
                      className="hover:bg-[#2D333B]/50 border-[#2D333B]"
                    >
                      <TableCell className="font-mono">{vote.voter}</TableCell>
                      <TableCell>
                        {new Date(
                          Number(vote.block.timestamp) * 1000
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`
                            px-2 py-1 rounded-full text-xs
                            ${
                              vote.option === "YES" &&
                              "bg-green-500/10 text-green-500"
                            }
                            ${
                              vote.option === "NO" &&
                              "bg-red-500/10 text-red-500"
                            }
                            ${
                              vote.option === "VETO" &&
                              "bg-orange-500/10 text-orange-500"
                            }
                            ${
                              vote.option === "ABSTAIN" &&
                              "bg-blue-500/10 text-blue-500"
                            }
                          `}
                        >
                          {vote.option}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * votesPerPage + 1} to{" "}
                  {Math.min(currentPage * votesPerPage, proposal.votes.length)}{" "}
                  of {proposal.votes.length} votes
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-100 dark:bg-[#2D333B] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-100 dark:bg-[#2D333B] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

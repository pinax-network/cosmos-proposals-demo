"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import type { VoterVote } from "@/app/api/voter/route";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function VoterPage() {
  const params = useParams();
  const router = useRouter();
  const [votes, setVotes] = useState<VoterVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const votesPerPage = 20;

  useEffect(() => {
    async function fetchVoterVotes() {
      try {
        const response = await fetch(
          `/api/voter?voter=${params.id}&network=${params.network}`
        );
        const data = await response.json();
        setVotes(data);
      } catch (error) {
        console.error("Error fetching voter votes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVoterVotes();
  }, [params.id, params.network]);

  const getPagedVotes = () => {
    const startIndex = (currentPage - 1) * votesPerPage;
    const endIndex = startIndex + votesPerPage;
    return votes.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(votes.length / votesPerPage);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Header isClient={true} network={params.network as string} />
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white dark:from-[#0D1117] dark:via-[#161B22] dark:to-[#0D1117] p-8 text-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="px-3 py-1 rounded-md bg-gray-100 dark:bg-[#2D333B] hover:bg-gray-200 dark:hover:bg-[#373E47] transition-colors"
                type="button"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-semibold">Voter Details</h1>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md">
            <h2 className="text-emerald-800 dark:text-[#7EE7D0] text-sm mb-2">
              Address
            </h2>
            <p className="font-mono mb-6">{params.id}</p>

            <h2 className="text-emerald-800 dark:text-[#7EE7D0] text-sm mb-4">
              Voting History
            </h2>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#2D333B]/50 border-[#2D333B]">
                  <TableHead className="text-emerald-800 dark:text-[#7EE7D0]">
                    Proposal ID
                  </TableHead>
                  <TableHead className="text-emerald-800 dark:text-[#7EE7D0]">
                    Title
                  </TableHead>
                  <TableHead className="text-emerald-800 dark:text-[#7EE7D0]">
                    Time
                  </TableHead>
                  <TableHead className="text-right text-emerald-800 dark:text-[#7EE7D0]">
                    Vote
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getPagedVotes().map((vote) => (
                  <TableRow
                    key={`${vote.proposal.id}-${vote.block.timestamp}`}
                    className="hover:bg-[#2D333B]/50 border-[#2D333B] cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/${params.network}/proposal/${vote.proposal.id}`
                      )
                    }
                  >
                    <TableCell>#{vote.proposal.id}</TableCell>
                    <TableCell>{vote.proposal.title}</TableCell>
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
                            vote.option === "NO" && "bg-red-500/10 text-red-500"
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
                {Math.min(currentPage * votesPerPage, votes.length)} of{" "}
                {votes.length} votes
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
        </div>
      </div>
    </>
  );
}

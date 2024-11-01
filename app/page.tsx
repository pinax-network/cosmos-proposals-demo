"use client";
import { useEffect, useState } from "react";
import type { ProposalsResponse } from "./api/proposals/route";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Move these to types file later
interface Proposal {
  id: number;
  title: string;
  type: string;
  status: string;
  endTime: string;
  votingPeriod: string;
  remainingTime: string;
}

interface Summary {
  total: number;
  votingPeriod: number;
  passed: number;
  rejected: number;
}

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [summary, setSummary] = useState<Summary>();
  const [loading, setLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const router = useRouter();

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>#{row.getValue("id")}</span>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="bg-[#7EE7D0]/20 text-[#7EE7D0] px-2 py-1 rounded-md text-sm">
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColor =
          {
            Passed: "text-green-400",
            Rejected: "text-red-400",
            VotingPeriod: "text-cyan-400",
          }[status] || "text-gray-400";

        return (
          <span className={`font-medium ${statusColor}`}>
            {status.replace("_", " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: ({ row }) => (
        <span className="text-[#7EE7D0]">
          {new Date(Number(row.getValue("endTime"))).toLocaleString()}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: proposals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  });

  useEffect(() => {
    async function fetchProposals() {
      try {
        const response = await fetch("/api/proposals");
        const data: ProposalsResponse = await response.json();

        if (data.proposals) {
          // Transform the data as needed
          const transformedProposals = data.proposals.map((proposal) => ({
            id: Number(proposal.id),
            title: proposal.title,
            type: proposal.messages[0].type.split(".").pop() || "",
            status: proposal.status,
            endTime: `${new Date(
              Number(proposal.voting_end_time) / 1000
            ).toLocaleString()}`,
            votingPeriod: `${new Date(
              Number(proposal.voting_start_time) / 1000
            ).toLocaleString()} - ${new Date(
              Number(proposal.voting_end_time) / 1000
            ).toLocaleString()}`,
            remainingTime: calculateRemainingTime(
              Number(proposal.voting_end_time) / 1000
            ),
          }));

          setProposals(transformedProposals);

          // Calculate summary
          const newSummary = {
            total: transformedProposals.length,
            votingPeriod: transformedProposals.filter(
              (p) => p.status === "VotingPeriod"
            ).length,
            passed: transformedProposals.filter((p) => p.status === "Passed")
              .length,
            rejected: transformedProposals.filter(
              (p) => p.status === "Rejected"
            ).length,
          };
          setSummary(newSummary);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  function calculateRemainingTime(endTime: number): string {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;

    if (remaining <= 0) return "0 Days";

    const days = Math.floor(remaining / (24 * 60 * 60));
    return `${days} Days`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] p-8 space-y-8 text-white">
      {/* Proposals Summary */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          Proposals Summary
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{summary?.total}</p>
          </div>
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Voting Period</p>
            <p className="text-2xl font-bold text-white">
              {summary?.votingPeriod}
            </p>
          </div>
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Passed</p>
            <p className="text-2xl font-bold text-white">{summary?.passed}</p>
          </div>
          <div className="bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
            <p className="text-[#7EE7D0] text-sm">Rejected</p>
            <p className="text-2xl font-bold text-white">{summary?.rejected}</p>
          </div>
        </div>
      </div>

      {/* Live Proposals */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">
            Live Proposals{" "}
            <span className="text-[#7EE7D0]">{summary?.votingPeriod}</span>
          </h2>
          <button
            className="text-[#7EE7D0] hover:text-white transition-colors"
            type="button"
          >
            Show All Proposals
          </button>
        </div>

        <div>
          {(() => {
            const liveProposals = proposals.filter(
              (proposal) =>
                proposal.status === "VotingPeriod" ||
                proposal.status === "DepositPeriod"
            );

            const [currentPage, setCurrentPage] = useState(0);
            const proposalsPerPage = 2;
            const pageCount = Math.ceil(
              liveProposals.length / proposalsPerPage
            );

            const displayedProposals = liveProposals.slice(
              currentPage * proposalsPerPage,
              (currentPage + 1) * proposalsPerPage
            );

            return (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {displayedProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-[#1C2128]/50 p-4 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-[#1C2128]/70 transition-colors"
                      onClick={() => router.push(`/proposal/${proposal.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(`/proposal/${proposal.id}`);
                        }
                      }}
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
                          <span className="text-gray-200">Voting Period:</span>{" "}
                          <span className="text-[#7EE7D0]">
                            {proposal.votingPeriod}
                          </span>
                        </p>
                        <div className="w-full h-2 bg-[#1C2128] rounded-full mt-2">
                          <div className="w-3/4 h-full bg-gradient-to-r from-[#7EE7D0] to-[#FF9B9B] rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {pageCount > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: pageCount }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index
                            ? "bg-[#7EE7D0] text-[#1C2128]"
                            : "bg-[#1C2128]/50 text-[#7EE7D0] hover:bg-[#1C2128]/70"
                        }`}
                        type="button"
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* All Proposals */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-200">All Proposals</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Filter proposals..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="px-4 py-2 bg-[#1C2128]/50 border border-[#1C2128] rounded-md text-white placeholder-[#7EE7D0]/50 focus:outline-none focus:border-[#7EE7D0]"
            />
          </div>
        </div>

        <div className="rounded-md border border-[#1C2128]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-[#7EE7D0]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-[#1C2128] hover:bg-[#1C2128]/30 cursor-pointer"
                    onClick={() =>
                      router.push(`/proposal/${row.getValue("id")}`)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-[#1C2128] bg-[#0D1117] text-[#7EE7D0] hover:bg-[#1C2128]/30 hover:text-[#7EE7D0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-[#1C2128] bg-[#0D1117] text-[#7EE7D0] hover:bg-[#1C2128]/30 hover:text-[#7EE7D0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

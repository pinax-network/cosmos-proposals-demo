"use client";
import { useEffect, useState } from "react";
import type { ProposalsResponse } from "../api/proposals/route";
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
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import * as React from "react";
import { Loading } from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFormattedNetworkName } from "../utils/stringFormatting";

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

export default function NetworkPage() {
  const params = useParams();
  const network = params.network;
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [summary, setSummary] = useState<Summary>();
  const [loading, setLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const router = useRouter();

  const uniqueTypes = React.useMemo(() => {
    return Array.from(new Set(proposals.map((p) => p.type)));
  }, [proposals]);

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
        <span className="bg-emerald-100 text-emerald-800 dark:bg-[#7EE7D0]/20 dark:text-[#7EE7D0] px-2 py-1 rounded-md text-sm">
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
            Passed: "text-green-600 dark:text-green-400",
            Rejected: "text-red-600 dark:text-red-400",
            VotingPeriod: "text-cyan-600 dark:text-cyan-400",
          }[status] || "text-gray-600 dark:text-gray-400";

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
        <span className="dark:text-[#7EE7D0]">
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
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  useEffect(() => {
    document.title = `${getFormattedNetworkName(network as string)} Proposals`;

    async function fetchProposals() {
      try {
        const response = await fetch(`/api/proposals?network=${network}`);
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
  }, [network]);

  function calculateRemainingTime(endTime: number): string {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;

    if (remaining <= 0) return "0 Days";

    const days = Math.floor(remaining / (24 * 60 * 60));
    return `${days} Days`;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white dark:from-[#0D1117] dark:via-[#161B22] dark:to-[#0D1117] text-gray-900 dark:text-white">
      <Header isClient={true} network={network as string} />
      <div className="p-8">
        {/* Proposals Summary */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              Proposals Summary
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
              <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.total}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
              <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">
                Voting Period
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.votingPeriod}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
              <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">
                Passed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.passed}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm">
              <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">
                Rejected
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary?.rejected}
              </p>
            </div>
          </div>
        </div>

        {/* Live Proposals */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              Live Proposals{" "}
              <span className="text-emerald-800 dark:text-[#7EE7D0]">
                {summary?.votingPeriod}
              </span>
            </h2>
          </div>

          <div>
            {(() => {
              const liveProposals = proposals.filter(
                (proposal) =>
                  proposal.status === "VotingPeriod" ||
                  proposal.status === "DepositPeriod"
              );

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {liveProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-white dark:bg-[#1C2128]/50 p-4 rounded-lg backdrop-blur-sm cursor-pointer 
                        hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors border border-gray-100 dark:border-[#2D333B]"
                      onClick={() =>
                        router.push(`${network}/proposal/${proposal.id}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(`${network}/proposal/${proposal.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-100 dark:bg-[#7EE7D0]/20 text-emerald-800 dark:text-[#7EE7D0] px-2 py-1 rounded-md text-sm">
                          {proposal.type}
                        </span>
                        <span className="text-emerald-800 dark:text-[#7EE7D0]">
                          Remaining Time: {proposal.remainingTime}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{proposal.id}. {proposal.title}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            Voting Period:
                          </span>{" "}
                          <span className="text-emerald-800 dark:text-[#7EE7D0]">
                            {proposal.votingPeriod}
                          </span>
                        </p>
                        <div className="w-full h-2 bg-gray-100 dark:bg-[#2D333B] rounded-full mt-2">
                          <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-rose-500 dark:from-[#7EE7D0] dark:to-[#FF9B9B] rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* All Proposals */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              All Proposals
            </h2>
            <div className="flex gap-4">
              <Select
                onValueChange={(value) =>
                  table
                    .getColumn("type")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
                defaultValue="all"
              >
                <SelectTrigger className="w-[180px] bg-white/50 dark:bg-[#1C2128]/50 border-gray-200 dark:border-[#1C2128]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Filter by title..."
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="px-4 py-2 bg-white/50 dark:bg-[#1C2128]/50 border border-gray-200 dark:border-[#1C2128] rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#7EE7D0]/50 focus:outline-none focus:border-emerald-500 dark:focus:border-[#7EE7D0]"
              />
            </div>
          </div>

          <div className="rounded-md border border-gray-200 dark:border-[#1C2128]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-100 dark:hover:bg-[#2D333B]/50 border-gray-200 dark:border-[#1C2128]">
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-emerald-800 dark:text-[#7EE7D0]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-[#1C2128] hover:bg-[#1C2128]/30 cursor-pointer"
                      onClick={() =>
                        router.push(`${network}/proposal/${row.getValue("id")}`)
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
              className="border-gray-200 bg-white text-emerald-800 hover:bg-gray-100 hover:text-emerald-900 dark:border-[#1C2128] dark:bg-[#0D1117] dark:text-[#7EE7D0] dark:hover:bg-[#1C2128]/30 dark:hover:text-[#7EE7D0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-200 bg-white text-emerald-800 hover:bg-gray-100 hover:text-emerald-900 dark:border-[#1C2128] dark:bg-[#0D1117] dark:text-[#7EE7D0] dark:hover:bg-[#1C2128]/30 dark:hover:text-[#7EE7D0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

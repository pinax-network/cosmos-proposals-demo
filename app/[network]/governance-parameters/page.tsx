'use client';

import type { GovernanceParametersResponse } from '@/app/api/governance-parameters/route';
import { Loading } from '@/components/Loading';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';

export default function GovernanceParameters() {
  const [parameters, setParameters] = useState<GovernanceParametersResponse['governanceParameters'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { network } = useParams();
  console.log(network);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch(`/api/governance-parameters?network=${network}`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setParameters(data.parameters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch parameters');
      } finally {
        setLoading(false);
      }
    };

    fetchParameters();
  }, [network]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!parameters || parameters.length === 0) return <div>No data available</div>;

  const mostRecent = parameters[0];

  const convertNanoSecondsToDays = (nanoseconds: string): string => {
    const days = Number(nanoseconds) / (24 * 60 * 60 * 1_000_000_000);
    return `${days} day${days === 1 ? '' : 's'}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white dark:from-[#0D1117] dark:via-[#161B22] dark:to-[#0D1117] text-gray-900 dark:text-white">
      <Header isClient={true} network={network as string} />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
            Governance Parameters
          </h2>

          {/* Deposit Parameters Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-[#7EE7D0] mb-4">
              Deposit Parameters
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Min Deposit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mostRecent.deposit_params.min_deposit.join(', ')}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Min Deposit (expedited)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mostRecent.deposit_params.expedited_min_deposit.join(', ')}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Max Deposit Period</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {convertNanoSecondsToDays(mostRecent.deposit_params.max_deposit_period)}
                </p>
              </div>
            </div>
          </div>

          {/* Voting Parameters Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-[#7EE7D0] mb-4">
              Voting Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Voting Period</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {convertNanoSecondsToDays(mostRecent.voting_params.voting_period)}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Voting Period (expedited)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {convertNanoSecondsToDays(mostRecent.voting_params.expedited_voting_period)}
                </p>
              </div>
            </div>
          </div>

          {/* Tally Parameters Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-[#7EE7D0] mb-4">
              Tally Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Quorum</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mostRecent.tally_params.quorum}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Threshold</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mostRecent.tally_params.threshold}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Veto Threshold</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mostRecent.tally_params.veto_threshold}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">Expedited Threshold</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mostRecent.tally_params.expedited_threshold}
                </p>
              </div>
            </div>
          </div>

          {/* Block Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-[#7EE7D0] mb-4">
              Block Info
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/50 dark:bg-[#1C2128]/50 p-4 rounded-md backdrop-blur-sm border border-gray-100 dark:border-[#2D333B] hover:bg-gray-50 dark:hover:bg-[#1C2128]/70 transition-colors">
                <p className="text-emerald-800 dark:text-[#7EE7D0] text-sm">In effect since</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date(Number(mostRecent.block.timestamp)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Block #{mostRecent.block.number}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
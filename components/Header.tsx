import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Header({
  isClient,
  network,
}: {
  isClient: boolean;
  network?: string;
}) {
  return (
    <header className="border-b border-gray-200 dark:border-[#1C2128] bg-white/50 dark:bg-[#1C2128]/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Main title and description */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <div>
                  <a
                    href="/"
                    className="text-lg font-medium hover:text-emerald-600 dark:hover:text-[#7EE7D0]"
                  >
                    Cosmos Proposals
                  </a>
                  <a
                    href="https://pinax.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-[#7EE7D0]"
                  >
                    by Pinax Network
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <span>Track and explore chain governance</span>
                <span>•</span>
                <a
                  href="https://github.com/pinax-network/cosmos-proposals-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-[#7EE7D0]"
                >
                  Source code
                </a>
              </div>
            </div>

            {/* Chain selector */}
            {isClient && (
              <Select
                defaultValue={network || "select-network"}
                onValueChange={(value) => {
                  window.location.href = `/${value}`;
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center space-x-2">
                    <SelectValue placeholder="Select network" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="select-network"
                    disabled={network !== null}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Select Network</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="injective">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/logos/injective.png"
                        alt="Injective"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>Injective</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cosmos-hub">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/logos/cosmos-hub.svg"
                        alt="Cosmos Hub"
                        width={20}
                        height={20}
                        className="rounded-full dark:invert"
                      />
                      <span>Cosmos Hub</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="osmosis">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/logos/osmosis.png"
                        alt="Osmosis"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>Osmosis</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* About link */}
            <a
              href="/about"
              className="text-sm text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-[#7EE7D0]"
            >
              About
            </a>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

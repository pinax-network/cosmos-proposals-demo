import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-[#1C2128] bg-white/50 dark:bg-[#1C2128]/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Main title and description */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="text-lg font-medium">Cosmos Proposals</span>
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
            <div className="relative">
              <button
                disabled
                className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-[#7EE7D0]/10 text-emerald-600 dark:text-[#7EE7D0] cursor-not-allowed opacity-80"
                type="button"
              >
                <Image
                  src="/logos/injective-logo.png"
                  alt="Injective"
                  width={20}
                  height={20}
                />
                <span>Injective</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Network status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Network Online
              </span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

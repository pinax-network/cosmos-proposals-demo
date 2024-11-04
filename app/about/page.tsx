import { Header } from "@/components/Header";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header isClient={false} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          About This Demo
        </h1>

        <div className="prose prose-lg dark:prose-invert">
          <p>
            This website serves as a demonstration of the capabilities offered
            by the{" "}
            <a
              href="https://github.com/pinax-network/subgraph-cosmos-proposals"
              className="no-underline text-emerald-600 hover:text-[#7EE7D0] dark:text-emerald-400 dark:hover:text-[#7EE7D0] transition-colors"
            >
              <code className="bg-gray-100 dark:bg-gray-800 px-1">
                subgraph-cosmos-proposals
              </code>
            </a>{" "}
            repository being developed by Pinax.
          </p>

          <p>
            The subgraph enables efficient querying and indexing of Cosmos
            blockchain proposal data, making it easier for developers and users
            to access and analyze governance information across the Cosmos
            ecosystem.
          </p>

          <p>
            Through this demo, you can explore how the subgraph can be
            integrated into web applications to create user-friendly interfaces
            for viewing and interacting with Cosmos governance data.
          </p>
        </div>
      </div>
    </main>
  );
}

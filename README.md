# Cosmos Proposals Demo

This website serves as a demonstration of the capabilities offered by the [subgraph-cosmos-proposals](https://github.com/pinax-network/subgraph-cosmos-proposals/) repository being developed by Pinax.

The subgraph enables efficient querying and indexing of Cosmos blockchain proposal data, making it easier for developers and users to access and analyze governance information across the Cosmos ecosystem.

Through this demo, you can explore how the subgraph can be integrated into web applications to create user-friendly interfaces for viewing and interacting with Cosmos governance data.

## Setup

### Prerequisites

- Node.js
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/cosmos-proposals-demo.git
cd cosmos-proposals-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:

Create a `.env` file in the root directory with the following content:
```bash
THE_GRAPH_API_KEY=your_api_key_here
```

To obtain The Graph API key:
1. Visit [The Graph Studio](https://thegraph.com/studio/)
2. Create an account or sign in
3. Navigate to your dashboard
4. Generate a new API key

### Development

Start the local development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is already in use).

### Production Build

To create a production build:
```bash
npm run build
# or
yarn build
```

To preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

# 🏗 Lancy Parcel

Lancy Parcel – Secure, Transparent, and Immutable Parcel Tracking System, that helps e-commerce logistics companies securely track parcels

## Verified Contract Address

Scroll Sepolia:

```
0x1dE55945e2c86F766613D55784b73F3dDCb2901B
```

## Link to Scrollscan

https://sepolia.scrollscan.com/address/0x1dE55945e2c86F766613D55784b73F3dDCb2901B

## The Problem Lancy Parcel Solves

Lancy Parcel addresses major challenges in the logistics industry by ensuring secure, transparent and verifiable parcel tracking.

-   Stolen or Missing Parcels: Every parcel’s journey is immutably recorded on the blockchain, preventing lost or stolen items from going unnoticed.
-   Fake Signature Fraud: With cryptographic digital signatures, only verified employees and recipients can sign for parcels, eliminating unauthorized deliveries.
-   Proof of Recipient & Seller Accountability: If a dispute arises (e.g., fake products or unreceived items), tamper-proof records provide legal proof, ensuring fraudulent sellers are held accountable.
-   Mishandling & Damaged Parcels: Parcel conditions can be tracked at each hub and responsible employees are directly linked to each handover, reducing careless handling.

Lancy Parcel ensures that every transaction is secure, every signature is verified, and every parcel is delivered with accountability.

## Technologies We Used

Solidity, Scaffold-ETH, NextJS, Foundry, Scroll

## Requirements

Before you begin, you need to install the following tools:

-   [Node (>= v20.18.3)](https://nodejs.org/en/download/)
-   Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
-   [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Foundry. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/foundry/foundry.toml`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/foundry/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/foundry/script` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn foundry:test`

-   Edit your smart contracts in `packages/foundry/contracts`
-   Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
-   Edit your deployment scripts in `packages/foundry/script`

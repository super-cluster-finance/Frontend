# SuperCluster Documentation

## Table of Contents

1. [What is SuperCluster](#what-is-supercluster)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Wallet Connection](#wallet-connection)
5. [Application Flow](#application-flow)
6. [Development Setup](#development-setup)

---

## What is SuperCluster

SuperCluster is a decentralized liquid stablecoin savings protocol built on . The application allows users to:

- Deposit USDC stablecoins and receive yield-bearing sUSDC tokens
- Wrap sUSDC into wsUSDC for DeFi composability
- Request and claim withdrawals with time-lock mechanism
- Select different yield optimization strategies (Pilots)
- Get test tokens from faucet for testing

---

## Technology Stack

### Frontend

- Next.js 15.5.9 with App Router
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4

### Authentication & Web3

- Privy 3.8.1 (Google OAuth + Embedded Wallets)
- Wagmi 2.17.5 (Ethereum interactions)
- Web3Modal 5.1.11 (WalletConnect)
- Viem (Ethereum client library)

### Network

- (EVM-compatible L2)

### UI Components

- Radix UI (Accordion, Dropdown, Select, etc.)
- Framer Motion 12.23.24
- GSAP 3.13.0
- React Three Fiber (3D graphics)

### State Management

- TanStack React Query 5.90.2
- Custom React Hooks

---

## Folder Structure

```
├── public/                          # Static assets
│   ├── manifest.json
│   └── icons/
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   │
│   │   ├── (landing)/               # Landing page group
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   └── app/                     # Main application group
│   │       ├── layout.tsx           # App layout with providers
│   │       ├── deposit/             # Deposit USDC page
│   │       ├── faucet/              # Test token faucet
│   │       ├── pilot/               # Pilot selection
│   │       ├── withdraw/            # Withdrawal pages
│   │       │   ├── request/
│   │       │   ├── claim/
│   │       │   └── hooks/
│   │       └── wrap/                # Token wrapping pages
│   │           ├── page.tsx         # Wrap sUSDC to wsUSDC
│   │           └── unwrap/
│   │
│   ├── components/                  # React components
│   │   ├── app/                     # App-specific components
│   │   │   ├── Navbar.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   ├── Deposit/
│   │   │   ├── Withdrawals/
│   │   │   └── Wrap/
│   │   ├── landing/                 # Landing page components
│   │   ├── shared/                  # Shared components
│   │   └── ui/                      # Base UI components
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useStaking.ts            # Deposit logic
│   │   ├── useWrapping.ts           # Wrap/unwrap logic
│   │   ├── useTokenBalance.ts       # Balance queries
│   │   └── withdrawRequest.ts
│   │
│   ├── services/                    # External services
│   │   ├── auth/
│   │   │   └── PrivyClientProvider.tsx    # Privy authentication
│   │   └── web3/
│   │       ├── contracts/
│   │       │   ├── addresses.ts           # Contract addresses
│   │       │   └── abis/                  # Contract ABIs
│   │       ├── utils/
│   │       └── wagmi/
│   │           ├── config.ts              # Wagmi configuration
│   │           └── provider.tsx
│   │
│   └── types/                       # TypeScript types
│
├── package.json
├── next.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Wallet Connection

SuperCluster supports two methods of wallet connection:

### 1. Privy (Google Authentication)

Privy provides embedded wallets using Google OAuth. This is the primary authentication method.

**Setup Location:** `src/services/auth/PrivyClientProvider.tsx`

```typescript
<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
  config={{
    loginMethods: ["google"],
    embeddedWallets: {
      ethereum: {
        createOnLogin: "users-without-wallets",
      },
    },
    defaultChain: chainConfig,
    appearance: { theme: "dark" },
  }}
>
  {children}
</PrivyProvider>
```

**How it works:**

1. User clicks "Connect with Google"
2. User authenticates with Google OAuth
3. Privy automatically creates an embedded Ethereum wallet
4. Wallet is linked to user's Google account

**Login Button:** `src/components/app/LoginButton.tsx`

```typescript
const { login, authenticated } = usePrivy();

if (authenticated) return null;

return <button onClick={() => login()}>Connect with Google</button>;
```

### 2. External Wallets

Users can also connect with external wallets (MetaMask, WalletConnect, Coinbase Wallet).

**Configuration:** `src/services/web3/wagmi/config.ts`

```typescript
export const config = createConfig({
  chains: [defaultChain],
  connectors: [
    injected(), // MetaMask, etc.
    walletConnect({ projectId }), // WalletConnect
    coinbaseWallet({ appName: "SuperCluster" }),
  ],
  transports: {
    [defaultChain.id]: http(),
  },
});
```

### Wallet Detection Pattern

All pages use this pattern to detect which wallet type is connected:

```typescript
const { ready, authenticated } = usePrivy();
const { wallets } = useWallets();
const { address: wagmiAddress, chainId: wagmiChainId } = useAccount();

// Get Privy embedded wallet
const embeddedWallet = wallets.find(
  (wallet) => wallet.walletClientType === "privy"
);

// Use Privy wallet if available, otherwise use external wallet
const address = embeddedWallet?.address || wagmiAddress;
const chainId = embeddedWallet
  ? parseInt(embeddedWallet.chainId.replace("eip155:", ""))
  : wagmiChainId;

const isConnected = ready && (authenticated || !!wagmiAddress);
```

---

## Application Flow

### Overall Architecture

```
┌─────────────────────────────────────────────────┐
│              Root Layout (layout.tsx)           │
│  - Fonts, metadata, global styles              │
└──────────────┬──────────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌────────────┐    ┌─────────────────────────┐
│  Landing   │    │  App Layout             │
│  (public)  │    │  - WagmiProvider        │
│            │    │  - PrivyProvider        │
└────────────┘    │                         │
                  └────────┬────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │   App Pages    │
                  └────────────────┘
```

### Provider Hierarchy

Location: `src/app/app/layout.tsx`

```typescript
<WagmiProviderComp>
  {" "}
  // Level 1: Web3 connection
  <PrivyClientProvider>
    {" "}
    // Level 2: Authentication
    <AppNavbar />
    <main>{children}</main>
    <Footer />
  </PrivyClientProvider>
</WagmiProviderComp>
```

### User Journey

**Step 1: Landing Page**

- User arrives at root path `/`
- Views features and information
- Clicks "Launch App" button

**Step 2: Authentication**

- User connects wallet (Google or external)
- For Google: OAuth flow creates embedded wallet
- For external: Standard wallet connection

**Step 3: Get Test Tokens**

- Navigate to `/app/faucet`
- Click "Request Tokens"
- Receive 1000 test USDC

**Step 4: Select Pilot (Optional)**

- Navigate to `/app/pilot`
- Browse available pilots
- Select yield optimization strategy
- Selection saved in localStorage

**Step 5: Deposit**

- Navigate to `/app/deposit`
- Enter USDC amount
- Approve USDC spending (Transaction 1)
- Deposit to SuperCluster (Transaction 2)
- Receive sUSDC tokens

**Step 6: Wrap (Optional)**

- Navigate to `/app/wrap`
- Enter sUSDC amount
- Approve sUSDC spending (Transaction 1)
- Wrap to wsUSDC (Transaction 2)
- Receive wsUSDC tokens

**Step 7: Unwrap (If needed)**

- Navigate to `/app/wrap/unwrap`
- Enter wsUSDC amount
- Unwrap to sUSDC (Transaction 1)
- Receive sUSDC tokens

**Step 8: Request Withdrawal**

- Navigate to `/app/withdraw/request`
- Enter sUSDC amount
- Submit withdrawal request (Transaction)
- Request enters pending state

**Step 9: Claim Withdrawal**

- Navigate to `/app/withdraw/claim`
- Wait for request to be finalized
- Wait for time-lock to expire
- Click "Claim" on ready request
- Receive USDC back

### Transaction Signing

The app handles two wallet types differently:

**Privy Embedded Wallet:**

```typescript
const walletClient = await embeddedWallet.getEthereumProvider();
const txHash = await walletClient.request({
  method: "eth_sendTransaction",
  params: [
    {
      from: userAddress,
      to: contractAddress,
      data: encodedData,
    },
  ],
});
```

**External Wallet (Wagmi):**

```typescript
const txHash = await writeContractAsync({
  address: contractAddress,
  abi: contractABI,
  functionName: "functionName",
  args: [arg1, arg2],
});
```

### Smart Contract Interactions

**Contract Addresses:** `src/services/web3/contracts/addresses.ts`

```typescript
export const CONTRACTS = {
  superCluster: process.env.NEXT_PUBLIC_SUPERCLUSTER_ADDRESS,
  pilot: process.env.NEXT_PUBLIC_PILOT_ADDRESS,
  mockUSDC: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS,
  faucet: process.env.NEXT_PUBLIC_FAUCET_ADDRESS,
  withdrawManager: process.env.NEXT_PUBLIC_WITHDRAW_MANAGER_ADDRESS,
  sToken: process.env.NEXT_PUBLIC_STOKEN_ADDRESS,
  wsToken: process.env.NEXT_PUBLIC_WSTOKEN_ADDRESS,
};
```

**Main Contracts:**

1. **SuperCluster** - Main protocol contract

   - deposit(pilot, token, amount)
   - withdraw(pilot, token, amount)

2. **MockUSDC** - Test USDC token

   - approve(spender, amount)
   - transfer(to, amount)

3. **SToken** - Yield-bearing token (sUSDC)

   - balanceOf(account)
   - approve(spender, amount)

4. **WsToken** - Wrapped token (wsUSDC)

   - wrap(amount)
   - unwrap(amount)

5. **WithdrawManager** - Withdrawal requests

   - getRequestsOf(user)
   - claim(requestId)

6. **Faucet** - Test token distribution
   - requestTokens()

### Custom Hooks

**useStaking** (`src/hooks/useStaking.ts`)

- Handles USDC deposits
- Manages approve and deposit transactions
- Returns: `{ stake, isSubmitting, error, txHash }`

**useWrapping** (`src/hooks/useWrapping.ts`)

- Handles wrap/unwrap operations
- Manages approve and wrap transactions
- Returns: `{ wrap, unwrap, isSubmitting, error }`

**useTokenBalance** (`src/hooks/useTokenBalance.ts`)

- Queries token balances
- Auto-refreshes every 10 seconds
- Returns: `{ balance, formatted, refetch }`

**useWithdrawRequests** (`src/app/app/withdraw/hooks/withdrawRequest.ts`)

- Fetches all withdrawal requests
- Calculates status and progress
- Returns: `{ requests, fetchRequests, readyToClaimCount }`

**useWithdrawActions** (`src/app/app/withdraw/hooks/ActionWithdraw.ts`)

- Handles withdrawal request and claim
- Returns: `{ requestWithdraw, claimWithdraw, isSubmitting }`

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env.local` file:

```env
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# WalletConnect
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id

# Chai Name Information
NEXT_PUBLIC_NETWORK_NAME=

# Contract Addresses
NEXT_PUBLIC_SUPERCLUSTER_ADDRESS=
NEXT_PUBLIC_PILOT_ADDRESS=
NEXT_PUBLIC_MOCK_USDC_ADDRESS=
NEXT_PUBLIC_FAUCET_ADDRESS=
NEXT_PUBLIC_WITHDRAW_MANAGER_ADDRESS=
NEXT_PUBLIC_STOKEN_ADDRESS=
NEXT_PUBLIC_WSTOKEN_ADDRESS=
```

### 3. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run start
```

### Network Configuration

The app uses dynamic network configuration from environment variables.

**File:** `src/services/web3/wagmi/config.ts`

```typescript
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "");
const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "";
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
const blockExplorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "";

export const defaultChain = {
  id: chainId,
  name: chainName,
  nativeCurrency: { name: "", symbol: "", decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: blockExplorerName,
      url: blockExplorerUrl,
    },
  },
  testnet: true,
};
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Common Patterns

### Page Component Pattern

```typescript
"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

export default function MyPage() {
  // 1. Wallet detection
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress } = useAccount();

  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  const address = embeddedWallet?.address || wagmiAddress;
  const isConnected = ready && (authenticated || !!wagmiAddress);

  // 2. State
  const [amount, setAmount] = useState("");

  // 3. Custom hooks
  const { balance } = useTokenBalance(address);

  // 4. Handlers
  const handleSubmit = async () => {
    // Logic here
  };

  // 5. Render
  return (
    <div>{!isConnected ? <LoginButton /> : <div>Balance: {balance}</div>}</div>
  );
}
```

### Custom Hook Pattern

```typescript
import { useState, useCallback } from "react";
import { usePublicClient, useWriteContract } from "wagmi";

export function useMyAction(address, chainId, embeddedWallet) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const execute = useCallback(async (params) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let txHash;
      if (embeddedWallet) {
        // Privy transaction
      } else {
        // Wagmi transaction
        txHash = await writeContractAsync({...});
      }

      await publicClient?.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [address, chainId]);

  return { execute, isSubmitting, error };
}
```

**Version:** 0.1.0  
**Network:**  
**Last Updated:** January 1, 2026

# Walletron – Unified Wallet Infrastructure

**Walletron** is an AI-powered wallet engine built for developers. It simplifies the process of managing multi-chain wallets through unified APIs, natural language controls, and a developer-first dashboard.

> Currently supports **Ethereum** and **Solana**, with a focus on **scalability**, **security**, and **usability**.

---

## Features

- **Unified API**  
  A single API for all Ethereum and Solana operations.

- **HD Wallet Generation**  
  Securely generate Hierarchical Deterministic (HD) wallets for each user.

- **Natural Language Interface**  
  Parse and execute wallet actions using simple, human-readable commands.

- **Developer Dashboard**  
  Real-time wallet status and transaction logs to monitor activity.

- **API Key System**  
  A robust system for secure developer integration.

- **Modern UI**  
  A clean, dark-themed user interface with Walletron branding.

- **Per-User Isolation**  
  Secure backend operations with isolated wallets for each user.

---

## Tech Stack

| Layer          | Tech Used                            |
| -------------- | ------------------------------------ |
| Frontend       | Next.js 14, Tailwind CSS             |
| Backend        | Hono, TypeScript                     |
| Blockchain     | Ethers.js (Ethereum), Solana Web3.js |
| Database       | PostgreSQL with Prisma ORM           |
| Authentication | NextAuth.js (Credentials)            |
| Deployment     | Vercel                               |

---

## Folder Structure

```

/src
├─ app/ # Route pages (Landing, Dashboard, Auth, etc.)
├─ components/ # Reusable UI components
│ ├─ layout/ # Navbar, Sidebar
│ ├─ dashboard/ # Wallet cards, stats, transaction lists
├─ lib/ # Solana + Ethereum logic, NLP parser, and utils
├─ prisma/ # Prisma schema and client
├─ generated/ # Generated Prisma client
/public # Static assets (icons, logos)

```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/walletron.git
cd walletron
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/walletron
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the Development Server

```bash
npm run dev
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| POST   | `/api/auth/signup`    | User registration                  |
| POST   | `/api/auth/login`     | User login                         |
| GET    | `/api/wallet/balance` | Get user wallet balances           |
| POST   | `/api/wallet/send`    | Send crypto (ETH/SOL)              |
| POST   | `/api/wallet/nl`      | Execute a natural language command |

---

## Natural Language Control

Walletron supports AI-based wallet operations via structured natural language processing (NLP). The system parses your request, validates its intent, and executes it securely.

### Example Queries

- `Send 0.5 SOL to john@solana.com`
- `What's my ETH balance?`
- `Show my recent transactions`

---

## Deployment

This application is designed to be deployed on **Vercel**.

You can also self-host using:

- **Docker**
- **Node.js + PostgreSQL stack**
- Platforms like **Railway** or **Render**

---

## Roadmap

- Add Polygon and BSC support
- Implement OAuth login (Google, GitHub)
- Add real-time WebSocket updates
- Introduce multi-wallet switching
- Add rate limiting and audit logging
- Enable AI prompt tuning via context memory

---

## 📄 License

This project is licensed under the **MIT License**.

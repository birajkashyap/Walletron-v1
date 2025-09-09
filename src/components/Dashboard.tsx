"use client";
import { motion } from "framer-motion";

type ThemeToggleProps = {
  theme: "light" | "dark"; // your theme type
};

const Dashboard = ({ theme }: ThemeToggleProps) => {
  const isDark = theme === "dark";
  const cardClasses = `rounded-2xl p-6 ${isDark ? "bg-gray-900" : "bg-white"}`;
  const totalBalanceCardClasses = `rounded-2xl p-6 ${
    isDark ? "bg-blue-600" : "bg-blue-500"
  } text-white flex flex-col items-start space-y-2`;
  const tokenCardClasses = `rounded-2xl p-6 ${
    isDark ? "bg-gray-800" : "bg-gray-200"
  }`;

  // Define Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col items-center text-center space-y-2"
        variants={itemVariants}
      >
        <h1 className="text-3xl md:text-4xl font-bold">Developer Dashboard</h1>
        <p
          className={`text-base md:text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Manage, monitor and control all your blockchain wallets in one place
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {/* Sidebar */}
        <motion.div
          className={`col-span-1 rounded-2xl p-4 space-y-2 ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
          variants={itemVariants}
        >
          <h2 className="text-lg font-bold">Wallets</h2>
          <button
            className={`w-full text-left p-3 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            Main Wallet
          </button>
          <button
            className={`w-full text-left p-3 rounded-xl hover:bg-gray-700 transition-colors ${
              isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Dev Wallet
          </button>
          <button
            className={`w-full text-left p-3 rounded-xl hover:bg-gray-700 transition-colors ${
              isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            + Connect New Wallet
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="col-span-3 space-y-6">
          {/* Tabs */}
          <motion.div
            className="flex space-x-4 border-b pb-2"
            variants={itemVariants}
          >
            <button
              className={`font-bold pb-2 border-b-2 ${
                isDark ? "border-blue-500" : "border-blue-600"
              }`}
            >
              Overview
            </button>
            <button
              className={`pb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Transactions
            </button>
            <button
              className={`pb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              API Keys
            </button>
          </motion.div>

          {/* Balance Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            <div className={totalBalanceCardClasses}>
              <span className="text-sm font-semibold">Total Balance</span>
              <span className="text-3xl font-bold">$5,240.82</span>
              <span className="text-xs">+2.5% from last week</span>
            </div>
            <div className={tokenCardClasses}>
              <span
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Solana
              </span>
              <span
                className={`block text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                45.2 SOL
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                $3,240.50 @ $71.69
              </span>
            </div>
            <div className={tokenCardClasses}>
              <span
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Ethereum
              </span>
              <span
                className={`block text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                0.75 ETH
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                $2,000.32 @ $2,667.09
              </span>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div className={cardClasses} variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Recent Transactions</h2>
              <a href="#" className="text-sm text-blue-500">
                View All →
              </a>
            </div>
            <motion.ul className="space-y-4" variants={containerVariants}>
              <motion.li
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM9 12h6M12 9v6" />
                    </svg>
                  </span>
                  <div>
                    <span className="block font-medium">Send</span>
                    <span
                      className={`block text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      2023-04-23
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-medium">0.5 SOL</span>
                  <span
                    className={`block text-xs ${
                      isDark ? "text-green-500" : "text-green-600"
                    }`}
                  >
                    Completed
                  </span>
                </div>
              </motion.li>
              <motion.li
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM9 12h6M12 9v6" />
                    </svg>
                  </span>
                  <div>
                    <span className="block font-medium">Receive</span>
                    <span
                      className={`block text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      2023-04-22
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-medium">200 USDC</span>
                  <span
                    className={`block text-xs ${
                      isDark ? "text-green-500" : "text-green-600"
                    }`}
                  >
                    Completed
                  </span>
                </div>
              </motion.li>
              <motion.li
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM9 12h6M12 9v6" />
                    </svg>
                  </span>
                  <div>
                    <span className="block font-medium">Swap</span>
                    <span
                      className={`block text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      2023-04-21
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-medium">2 ETH → 3400 USDC</span>
                  <span
                    className={`block text-xs ${
                      isDark ? "text-yellow-500" : "text-yellow-600"
                    }`}
                  >
                    Pending
                  </span>
                </div>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

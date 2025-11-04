"use client";
import { SiSolana, SiEthereum } from "react-icons/si";
import React, { useState } from "react";
import { motion } from "framer-motion";

// Define interfaces
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "lg" | "sm";
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

interface DeleteDialog {
  open: boolean;
  index: number;
  type: "wallet" | "all";
}

// Icon component props interface
interface IconProps {
  className?: string;
}

const ChevronDown: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ChevronUp: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);

const Copy: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const Eye: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOff: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

const Trash: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const Plus: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

// Custom UI Components
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";

  let variantClasses = "";
  if (variant === "default") {
    variantClasses =
      "bg-white text-gray-900 hover:bg-gray-200 shadow-lg hover:shadow-xl";
  } else if (variant === "outline") {
    variantClasses =
      "border border-white/20 text-white hover:bg-white/10 hover:border-white/30";
  } else if (variant === "ghost") {
    variantClasses = "text-white/70 hover:text-white hover:bg-white/5";
  } else if (variant === "destructive") {
    variantClasses = "bg-red-600 text-white hover:bg-red-700 shadow-lg";
  }

  const sizeClasses =
    size === "lg"
      ? "h-12 px-8 text-base"
      : size === "sm"
      ? "h-8 px-3"
      : "h-10 px-6";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`flex h-12 w-full rounded-lg border border-white/20 bg-gray-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
    {...props}
  />
);

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 ${className}`}
  >
    {children}
  </div>
);

// Mock toast function
const toast = {
  success: (message: string) => console.log("Success:", message),
  error: (message: string) => console.log("Error:", message),
};

// Mock crypto functions (replace with actual implementations)
const generateMnemonic = (): string => {
  const words = [
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
  ];
  return Array.from(
    { length: 12 },
    () => words[Math.floor(Math.random() * words.length)]
  ).join(" ");
};

const validateMnemonic = (mnemonic: string): boolean => {
  return Boolean(mnemonic && mnemonic.split(" ").length === 12);
};

const generateWalletFromMnemonic = (
  pathType: string,
  mnemonic: string,
  accountIndex: number
): Wallet => {
  // Mock wallet generation - replace with actual crypto logic
  const mockAddress =
    pathType === "501"
      ? "Sol" + Math.random().toString(36).substring(2, 15)
      : "0x" + Math.random().toString(36).substring(2, 15);

  return {
    publicKey: mockAddress,
    privateKey: Math.random().toString(36).substring(2, 15),
    mnemonic,
    path: `m/44'/${pathType}'/0'/${accountIndex}'`,
  };
};

const WalletGenerator: React.FC = () => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [pathTypes, setPathTypes] = useState<string[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>({
    open: false,
    index: -1,
    type: "wallet",
  });

  const pathTypeNames: Record<string, string> = {
    "501": "Solana",
    "60": "Ethereum",
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const togglePrivateKeyVisibility = (index: number): void => {
    setVisiblePrivateKeys((prev: boolean[]) =>
      prev.map((visible: boolean, i: number) =>
        i === index ? !visible : visible
      )
    );
  };

  const handleGenerateWallet = (): void => {
    const mnemonic = mnemonicInput.trim() || generateMnemonic();
    if (mnemonicInput && !validateMnemonic(mnemonic)) {
      toast.error("Invalid mnemonic phrase");
      return;
    }

    setMnemonicWords(mnemonic.split(" "));
    const wallet = generateWalletFromMnemonic(
      pathTypes[0],
      mnemonic,
      wallets.length
    );

    const updatedWallets = [...wallets, wallet];
    setWallets(updatedWallets);
    setVisiblePrivateKeys([...visiblePrivateKeys, false]);
    toast.success("Wallet generated successfully!");
  };

  const handleAddWallet = (): void => {
    if (!mnemonicWords.length) {
      toast.error("No mnemonic phrase found");
      return;
    }

    const wallet = generateWalletFromMnemonic(
      pathTypes[0],
      mnemonicWords.join(" "),
      wallets.length
    );

    const updatedWallets = [...wallets, wallet];
    setWallets(updatedWallets);
    setVisiblePrivateKeys([...visiblePrivateKeys, false]);
    toast.success("New wallet added!");
  };

  const handleDeleteWallet = (index: number): void => {
    const updatedWallets = wallets.filter(
      (_: Wallet, i: number) => i !== index
    );
    setWallets(updatedWallets);
    setVisiblePrivateKeys(
      visiblePrivateKeys.filter((_: boolean, i: number) => i !== index)
    );
    setDeleteDialog({ open: false, index: -1, type: "wallet" });
    toast.success("Wallet deleted!");
  };

  const handleClearWallets = (): void => {
    setWallets([]);
    setMnemonicWords([]);
    setPathTypes([]);
    setVisiblePrivateKeys([]);
    setDeleteDialog({ open: false, index: -1, type: "all" });
    toast.success("All wallets cleared!");
  };

  // Delete confirmation modal
  const DeleteDialog: React.FC = () => {
    if (!deleteDialog.open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 border border-white/20 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              {deleteDialog.type === "all"
                ? "Delete All Wallets?"
                : "Delete Wallet?"}
            </h3>
            <p className="text-gray-400">
              {deleteDialog.type === "all"
                ? "This will permanently delete all your wallets and cannot be undone."
                : "This wallet will be permanently deleted and cannot be recovered."}
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() =>
                  setDeleteDialog({ open: false, index: -1, type: "wallet" })
                }
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={
                  deleteDialog.type === "all"
                    ? handleClearWallets
                    : () => handleDeleteWallet(deleteDialog.index)
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Blockchain Selection */}
        {wallets.length === 0 && pathTypes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-8 py-20"
          >
            <div className="text-sm font-semibold px-4 py-2 rounded-full border backdrop-blur-sm text-white/50 bg-white/5 border-white/10">
              Multi-Chain Wallet Generator
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Create Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Crypto Wallet
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl">
              Generate secure wallets for multiple blockchains with
              industry-standard encryption and recovery phrases.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button
                size="lg"
                onClick={() => setPathTypes(["501"])}
                className="min-w-32 flex items-center justify-center"
              >
                <SiSolana className="mr-2 w-5 h-5" />
                Solana Wallet
              </Button>

              <Button
                size="lg"
                onClick={() => setPathTypes(["60"])}
                className="min-w-32 flex items-center justify-center"
              >
                <SiEthereum className="mr-2 w-5 h-5" />
                Ethereum Wallet
              </Button>
            </div>
          </motion.div>
        )}

        {/* Mnemonic Input */}
        {pathTypes.length !== 0 && wallets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto py-20"
          >
            <Card className="text-center space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  Secret Recovery Phrase
                </h1>
                <p className="text-gray-400">
                  Import an existing wallet or generate a new one. Keep your
                  recovery phrase safe and never share it.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Enter your 12-word recovery phrase (optional)"
                  type="password"
                  value={mnemonicInput}
                  onChange={(e) => setMnemonicInput(e.target.value)}
                  className="text-center"
                />
                <Button
                  size="lg"
                  onClick={handleGenerateWallet}
                  className="w-full"
                >
                  {mnemonicInput ? "Import Wallet" : "Generate New Wallet"}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Mnemonic Display */}
        {mnemonicWords.length > 0 && wallets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
              <div
                className="flex justify-between items-center"
                onClick={() => setShowMnemonic(!showMnemonic)}
              >
                <div>
                  <h2 className="text-2xl font-bold">Your Recovery Phrase</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Click to reveal • Keep this safe and private
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  {showMnemonic ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>

              {showMnemonic && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {mnemonicWords.map((word, i) => (
                      <div
                        key={i}
                        className="bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg text-center text-sm font-mono border border-white/10"
                      >
                        <span className="text-gray-400 text-xs">{i + 1}</span>
                        <div className="font-medium">{word}</div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(mnemonicWords.join(" "))}
                    className="w-full"
                  >
                    <Copy className="mr-2" />
                    Copy Recovery Phrase
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Wallet List */}
        {wallets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">
                  {pathTypeNames[pathTypes[0]]} Wallets
                </h2>
                <p className="text-gray-400 mt-1">
                  {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}{" "}
                  generated
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddWallet} variant="outline">
                  <Plus className="mr-2" />
                  Add Wallet
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    setDeleteDialog({ open: true, index: -1, type: "all" })
                  }
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wallets.map((wallet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="space-y-4 hover:bg-gray-800/50 transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Wallet {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteDialog({ open: true, index, type: "wallet" })
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Public Address
                        </label>
                        <div
                          className="bg-gray-700/50 rounded-lg p-3 font-mono text-sm break-all cursor-pointer hover:bg-gray-700/70 transition-colors"
                          onClick={() => copyToClipboard(wallet.publicKey)}
                        >
                          {wallet.publicKey}
                          <Copy className="inline ml-2 w-3 h-3 opacity-50" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Private Key
                        </label>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className="flex-1 bg-gray-700/50 rounded-lg p-3 font-mono text-sm cursor-pointer hover:bg-gray-700/70 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                            onClick={() => copyToClipboard(wallet.privateKey)}
                          >
                            {visiblePrivateKeys[index]
                              ? wallet.privateKey
                              : "•".repeat(32)}
                            <Copy className="inline ml-2 w-3 h-3 opacity-50" />
                          </div>
                          <div className="shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePrivateKeyVisibility(index)}
                            >
                              {visiblePrivateKeys[index] ? <EyeOff /> : <Eye />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 font-mono">
                        Derivation: {wallet.path}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <DeleteDialog />
    </div>
  );
};

export default WalletGenerator;

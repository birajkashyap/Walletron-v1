-- CreateTable
CREATE TABLE "public"."TxLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "hash" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TxLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NLIntent" (
    "id" TEXT NOT NULL,
    "userInput" TEXT NOT NULL,
    "parsed" JSONB NOT NULL,
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NLIntent_pkey" PRIMARY KEY ("id")
);

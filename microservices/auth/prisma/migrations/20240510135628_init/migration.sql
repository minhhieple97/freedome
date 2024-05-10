-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePublicId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "emailVerificationToken" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "browserName" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpiration" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_profilePublicId_key" ON "Auth"("profilePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_emailVerificationToken_key" ON "Auth"("emailVerificationToken");

-- CreateIndex
CREATE INDEX "Auth_email_idx" ON "Auth"("email");

-- CreateIndex
CREATE INDEX "Auth_username_idx" ON "Auth"("username");

-- CreateIndex
CREATE INDEX "Auth_emailVerificationToken_idx" ON "Auth"("emailVerificationToken");

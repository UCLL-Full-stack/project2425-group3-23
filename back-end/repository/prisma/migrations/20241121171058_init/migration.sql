-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "senderUsername" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUsername_fkey" FOREIGN KEY ("senderUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

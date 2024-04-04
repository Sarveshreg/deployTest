-- CreateEnum
CREATE TYPE "CategoriesEnum" AS ENUM ('ARTS', 'SCIENCE', 'SPORTS', 'TRAVEL', 'FOOD', 'MUSICS', 'RELIGIOUS', 'POLITICAL');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "ZipCode" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Street" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "ZipCode" INTEGER NOT NULL,
    "Details" TEXT NOT NULL,
    "MaximumAttendies" INTEGER NOT NULL,
    "Picture" TEXT,
    "EventCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "EventUpdated" TIMESTAMP(3) NOT NULL,
    "CreatorId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RSVP" (
    "userID" TEXT NOT NULL,
    "eventID" TEXT NOT NULL,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("userID","eventID")
);

-- CreateTable
CREATE TABLE "Category" (
    "Event_id" TEXT NOT NULL,
    "Category" "CategoriesEnum" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("Event_id","Category")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "Event_id" TEXT NOT NULL,
    "User_id" TEXT NOT NULL,
    "Comment" TEXT NOT NULL,
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_Event_id_key" ON "Category"("Event_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_CreatorId_fkey" FOREIGN KEY ("CreatorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

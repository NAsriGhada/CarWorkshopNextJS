-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "aoNumber" TEXT,
    "customerName" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "customerComplaint" TEXT,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "engine" TEXT,
    "vehicleApiSource" TEXT,
    "vehicleApiRawData" JSONB,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdByUserId" TEXT,
    "dateIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOut" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "operationNumber" INTEGER NOT NULL,
    "operationCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "technicianId" TEXT,
    "customerMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "techCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartUsage" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "PartUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLog" (
    "id" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_aoNumber_key" ON "WorkOrder"("aoNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Technician_techCode_key" ON "Technician"("techCode");

-- CreateIndex
CREATE UNIQUE INDEX "Part_code_key" ON "Part"("code");

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartUsage" ADD CONSTRAINT "PartUsage_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartUsage" ADD CONSTRAINT "PartUsage_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

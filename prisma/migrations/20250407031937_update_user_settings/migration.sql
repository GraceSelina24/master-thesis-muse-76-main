/*
  Warnings:

  - You are about to drop the column `measurementSystem` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `UserSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "measurementSystem",
DROP COLUMN "notifications",
ADD COLUMN     "apiKeys" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "appVersion" TEXT NOT NULL DEFAULT '1.0.0',
ADD COLUMN     "autoSync" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "backupFrequency" TEXT NOT NULL DEFAULT 'weekly',
ADD COLUMN     "billingAddress" JSONB,
ADD COLUMN     "calorieUnit" TEXT NOT NULL DEFAULT 'kcal',
ADD COLUMN     "colorBlindMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "connectedApps" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "cookiePreferences" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "dataSharing" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "debugMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "developerMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "distanceUnit" TEXT NOT NULL DEFAULT 'km',
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fontSize" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "goalNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "heightUnit" TEXT NOT NULL DEFAULT 'cm',
ADD COLUMN     "highContrastMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastBackup" TIMESTAMP(3),
ADD COLUMN     "lastFeedbackDate" TIMESTAMP(3),
ADD COLUMN     "mealReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "progressUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reminderTime" TEXT NOT NULL DEFAULT '08:00',
ADD COLUMN     "screenReaderMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "syncFrequency" TEXT NOT NULL DEFAULT 'daily',
ADD COLUMN     "textToSpeech" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weightUnit" TEXT NOT NULL DEFAULT 'kg',
ADD COLUMN     "workoutReminders" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

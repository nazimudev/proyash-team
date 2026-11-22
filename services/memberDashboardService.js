import { isMock } from "../lib/member/config";
import { memberApi } from "../lib/member/apiClient";
import { mockDb, simulateLatency } from "../data/memberMockData";
import {
  buildMonthlyChart,
  deriveContributionRecords,
  findUpcomingDue,
  summarizeContributions,
} from "../lib/member/contributionCalc";

// INTEGRATE: real call is already wired; verify the response matches the contract above.
export async function getMemberDashboard() {
  if (!isMock) return memberApi.get("/member/dashboard");
  await simulateLatency();
  const records = deriveContributionRecords(
    mockDb.contributions,
    mockDb.payments,
  );
  return {
    summary: summarizeContributions(records),
    monthlyChart: buildMonthlyChart(records),
    recentPayments: mockDb.payments.slice(0, 5),
    upcomingDue: findUpcomingDue(records),
  };
}

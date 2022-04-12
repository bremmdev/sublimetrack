import { db } from "~/utils/db.server.ts";

export const getBudgetsForUser = async (userId) => {
  const budgets =
    await db.budget.findMany({
      where: {
        userId
      },
      orderBy: { startDate: "desc" },
    })

  return budgets;
};

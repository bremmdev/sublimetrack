import { db } from "~/utils/db.server";

export const getCurrentBudgetForUser = async (userId) => {
  const currDate = new Date()
  const budgets = await db.budget.findMany({
    where: {
      userId
    }
  });
  const currBudget = budgets.find(
    (budget) =>
      currDate >= new Date(budget.startDate) && (currDate < (new Date(budget.endDate || '9999-01-01')))
  );

  return currBudget
}


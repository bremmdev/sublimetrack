import { db } from "~/utils/db.server";

export const getExpenses = async (filter) => {
  const expenses = await db.expense.findMany({
    where: filter,
    orderBy: { date: "desc" },
    include: {
      category: true
    }
  }) || []
  return expenses
}


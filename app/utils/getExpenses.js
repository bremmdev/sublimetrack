import { db } from "~/utils/db.server";

export const getExpenses = async (filter) => {
  return await db.expense.findMany({
    where: filter,
    orderBy: { date: "desc" },
    include: {
      category: true
    }
  })
}


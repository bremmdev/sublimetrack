import { db } from "~/utils/db.server";

export const getExpenses = async (userId, startDate) => {

  let filter = {
    userId,
    date: {
      gte: startDate
    }
  }

  let count = await db.expense.count({
      where: filter
  })
  
  const expenses = await db.expense.findMany({
      where: filter,
      orderBy: { date: "desc" },
      include: {
        category: true,
      }
    });
  
  return { expenses, count }
}


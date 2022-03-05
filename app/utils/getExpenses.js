import { db } from "~/utils/db.server";

export const getExpenses = async (userId, query = null, startDate) => {

  let filter = {
    userId,
    date: {
      gte: startDate
    },
    title: query ? {
      search: query + ':*'
    } : {}
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


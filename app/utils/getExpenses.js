import { db } from "~/utils/db.server";

export const getExpenses = async (id, query = null) => {

  let filter = {
    userId: id,
    title: query ? {
      search: query + ':*'
    } : {}
  }
   const expenses = await db.expense.findMany({
      where: filter,
      orderBy: { date: "desc" },
      include: {
        category: true,
      },
    });
  
  return expenses
}


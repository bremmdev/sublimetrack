import { db } from "~/utils/db.server";

export const getExpenses = async (id, query = null, page) => {

  let filter = {
    userId: id,
    title: query ? {
      search: query + ':*'
    } : {}
  }

  let count

  if(page === 1){
    count = await db.expense.count({
      where: { userId: id }
    })
  }
  console.log(query)

  const expenses = await db.expense.findMany({
      where: filter,
      orderBy: { date: "desc" },
      include: {
        category: true,
      },
    });
  
  return { expenses, count }
}


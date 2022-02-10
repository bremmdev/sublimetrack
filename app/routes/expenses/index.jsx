import { useLoaderData } from "remix"
import { db } from "~/utils/db.server";
import expenseStyles from '~/styles/expenses.css'

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }];


export const loader = async ({ request })  => {

  const user = await db.user.findUnique({
    where:{
      id: '70e0cff2-7589-4de8-9f2f-4e372a5a15f3'
    },
    include: {
      budgets: true
    }
  })

  console.log(user)

  const expenses = await db.expense.findMany({
      where: {
        userId: user.id
      },
      orderBy: { date: "desc" },
      include: {
        category: true
      }
    })

     const data ={user, expenses}
    
  return data;
};


const Expenses = () => {

  const { user, expenses } = useLoaderData()
  const currDate = new Date().toLocaleDateString('en-US', {  year: 'numeric', month: 'long', day: 'numeric' })
  console.log(currDate)
  console.log(expenses)
  return (
    
    <div>
      <h2>Hi, <span className="accent">{user.firstName}!</span></h2>
      <p className="date-message my-1">Today is <span className="accent">{currDate}</span></p>
      



      {
          expenses && (
            <>
            <h3>Latest expenses</h3>  
            <div className="expenses-list">
              <ul>{expenses.map(expense => <li key={expense.id}>{new Date(expense.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit'})}</li>)}</ul>
              
            </div>
</>
          )


      }
     


      
    </div>
  )
}

export default Expenses
import { useLoaderData, Link } from "remix"
import { db } from "~/utils/db.server";
import expenseStyles from '~/styles/expenses.css'
import overviewStyles from '~/styles/overview.css'
import progressBarStyles from '~/styles/progressBar.css'
import ProgressBar from "~/components/overview/progressBar.jsx";
import DoughnutChart from "~/components/overview/DoughnutChart.jsx";

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }, { href: overviewStyles, rel: "stylesheet" }, { href: progressBarStyles, rel: "stylesheet" }];

const colors = {
  utilities: '#FF5555',
  recreation: '#00FF95',
  insurance: 'skyblue',
  food: '#EEE'
}


export const loader = async ({ request })  => {

  const currDate = new Date()
  const startOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1)
  const endOfMonth = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);


  const user = await db.user.findUnique({
    where:{
      id: '70e0cff2-7589-4de8-9f2f-4e372a5a15f3'
    },
    include: {
      budgets: true
    }
      
  })


  console.log(user)

 console.log(endOfMonth)

  const expenses = await db.expense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      orderBy: { date: "desc" },
      include: {
        category: true
      }, 
    
    })

     const data ={user, expenses, startOfMonth}
    
  return data;
};




export default function Home() {
  const { user, expenses, startOfMonth } = useLoaderData();

  //get budget of the current month
  const currBudget = user?.budgets?.find(
    (budget) =>
      new Date(budget.startDate).toLocaleDateString() ===
      new Date(startOfMonth).toLocaleDateString()
  );

  //calculate expenses and balance
  const budgetAmount = +currBudget.amount || 0;
  const expenseAmount =
    Math.abs(expenses?.reduce((prev, exp) => prev + +exp.amount, 0)) || 0;
  const balanceAmount = budgetAmount - expenseAmount;

  const currDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="grid">
      <div className="welcome span-two">
        <h2>
          Hi, <span className="accent">{user.firstName}!</span>
        </h2>
        <p className="date-message">
          Today is <span className="accent">{currDate}</span>
        </p>
      </div>
      <div className="summary-card">
        <div className="summary-card-balance">
          <h3>Balance</h3>
          <span className="accent large-text">${balanceAmount.toFixed(2)}</span>
        </div>
        <div className="summary-card-budget">
          <h3>Budget</h3>
          <span className="accent large-text">${budgetAmount.toFixed(2)}</span>
        </div>
        <div className="summary-card-expenses">
          <h3>Expenses</h3>
          <span className="accent large-text">${expenseAmount.toFixed(2)}</span>
        </div>
      </div>

      <ProgressBar expense={expenseAmount} budget={budgetAmount} />

      <div className="expenses-list">
        <h3>Latest expenses</h3>
        {expenses.length === 0 && <p className="my-1">There are no expenses this month.</p>}
        {expenses && expenses.length !== 0 && (
          <>
            <ul>
              {expenses.slice(0, 5).map((expense) => (
                <li key={expense.id}>
                  <span
                    className="category-indicator"
                    style={{
                      backgroundColor: colors[expense.category.name],
                    }}
                  ></span>
                  <div className="expense-date">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </div>

                  <div className="expense-title-cat">
                    <div className="expense-title">{expense.title}</div>
                    <div className="expense-category">
                      {expense.category.name}
                    </div>
                  </div>
                  <div className="expense-amount">
                    {Number(expense.amount).toFixed(2)}{" "}
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/expenses" className="btn-primary btn align-right">
              All Expenses
            </Link>
          </>
        )}
      </div>

      <div className="expenses-chart">
        {expenses && expenses.length !== 0 && (
          <>
            <h3 className="hidden-mobile">Expenses per category</h3>
            <DoughnutChart
              expenses={expenses.slice(0, 5)}
              colors={colors}
            />
          </>
        )}
      </div>
    </div>
  );
}

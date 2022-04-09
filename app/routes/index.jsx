import { useLoaderData, Link, useTransition, Meta } from "remix"
import expenseStyles from '~/styles/expenses.css'
import overviewStyles from '~/styles/overview.css'
import progressBarStyles from '~/styles/progressBar.css'
import ProgressBar from "~/components/overview/progressBar.jsx";
import DoughnutChart from "~/components/overview/DoughnutChart.jsx";
import { getUser } from "~/utils/getUser.js";
import { getExpenses } from "~/utils/getExpenses.js";
import { getCurrentBudgetForUser } from "~/utils/getCurrentBudgetForUser.js";

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }, { href: overviewStyles, rel: "stylesheet" }, { href: progressBarStyles, rel: "stylesheet" }];

export const meta = () => ({
  title: "Sublimetrack - Overview"
});

export const loader = async ({ request })  => {
  const currDate = new Date()
  const startOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1)
  const endOfMonth = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
 
  const user = await getUser('70e0cff2-7589-4de8-9f2f-4e372a5a15f3')
 
  const filter = { 
      userId: user.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }

    const expenses = await getExpenses(filter)
    const currentBudget = await getCurrentBudgetForUser(user.id)
    const data = { user, expenses,currentBudget }
    
    return data;
};


export default function Home() {
  const { user, expenses, currentBudget } = useLoaderData();
  const transition = useTransition()

  //calculate expenses and balance
  const budgetAmount = +currentBudget?.amount || 0;
  const expenseAmount = expenses?.reduce((prev, exp) => prev + Math.abs(+exp.amount), 0) || 0;
  const balanceAmount = budgetAmount - expenseAmount;

  const currDateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if(transition.state === 'loading') {
    return  <div className="spinner spinner-large"></div>
  }

  return (
    <div className="grid">
      <div className="welcome span-two">
        <h2>
          Hi, <span className="accent">{user.firstName}!</span>
        </h2>
        <p className="date-message">
          Today is <span className="accent">{currDateStr}</span>
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
                      backgroundColor: expense.category.color,
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
                    {Number(expense.amount).toFixed(2)}
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
            <DoughnutChart
              expenses={expenses}
            />
          </>
        )}
      </div>
    </div>
  );
}

import { useLoaderData, useTransition, Meta } from 'remix'
import { db } from "~/utils/db.server";
import BarChart from '~/components/insights/BarChart'
import DoughnutChart from '~/components/overview/DoughnutChart.jsx';
import insightStyles from "~/styles/insights.css";

export const meta = () => ({
  title: "Sublimetrack - Insights"
});

export const links = () => [{ href: insightStyles, rel: 'stylesheet'}];


export const loader = async () => {

  const user = await db.user.findUnique({
    where:{
      id: '70e0cff2-7589-4de8-9f2f-4e372a5a15f3'
    },
  })

  const expenses = await db.expense.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { date: "desc" },
      include: {
        category: true
      }, 
    })

    const data ={user, expenses}

  return data
}




const Insights = () => {
  const transition = useTransition();
  const { expenses } = useLoaderData();

  const expenseAmount =
    expenses?.reduce((prev, exp) => prev + Math.abs(+exp.amount), 0) || 0;
  const highestExpense =
    +expenses?.sort((a, b) => b.amount - a.amount)[0].amount || 0;

  if (transition.state === "loading") {
    return <div className="spinner spinner-large"></div>;
  }

  return (
    <>
      <h2>Insights</h2>
      <div className="grid">
        <div className="stats-container span-two">
          <div className="stat-card">
            <div className="stat-title">Number of expenses</div>
            <div>{expenses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total expenses</div>
            <div>{`$${expenseAmount.toFixed(2)}`}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Highest expense</div>
            <div>{`$${highestExpense.toFixed(2)}`}</div>
          </div>
        </div>
        <div className="expenses-chart">
          {expenses && expenses.length !== 0 && (
            <>
              <BarChart expenses={expenses} />
            </>
          )}
        </div>
        <div className="expenses-chart-donut">
          {expenses && expenses.length !== 0 && (
            <>
              <DoughnutChart expenses={expenses} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Insights
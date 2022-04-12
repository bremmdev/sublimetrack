import { useLoaderData, useTransition, Form } from 'remix'
import { useRef } from 'react'
import BarChart from '~/components/insights/BarChart'
import DoughnutChart from '~/components/overview/DoughnutChart.jsx';
import insightStyles from "~/styles/insights.css";
import { getUser } from '~/utils/getUser.js';
import { getExpenses } from '~/utils/getExpenses.js';

export const meta = () => ({
  title: "Sublimetrack - Insights"
});

export const links = () => [{ href: insightStyles, rel: 'stylesheet'}];

const validateYear = (year) => {
  return Number.isInteger(+year) && year.length === 4
}

export const loader = async ( { request }) => {
  const url = new URL(request.url);
  const year = new URLSearchParams(url.search).get("year");

  //get year from URL or take current year
  const selectedYear = year && validateYear(year) ? +year : new Date().getFullYear()

  const user = await getUser('70e0cff2-7589-4de8-9f2f-4e372a5a15f3')
  if(!user) {
    throw new Response("User not found", { status: 404})
  }

  //get expenses for current year
  let filter = {
    userId: user.id,
    date: {
      gte: new Date(selectedYear, 0, 1),
      lt: new Date(selectedYear+1, 0, 1)
    }
  }

  const expenses = await getExpenses(filter)
  if (!expenses) {
    throw new Response("Loading expenses failed", { status: 404 });
  }

  const data = { user, expenses, selectedYear }
  return data
}

const Insights = () => {
  const transition = useTransition();
  const { expenses, selectedYear } = useLoaderData();
  const yearSelectionRef = useRef();
  const yearInputRef = useRef();

  const expenseAmount =
    expenses?.reduce((prev, exp) => prev + Math.abs(+exp.amount), 0) || 0;

  const highestExpense =
    +expenses?.sort((a, b) => b.amount - a.amount)[0]?.amount || 0;

  if (transition.state === "loading") {
    return <div className="spinner spinner-large"></div>;
  }

  const changeSelectedYear = (e, currYear) => {
    let targetYear =
      e.target.className === "year-selector-prev" ? currYear - 1 : currYear + 1;
      
      //prevent overflow
      if(targetYear > 9999 || targetYear < 1000) {
        targetYear = new Date().getFullYear()
      }
      yearInputRef.current.value = targetYear;
  };

  return (
    <>
      <div className="insights-header">
        <h2>Insights</h2>
        <Form method="GET" ref={yearSelectionRef}>
          <button disabled={transition.state === 'submitting'} onClick={(e) => changeSelectedYear(e, selectedYear)} className="year-selector-prev">{`<`}</button>
          <input
            name="year"
            id="year"
            className="year-selector"
            readOnly
            ref={yearInputRef}
            type="text"
            defaultValue={selectedYear}
          ></input>
          <button disabled={transition.state === 'submitting'} onClick={(e) => changeSelectedYear(e, selectedYear)} className="year-selector-next">{`>`}</button>
        </Form>
      </div>

      <div className="grid">
        <div className="stats-container span-two">
          <div className="stat-card">
            <div className="stat-title">Number of expenses</div>
            <div>{expenses?.length || 0}</div>
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
        <div className="expenses-chart hide-graph-mobile">
          {expenses && expenses.length !== 0 && (
            <>
              <BarChart expenses={expenses} />
            </>
          )}
        </div>
        <div className="expenses-chart-donut hide-graph-mobile">
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
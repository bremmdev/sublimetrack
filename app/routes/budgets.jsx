import { useLoaderData, useTransition, Link, Outlet, Meta, useCatch } from "remix"
import { getUser } from "~/utils/getUser.js"
import { db } from "~/utils/db.server";
import budgetStyles from "~/styles/budgets.css";

import BudgetItem from "~/components/budgets/BudgetItem";
import { getCurrentBudgetForUser } from '~/utils/getCurrentBudgetForUser'
import { getBudgetsForUser } from '~/utils/getBudgetsForUser'

export const links = () => [{ href: budgetStyles, rel: "stylesheet" }];

export const meta = () => ({
  title: "Sublimetrack - Budgets"
});

export const loader = async ({ request }) => {
  const user = await getUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")
  if(!user) {
    throw new Response("User not found", { status: 404})
  }

  const budgets = await getBudgetsForUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")
  if(!budgets){
    throw new Response("Loading budgets failed", { status: 404})
  }

  const data = { user, budgets }
  return data
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "delete") {
    const budgetId = formData.get("budget_id");
    try {
      //delete budget
      const deletedBudget = await db.budget.delete({
        where: {
          id: budgetId,
        },
      });

      if (!deletedBudget) {
        throw new Error("Budget not found");
      }

      //get the last budget and remove the endDate to make it the current budget
      const currentBudget = await getCurrentBudgetForUser(
        "70e0cff2-7589-4de8-9f2f-4e372a5a15f3"
      );

      const updatedCurrentBudget = await db.budget.update({
        where: {
          id: currentBudget.id,
        },
        data: {
          endDate: null,
        },
      });
    } catch (e) {
      //this error property will be available on fetcher.data in budgetItem
      return { error: true };
    }
    return {};
  }
  return null;
};

const Budgets = () => {
  const data = useLoaderData();
  const budgets = data?.budgets;
  const transition = useTransition();

  if (transition.state === "loading") {
    return <div className="spinner spinner-large"></div>;
  }

  return (
    <div className="budgets-list container-constrained-center">
      <div className="budgets-list-header">
        <h2>Budgets</h2>
        <Link to="/budgets/new" className="btn-primary btn">
          Add Budget
        </Link>
      </div>

      {/*outlet for new budget form*/}
      <Outlet />

      <ul>
        {budgets.map((budget) => (
          <BudgetItem key={budget.id} budget={budget}></BudgetItem>
        ))}
      </ul>
    </div>
  );
};

export default Budgets


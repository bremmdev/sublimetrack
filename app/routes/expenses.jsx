import { useLoaderData, Form, Link, Outlet, useSearchParams, useLocation, useTransition, Meta} from "remix";
import { db } from "~/utils/db.server";
import expenseStyles from "~/styles/expenses.css";
import formStyles from "~/styles/forms.css";
import { getUser } from "~/utils/getUser";
import { getExpenses } from "~/utils/getExpenses";
import { useEffect, useRef, useState } from "react";
import ExpenseItem from "~/components/expenses/ExpenseItem";
import Fuse from "fuse.js";

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }, { href: formStyles, rel: 'stylesheet'}];

export const meta = () => ({
  title: "Sublimetrack - Expenses"
});

export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const from = new URLSearchParams(url.search).get("from");

  //if there is no from OR if from is empty set startDate to null
  const startDate = from ? new Date(from) : null

  //get today's date and the date 30 days ago
  const today = new Date();
  const today_minus_30 = new Date(new Date().setDate(today.getDate() - 30));

  //get data
  const categories = await db.category.findMany();
  const user = await getUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3");

  if(!user) {
    throw new Response("User not found", { status: 404})
  }
  
  const filter = {
    userId: user.id,
    date: {
      gte: startDate || today_minus_30
    }
  }

  //get expenses for specific user
  const expenses = await getExpenses(filter)

  if (!expenses) {
    throw new Response("Loading expenses failed", { status: 404 });
  }

  const data = { user, expenses, categories };
  return data;
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "delete") {
    const expenseId = formData.get("expense_id");
    try {
      const deletedExpense = await db.expense.delete({
        where: {
          id: expenseId,
        },
      });

      if (!deletedExpense) {
        throw new Error("Expense not found");
      }
    } catch (e) {
      //this error property will be available on fetcher.data in expenseItem
      return { error: true };
    }

    return {};
  }

  return null;
};

const Expenses = () => {
  const data = useLoaderData();

  const [params] = useSearchParams();
  const [expenses, setExpenses] = useState([]);

  const location = useLocation();
  const searchInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const filterInputRef = useRef(null);
  const dateSubmitRef = useRef(null);
  const transition = useTransition();

  //fuse instance for client-side search
  const fuse = new Fuse(expenses, {
    keys: ["title"],
    options: {
      threshold: 0.1,
      shouldSort: false,
      minMatchCharLength: 2,
      findAllMatches: true,
    },
  });

  const clearInputFields = () => {
    searchInputRef.current.value = "";
    filterInputRef.current.value = "";
  };

  useEffect(() => {
    //clear search input when we add an expense
    if (location.pathname === "/expenses/new") {
      clearInputFields();
      setExpenses(data.expenses);
    }
  }, [location]);

  useEffect(() => {
    clearInputFields();
    setExpenses(data.expenses);
  }, [data.expenses]);

  const activateSearch = (e) => {
    if (!e.target.value) {
      filterInputRef.current.value = "";
      //'reset' state to all fetched expenses
      setExpenses(data.expenses);
    } else {
      //run fuse to filter state based on search query
      setExpenses(fuse.search(e.target.value).map((item) => item.item));
    }
  };

  const submitDateSelect = () => {
      dateSubmitRef.current.click();
  };

  const filterByCategory = (e) => {
    const categoryId = e.target.value;
    if (e.target.value) {
      setExpenses(data.expenses.filter((exp) => exp.categoryId === categoryId));
    } else {
      //'reset' state to all fetched expenses
      clearInputFields()
      setExpenses(data.expenses);
    }
  };

  if (transition.state === "loading" || transition.state === "submitting") {
    return <div className="spinner spinner-large"></div>;
  }

  return (
    <div className="expenses-list container-constrained-center">
      <div className="expenses-list-header">
        <div className="expenses-list-header-inner">
          <h2>Expenses</h2>
          <Link to="/expenses/new" className="btn-primary btn">
            Add Expense
          </Link>
        </div>

        <div className="expenses-list-header-inner filter-controls">
          <Form method="GET">
            <label htmlFor="from" className="datepicker-label">
              <span
                className="hidden-mobile"
                hidden={location.pathname === "/expenses/new"}
              >
                From date:
              </span>
              <input
                className="datepicker"
                id="from"
                ref={dateInputRef}
                type="date"
                name="from"
                placeholder="From date"
                onChange={submitDateSelect}
                disabled={location.pathname === "/expenses/new"}
                defaultValue={params.get("from") || ""}
              />
            </label>
            <button
              type="submit"
              ref={dateSubmitRef}
              className="btn-invisible"
            ></button>
          </Form>

          <select
            className="filter-category"
            onChange={filterByCategory}
            ref={filterInputRef}
            disabled={location.pathname === "/expenses/new"}
          >
            <option value="" style={{ color: "#666", fontWeight: "700" }}>
              Select category
            </option>
            {data.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="query"
            className="search-field"
            placeholder="Search..."
            ref={searchInputRef}
            disabled={location.pathname === "/expenses/new"}
            onChange={activateSearch}
          />
        </div>
      </div>

      {/*Add expense form outlet*/ }
      <Outlet />

      {expenses && expenses.length === 0 && (
        <p className="my-1">There are no expenses.</p>
      )}
      {expenses.length !== 0 && (
        <div>
          <ul>
            {expenses.map((expense) => (
              <ExpenseItem expense={expense} key={expense.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Expenses;

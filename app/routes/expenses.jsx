import { useLoaderData, Form, Link, Outlet, useSearchParams, useLocation, useTransition, useSubmit} from "remix";
import { db } from "~/utils/db.server";
import expenseStyles from "~/styles/expenses.css";
import { getUser } from "~/utils/getUser";
import { getExpenses } from "~/utils/getExpenses";
import { useEffect, useRef, useState } from "react";
import ExpenseItem from "~/components/expenses/ExpenseItem";

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }];

export const meta = () => ({
  title: "Sublimetrack - Expenses"
});

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const from = new URLSearchParams(url.search).get("from");
  const cat = new URLSearchParams(url.search).get("cat");

  //if there is no from OR if from is empty set startDate to null
  const startDate = from ? new Date(from) : null

  //get today's date and the date 30 days ago
  const today = new Date();
  const today_minus_30 = new Date(new Date().setDate(today.getDate() - 30));

  //get data
  const user = await getUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3");
  if(!user) {
    throw new Response("User not found", { status: 404})
  }
  
  const categories = await db.category.findMany();
  if(!categories) {
    throw new Response("Categories not found", { status: 404})
  }

  const selectedCat = categories.find(category => category.name === cat)
 
  const filter = {
    userId: user.id,
    categoryId: selectedCat?.id || undefined,
    date: {
      gte: startDate || today_minus_30
    }
  }

  //get expenses for specific user
  const expenses = await getExpenses(filter)

  if (!expenses) {
    throw new Response("Loading expenses failed", { status: 404 });
  }

  const data = { user, expenses, categories, today_minus_30 };
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
  const { user, expenses, categories, today_minus_30 } = useLoaderData();
  const submit = useSubmit()

  const [params] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('')

  const location = useLocation();
  const searchInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const filterInputRef = useRef(null);
  const transition = useTransition();

  const clearInputFields = () => {
    dateInputRef.current.value = "";
    filterInputRef.current.value = "";
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const searchFilter = (expenses, searchTerm) => {
    if(searchTerm === '') return expenses
    return expenses.filter(exp => exp.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  useEffect(() => {
    //clear filter inputs when we add an expense
    if (location.pathname === "/expenses/new") {
      clearInputFields();
      setSearchTerm('')
    }
  }, [location]);

  const handleFormChange = (e) => {
    submit(e.currentTarget, { replace: true });
  }

  if (transition.state === "loading") {
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
          <Form method="GET" onChange={handleFormChange}>
            <div className="form-inner-container">
              <label htmlFor="from" className="datepicker-label">
                <input
                  className="datepicker"
                  id="from"
                  ref={dateInputRef}
                  type="date"
                  name="from"
                  disabled={location.pathname === "/expenses/new"}
                  defaultValue={params.get("from") || new Date(today_minus_30).toISOString().split('T')[0]}
                />
              </label>

              <select
                className="filter-category"
                id="cat"
                name="cat"
                ref={filterInputRef}
                disabled={location.pathname === "/expenses/new"}
                defaultValue={params.get("cat") || ""}
              >
                <option value="" style={{ color: "#666", fontWeight: "700" }}>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn-invisible"
              ></button>
            </div>
          </Form>

          <input
            type="text"
            name="query"
            className="search-field"
            placeholder="Search..."
            ref={searchInputRef}
            value={searchTerm}
            disabled={location.pathname === "/expenses/new"}
            onChange={handleChange}
          />
        </div>
      </div>

      {/*Add expense form outlet*/}
      <Outlet />

      {expenses && expenses.length === 0 && (
        <p className="my-1">There are no expenses.</p>
      )}
      {expenses.length !== 0 && (
        <div>
          <ul>
            {searchFilter(expenses, searchTerm).map((expense) => (
              <ExpenseItem expense={expense} key={expense.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Expenses;

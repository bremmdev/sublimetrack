import { useLoaderData, Form, redirect, Link, Outlet, useSearchParams, useLocation} from "remix"
import { db } from "~/utils/db.server";
import expenseStyles from '~/styles/expenses.css'
import { FiTrash2 } from 'react-icons/fi'
import { getUser } from '~/utils/getUser'
import { getExpenses} from '~/utils/getExpenses'
import { useEffect, useRef } from 'react'

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }];

export const loader = async ({ request })  => {
  const url = new URL(request.url);
  const query = new URLSearchParams(url.search).get("query");

  const user = await getUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")

  const expenses = await getExpenses(user.id, query)

  const data = { user, expenses };

  return data;
};

export const action = async ({request, params}) => {
  const form = await request.formData()
  if(form.get('_method') === 'delete'){
    const deletedExpense = await db.expense.delete({
      where: {
        id: form.get('expense_id')
      }
    })

    if(!deletedExpense) { throw new Error ("Expense not found") }
    return redirect('/expenses')
  }
}



const Expenses = () => {

  const [params] = useSearchParams()
  const location = useLocation()
  const searchInputRef = useRef(null)
  const searchSubmitRef = useRef(null)
  const { user, expenses } = useLoaderData();

  useEffect(() => {
    //clear search input when we add an expense
    if(location.pathname === '/expenses/new') {
      searchInputRef.current.value = ''
    }
  }, [location])

  const activateSearch = () => {
    searchSubmitRef.current.click()
  }

  return (
    <div className="expenses-list container-constrained-center">
      <div className="expenses-list-header">
        <h2>All expenses</h2>
        <div>
          <Form className="form-search" method="GET">
            <input
              type="text"
              name="query"
              className="search-field"
              placeholder="Search..."
              defaultValue={params.get('query') || ''}
              ref={searchInputRef}
              onChange={activateSearch}
            />
            <button type="submit" ref={searchSubmitRef} className="btn-invisible"></button>
          </Form>

          <Link to="/expenses/new" className="btn-primary btn">
            Add Expense
          </Link>
        </div>
      </div>
      <Outlet />

      {expenses && expenses.length === 0 && (
        <p className="my-1">There are no expenses.</p>
      )}
      {expenses.length !== 0 && (
        <>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
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
                <Form method="POST">
                  <input type="hidden" name="_method" value="delete" />
                  <input type="hidden" name="expense_id" value={expense.id} />
                  <button type="submit" className="btn-invisible">
                    <FiTrash2 className="delete-exp-icon" />
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Expenses
import { useLoaderData, Form, redirect, Link, Outlet, useSearchParams, useLocation, useFetcher, useTransition} from "remix"
import { db } from "~/utils/db.server";
import expenseStyles from '~/styles/expenses.css'
import { getUser } from '~/utils/getUser'
import { getExpenses} from '~/utils/getExpenses'
import { useEffect, useRef, useState, useCallback } from 'react'
import  ExpenseItem  from '~/components/expenses/ExpenseItem'

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }];

export const loader = async ({ request })  => {
  const url = new URL(request.url);
  const query = new URLSearchParams(url.search).get("query");
  const page = new URLSearchParams(url.search).get("page");

  const user = await getUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")
  console.log('qqqqqqqq')
  //get expenses for specific user, get page 1
  const { expenses, count } = await getExpenses(user.id, query, page || 1)

  const data = { user, expenses, count };

  return data;
};

export const action = async ({request, params}) => {
  const formData = await request.formData()
  console.log(formData)
  const _action = formData.get('_action')
  const expenseId = formData.get('expense_id')

  if(_action === 'delete'){
    const deletedExpense = await db.expense.delete({
      where: {
        id: expenseId
    }
  })

    if(!deletedExpense) { throw new Error ("Expense not found") }
    return {}
  }

 
  return null
}



const Expenses = () => {

  const [page, setPage] = useState(1)
  const [params] = useSearchParams()
  const location = useLocation()
  const searchInputRef = useRef(null)
  const searchSubmitRef = useRef(null)
  const fetcher = useFetcher()
  const transition = useTransition()

  const { user, expenses, count } = useLoaderData();

  console.log(transition.state)

  
  const [expenseCount, setExpenseCount] = useState(null)

   useEffect(() => {
      setExpenseCount(count)
   }, [])

  useEffect(() => {
    //clear search input when we add an expense
    if(location.pathname === '/expenses/new') {
      searchInputRef.current.value = ''
    }
  }, [location])

  const activateSearch = () => {
    searchSubmitRef.current.click()
  }

  if(transition.state === 'loading') {
    return  <div className="spinner spinner-large"></div>
  }

  return (
    <div className="expenses-list container-constrained-center">
      <div className="expenses-list-header">
        <h2>All expenses{expenseCount}</h2>
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
        <div>
          <ul>
            {expenses.map((expense) => (
             <ExpenseItem expense={expense} key={expense.id} />
            ))}
          </ul>
          <fetcher.Form method="get" action="/expenses">
      <button type="submit" className="btn btn-primary">Load More</button>
    </fetcher.Form>
        </div>
      )}
     
    </div>
  );
};

export default Expenses
import { useLoaderData, Form, redirect, Link, Outlet, useSearchParams, useLocation, useFetcher, useTransition, useActionData} from "remix"
import { db } from "~/utils/db.server";
import expenseStyles from '~/styles/expenses.css'
import { getUser } from '~/utils/getUser'
import { getExpenses} from '~/utils/getExpenses'
import { useEffect, useRef, useState, useCallback } from 'react'
import  ExpenseItem  from '~/components/expenses/ExpenseItem'
import Fuse from 'fuse.js'

export const links = () => [{ href: expenseStyles, rel: "stylesheet" }];

export const loader = async ({ request, params })  => {
  const url = new URL(request.url);
  const query = new URLSearchParams(url.search).get("query");
  const startDate = new Date(new URLSearchParams(url.search).get("from"));

  const today = new Date() 
  const today_minus_30 = new Date(new Date().setDate(today.getDate() - 30));

  const user = await getUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")
  console.log(query, startDate)
  //get expenses for specific user
  const { expenses, count } = await getExpenses(user.id, query, startDate || today_minus_30 )

  const data = { user, expenses, count };

  return data;
};

export const action = async ({request, params}) => {
  
  const formData = await request.formData()
  const _action = formData.get('_action')
  
  if (_action === "delete") {
    const expenseId = formData.get('expense_id')
    try{
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
      return { error: true }
    }

    return {}
  }
 

  return null
}

const Expenses = () => {

  const data = useLoaderData();
  const [params] = useSearchParams()
 
  const [expenses, setExpenses] = useState([])

  const location = useLocation()
  const searchInputRef = useRef(null)
  const searchSubmitRef = useRef(null)
  const dateInputRef = useRef(null)
  const dateSubmitRef = useRef(null)
  const transition = useTransition()

  const fuse = new Fuse(expenses, {
    keys: ['title'],
    options: {
      threshold: 0.1,
      shouldSort: false,
      minMatchCharLength: 2,
      findAllMatches: true
    }
  })


  useEffect(() => {
    //clear search input when we add an expense
    if(location.pathname === '/expenses/new') {
      searchInputRef.current.value = ''
    }
  }, [location])

  const activateSearch = (e) => {
    if(!e.target.value){
      setExpenses(data.expenses)
    }
    else{
      setExpenses(fuse.search(e.target.value).map(item => item.item))
    }
   
  }

  useEffect(() => {
    setExpenses(data.expenses)
    searchInputRef.current.value = ''
  }, [data.expenses])

  const submitDateSelect = () => {
    if(dateInputRef.current.value){
      dateSubmitRef.current.click()
    }
  }

  if(transition.state === 'loading' || transition.state === 'submitting') {
    return  <div className="spinner spinner-large"></div>
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

        <div className="expenses-list-header-inner">
          <Form method="GET">
            <label htmlFor="from" className="datepicker-label"><span className="hidden-mobile">From date:</span><input className="datepicker" id="from" ref={dateInputRef} type="date" name="from" onChange={submitDateSelect} defaultValue={params.get("from") || ""} /></label>
            <button type="submit" ref={dateSubmitRef} className="btn-invisible"></button>
          </Form>
         
            <input
              type="text"
              name="query"
              className="search-field"
              placeholder="Search..."
              ref={searchInputRef}
              onChange={activateSearch}
            />
         
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
        </div>
      )}
    </div>
  );
};

export default Expenses
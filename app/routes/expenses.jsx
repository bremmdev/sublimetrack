import { useLoaderData, Form, redirect, Link, Outlet } from "remix"
import { db } from "~/utils/db.server";
import expenseStyles from '~/styles/expenses.css'
import { FiTrash2 } from 'react-icons/fi'


export const links = () => [{ href: expenseStyles, rel: "stylesheet" }];

export const loader = async ({ request })  => {
  const url = new URL(request.url);
  const query = new URLSearchParams(url.search).get("query");
  console.log(query);

  const user = await db.user.findUnique({
    where: {
      id: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3",
    },
  });

  let expenses

  if (query) {
    expenses = await db.expense.findMany({
      where: {
        userId: user.id,
        title: {
          search: query + ':*',
        },
      },
      orderBy: { date: "desc" },
      include: {
        category: true,
      },
    });
  } else {
    expenses = await db.expense.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { date: "desc" },
      include: {
        category: true,
      },
    });
  }

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

  const { user, expenses } = useLoaderData()


 
  return (
    <div className="expenses-list container-constrained-center">
      <div className="expenses-list-header">
        <h2>All expenses</h2>
        <div>
        <Form className="form-search" method="GET"> <input type="text" name="query" className="search-field" placeholder="Search..."/></Form>
       
     
        
          <Link to="/expenses/new" className="btn-primary btn">
            Add Expense
          </Link>
        </div>
      </div>
      <Outlet/>

      {expenses && expenses.length === 0 && <p className="my-1">There are no expenses.</p>}
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
}

export default Expenses
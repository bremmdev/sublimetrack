import { Form, Link, redirect, json, useLoaderData, useActionData, useTransition } from 'remix'
import { db } from '~/utils/db.server.js'

export const loader = async () => {
    const categories = await db.category.findMany()
    return { categories }
}

const validateForm = (title, amount, date) => {
  const validations = {
    titleError: typeof title !== 'string' || title.length < 3 ? 'Title should be at least 3 characters' : null,
    amountError: typeof amount !== 'number' || amount > 999999.99 || amount < -999999.99 ? 'Amount must be less than 1 million' : null,
    dateError: !date && 'Please fill in the date'
  }
  return validations
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const title = formData.get('title')
  const amount = Math.abs(+formData.get('amount'))
  const date = formData.get('date')
  //this gets the categoryId based on the category chosen in select
  const category = formData.get('category')

  const fields = {
    title,
    amount,
    date: new Date(date),
    categoryId: category,
    userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3",
  };

  const fieldErrors = validateForm(title, amount, date)

  //return errors and filled in data
 if(Object.values(fieldErrors).some(Boolean)){
   return json({ fieldErrors, fields}, { status: 400})
 }

  //no errors, so save data
  await db.expense.create({ data : fields })
  return redirect('/expenses')
}

const AddExpense = () => {

  const { categories } = useLoaderData()
  const actionData = useActionData()
  let transition = useTransition()
  const isAdding = transition.submission && transition.submission.formData.get("_action") === 'create'
 
  if(transition.state === 'loading') {
    return  <div className="spinner spinner-large"></div>
  }

  return (
    <div className="form-wrapper">
      <Form method="POST" className="form">
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" defaultValue={actionData?.fields?.title} />
          
        </div>
        {actionData?.fieldErrors?.titleError && <p className='error-message'>{actionData.fieldErrors.titleError}</p>}
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input type="number" name="amount" step='0.01' defaultValue={actionData?.fields?.amount || '0.00'}/>
          
        </div>
        {actionData?.fieldErrors?.amountError && <p className='error-message'>{actionData.fieldErrors.amountError}</p>}
        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={actionData?.fields?.date.split('T')[0]}
          />
        </div>
        {actionData?.fieldErrors?.dateError && <p className='error-message'>{actionData.fieldErrors.dateError}</p>}

        <div className="form-control">
          <label htmlFor="category">Category</label>
          {
            <select name="category" defaultValue={actionData?.fields?.category}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          }
        </div>
        <div className="form-buttons">
          <button disabled={isAdding} name="_action" value="create" type="submit" className="btn btn-primary">
            {isAdding ? <div className="spinner">Adding...</div> : 'Add'}
          </button>
          <Link to="/expenses" className="btn btn-secondary">
            Go Back
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default AddExpense


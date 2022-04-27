import { Form, Link, redirect, json, useLoaderData, useActionData, useTransition, useCatch } from 'remix'
import { db } from '~/utils/db.server.js'
import { useRef, useEffect } from 'react'
import { getBudgetsForUser } from '~/utils/getBudgetsForUser.js';
import { getCurrentBudgetForUser } from '~/utils/getCurrentBudgetForUser.js';
import formStyles from "~/styles/forms.css";

export const links = () => [{ href: formStyles, rel: "stylesheet" }];

const validateForm = (amount, date) => {
  const currDate = new Date();
  const startDate = date ? new Date(date) : null;
  let dateError = null
 
  if (!startDate) {
    dateError = "Please fill in the start date";
  }

  //only allow a start date on the first day of a future month
  else if (startDate < currDate || startDate.getDate() !== 1) {
    dateError = "Date must be first day of future month";
  }

  const validations = {
    dateError,
    amountError:
      !amount || typeof amount !== "number" || amount > 999999.99 || amount < 0
        ? "Amount must be between 0 and 1 million"
        : null,
  };
  return validations;
};

export const loader = async() => {
  const budgets = await getBudgetsForUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")
  if(!budgets){
    throw new Response("Loading form failed", { status: 404})
  }
  //check for an existing future budget, needed for warning message to user
  const futureBudget = budgets.find(budget => new Date(budget.startDate) > new Date())
  return futureBudget ? true : false
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const startDate = formData.get("start-date");
  const amount = Math.abs(+formData.get("amount"));

  const fields = {
    amount,
    startDate: new Date(startDate),
    userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3",
  };

  const fieldErrors = validateForm(amount, startDate)

  //return errors and filled in data
  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  try {
    //set end date for current budget
    const currentBudget = await getCurrentBudgetForUser("70e0cff2-7589-4de8-9f2f-4e372a5a15f3")

    const updatedBudget = await db.budget.update({
      where: {
        id: currentBudget.id,
      },
      data: {
        endDate: new Date(startDate),
      },
    });

    if(!updatedBudget){
      throw new Response("Loading form failed", { status: 404})
    }

    //no errors, so save data
    await db.budget.create({ data: fields });

    return redirect("/budgets");
  
  } catch (e) {
    throw new Error('Updating database failed', {
      status: 404,
    });
  }
};

const AddBudget = () => {
  let transition = useTransition()
  const hasFutureBudget = useLoaderData()
  const actionData = useActionData()
  const inputRef = useRef(null)

  useEffect(() => {
      inputRef.current.focus()
  }, [])


  return (
    <div className="form-wrapper">
      {hasFutureBudget && <p className='error-message-center'>There is already a future budget. Delete it before creating a new one.</p>}
      <Form method="POST" className="form">  
      <div className="form-control">
          <label htmlFor="start-date">Start date</label>
          <input type="date" name="start-date" ref={inputRef} defaultValue={actionData?.fields?.startDate.split('T')[0] || new Date().toISOString().split('T')[0]}/>
        </div>
        {actionData?.fieldErrors?.dateError && <p className='error-message'>{actionData.fieldErrors.dateError}</p>} 
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input type="number" name="amount" defaultValue={actionData?.fields?.amount || '0.00'} step='0.01'/>
        </div>
        {actionData?.fieldErrors?.amountError && <p className='error-message'>{actionData.fieldErrors.amountError}</p>}
        <div className="form-buttons">
          <button name="_action" value="create" type="submit" className="btn btn-primary" disabled={hasFutureBudget || transition.state === 'submitting'}>
           {transition.state === 'submitting' ? 'Adding...' : 'Add'}
          </button>
          <Link to="/budgets" className="btn btn-secondary">
            Go Back
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default AddBudget

export function CatchBoundary() {
  const caught = useCatch();
  const errorMessage = caught.data ? JSON.stringify(caught.data, null, 2).replace(/['"]/gi, "") : `${caught.status}: ${caught.statusText}`;

  return (
    <div class="text-center">
      <p className="error-boundary-msg my-1">{errorMessage}</p>
      <Link to="/budgets" className="btn btn-secondary">
            Go Back
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div class="text-center">
      <p className="error-boundary-msg my-1">{error.message}</p>
      <Link to="/budgets" className="btn btn-secondary">
            Go Back
      </Link>
    </div>
  );
}
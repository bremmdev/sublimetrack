import { Form, Link, redirect, json, useLoaderData, useActionData, useTransition } from 'remix'
import { db } from '~/utils/db.server.js'


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

  //check if there is a future budget already
  const budgets = await db.budget.findMany({})
  const futureBudget = budgets.find(budget => new Date(budget.startDate) > new Date())

  //if there already is a future budget
  if(futureBudget){
    return json({ formError: 'There is already a future budget. Delete it before creating a new one.', fields }, { status: 400 });
  }

  //return errors and filled in data
  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  try {

    const currentBudget = await db.budget.findFirst({
      where: {
        userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3",
        endDate: null,
      },
    });

    if (!currentBudget) {
      throw new Error("Updating budget failed");
    }

    //set end date for current budget
    const updatedBudget = await db.budget.update({
      where: {
        id: currentBudget.id,
      },
      data: {
        endDate: new Date(startDate),
      },
    });

    //no errors, so save data
    await db.budget.create({ data: fields });
    return redirect("/budgets");
  } catch (e) {
    throw new Error(e);
  }
};


const AddBudget = () => {

  
  let transition = useTransition()
  const actionData = useActionData()

  console.log(actionData?.fields?.startDate)
 
  if(transition.state === 'loading') {
    return  <div className="spinner spinner-large"></div>
  }

  return (
    <div className="form-wrapper">
      
      <Form method="POST" className="form">
      <div className="form-control">
          <label htmlFor="start-date">Start date</label>
          <input type="date" name="start-date" defaultValue={actionData?.fields?.startDate.split('T')[0]}/>

        </div>
        {actionData?.fieldErrors?.dateError && <p className='error-message'>{actionData.fieldErrors.dateError}</p>}
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input type="number" name="amount" defaultValue={actionData?.fields?.amount || '0.00'} step='0.01'/>
        </div>
        {actionData?.fieldErrors?.amountError && <p className='error-message'>{actionData.fieldErrors.amountError}</p>}
        {actionData?.formError && <p className='error-message'>{actionData.formError}</p>}
        <div className="form-buttons">
          <button name="_action" value="create" type="submit" className="btn btn-primary">
           Add
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
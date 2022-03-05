import { useFetcher} from 'remix'
import { FiTrash2 } from 'react-icons/fi'


const ExpenseItem = ( { expense}) => {

  const fetcher = useFetcher()
  let isDeleting = fetcher.submission && fetcher.submission.formData.get('expense_id') === expense.id
  const isFailedDeletion = fetcher.data?.error 

  return (
    <>
    <li hidden={isDeleting}>
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
    <fetcher.Form method="POST">
      <input type="hidden" name="_action" value="delete"/>
      <input type="hidden" name="expense_id" value={expense.id} />
      <button disabled={isDeleting} type="submit" className="btn-invisible">
        <FiTrash2 className="delete-exp-icon" />
      </button>
    </fetcher.Form>
  </li>
  {isFailedDeletion && <div style={{marginBottom: '1em'}} className="error-message">Deleting failed, please try again</div>}
  </>
  )
}

export default ExpenseItem
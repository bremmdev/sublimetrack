import { useFetcher} from 'remix'
import { FiTrash2 } from 'react-icons/fi'

const ExpenseItem = ( { expense }) => {

  const fetcher = useFetcher()
  let isDeleting = fetcher.submission?.formData.get('expense_id') === expense.id

  return (
    <li style={{opacity: isDeleting ? 0.25 : 1 }}>
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
  )
}

export default ExpenseItem
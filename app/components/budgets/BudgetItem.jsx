import { useFetcher } from "remix"
import { FiTrash2 } from 'react-icons/fi'


const BudgetItem = ( { budget }) => {

  const currDate = new Date()
  const startDate = new Date(budget.startDate)
  const endDate = budget.endDate ? new Date(budget.endDate) : null

  const fetcher = useFetcher()

 const startDateStr = startDate.toLocaleDateString('en-us', { month: 'long', year: 'numeric'})
 const endDateStr = endDate ? endDate.toLocaleDateString('en-us', { month: 'long', year: 'numeric'}) : ''
 const isCurrentBudget = currDate >= startDate && (currDate < (endDate || new Date('9999-01-01')))
  const isFutureBudget = currDate < startDate

  return (
    <>
      <li className={isCurrentBudget ? 'active' : ''}>
        <div className="budget-date">
          {endDate ? `${startDateStr} - ${endDateStr}` : `From ${startDateStr}` }
        </div>
        <div className="budget-amount">{Number(budget.amount).toFixed(2)}</div>
        {isFutureBudget && <fetcher.Form method="POST">
          <input type="hidden" name="_action" value="delete" />
          <input type="hidden" name="budget_id" value={budget.id} />
          <button type="submit" className="btn-invisible">
            <FiTrash2 className="edit-budget-icon" />
          </button>
        </fetcher.Form>}
        {!isFutureBudget && <span className="edit-budget-icon"></span>}
      </li>
    </>
  );
}

export default BudgetItem
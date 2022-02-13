import { Doughnut } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Legend, Tooltip, Title} from 'chart.js'
ChartJS.register(ArcElement, Legend, Tooltip, Title);


const options = {
  cutout: "60%",
  plugins: {
    legend: { labels: { color: "white", padding: 20, font: { size:14} } },
  },
};

const DoughnutChart = ( { expenses, colors }) => {

  //get data from expenses
  let categories = [...new Set(expenses.map(expense => expense.category.name))]
  let categoryColors = categories.map(cat => colors[cat])
  console.log(categoryColors)
  let expensesPerCategory = categories.map(cat => expenses.filter(exp => exp.category.name === cat))

  let expenseAmountPerCat = []
  
  expensesPerCategory.map(item => {
    expenseAmountPerCat.push(Math.abs(item.reduce((prev, curr) => prev + +curr.amount, 0)))
  })

const data = {
  labels: categories,
  datasets: [
    {
      label: "Expenses per category",
      data: expenseAmountPerCat,
      backgroundColor: categoryColors,
      borderColor: categoryColors 
    },
  ],
  
};

  return (
    <div className="doughnut-container">
      <Doughnut data={data} options={options}></Doughnut>
    </div>
  );
}

export default DoughnutChart
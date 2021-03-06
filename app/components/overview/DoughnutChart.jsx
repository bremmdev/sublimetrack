import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip, Title } from 'chart.js'
ChartJS.register(ArcElement, Legend, Tooltip, Title);

const DoughnutChart = ( { theme, expenses }) => {

   //options for chart
const options = {
  cutout: "60%",
  plugins: {
    legend: { labels: { color: theme === 'dark' ? "white" : '#330D0A', padding: 8, boxWidth: 10, usePointStyle: true, font: { size:13} } },
    title: {
      display: true,
      text: 'Expenses per category',
      color: theme === 'dark' ? "white" : '#330D0A',
      font: {
        size:18
      }
    }  
  },
};
 


  //get data from expenses
  let categories = [...new Set(expenses.map(expense => expense.category.name))]
  let colors = [...new Set(expenses.map(expense => expense.category.color))]

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
      backgroundColor: colors,
      borderColor: colors 
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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const BarChart = ({ theme, expenses }) => {

  ChartJS.defaults.color = theme === 'dark' ? "white" : '#330D0A'

  //options for chart
  const options = {
    borderRadius: 4,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? "white" : '#330D0A',
          padding: 8,
          boxWidth: 10,
          usePointStyle: true,
          font: { size: 13 },
        },
      },
    },
    scales: {
      y: {
        display: true,
        grid: {
          color: "#303456",
        },
        title: {
          display: true,
          text: "Expenses in $",
          font: {
            size: "13",
          },
        },
      },
      x: {
        display: true,
        borderColor: theme === 'dark' ? "white" : '#330D0A',
        grid: {
          color: "#303456",
        },
        title: {
          display: true,
          text: "Month",
          font: {
            size: "13",
          },
        },
      },
    },
  };



  //initilize monthly expenses to zero
  const expensesPerMonth = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8:0, 9: 0, 10: 0, 11: 0}

  expenses.forEach(expense => {
    const month = new Date(expense.date).getMonth()
    expensesPerMonth[month] += +expense.amount
  })

  const months = ["Jan","Feb","Mar","Apr", "May", "Jun","Jul","Aug", "Sep","Oct","Nov","Dec"];
  
  const data = {
    labels: months,
    datasets: [
      {
        label: "Expenses per month",
        data: Object.values(expensesPerMonth),
        backgroundColor: theme === 'dark' ? "#00CCFF" : '#fc0156',
      },
    ],
  };

  return (
    <div className="barchart-container">
      {<Bar data={data} options={options}></Bar>}
    </div>
  );
};

export default BarChart;

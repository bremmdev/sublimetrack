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

ChartJS.defaults.color = "white";

const options = {
  borderRadius: 4,
  plugins: {
    legend: {
      labels: {
        color: "white",
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
      borderColor: "#FFF",
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

const BarChart = ({ expenses }) => {
  console.table(expenses);

  const expensesPerMonth = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8:0, 9: 0, 10: 0, 11: 0}

  expenses.forEach(expense => {
    const month = new Date(expense.date).getMonth()
    expensesPerMonth[month] += +expense.amount
  })

  console.log(Object.values(expensesPerMonth))

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  const data = {
    labels: months,
    datasets: [
      {
        label: "Expenses per month",
        data: Object.values(expensesPerMonth),
        backgroundColor: "#4ddbff",
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

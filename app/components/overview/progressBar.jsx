const ProgressBar = (props) => {
  let width = (props.expense / props.budget) * 100;
  if (width > 100) {
    width = 100;
  }

  return (
    <div className="progressbar-container">
      <h3 className="accent">
        Budget left: {(props.budget - props.expense).toFixed(2)} / {props.budget.toFixed(2)}
      </h3>
      <div className="progressbar">
        <div className="progressbar-spent" style={{ width: `${width}%`, borderRadius: width === 100 && '0.5em' }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;

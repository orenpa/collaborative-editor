import React from "react";
import "../styles/Fail.css";

interface FailProps {
  onRetry: () => void;
}

function Fail(props: FailProps) {
  const { onRetry } = props;
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <div style={{ fontSize: "2em", textAlign: "center" }}>😢</div>
        <div style={{ fontSize: "2em", textAlign: "center" }}>Fail</div>
        <button className="button-fail" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default Fail;

import React from "react";
import "../styles/Success.css";
interface SuccessProps {
  onBackToLobby: () => void;
}
function Success(props: SuccessProps) {
  const { onBackToLobby } = props;
  return (
    <div className="success-container">
      <div className="success-content">
        <div style={{ fontSize: "2em", textAlign: "center" }}>😊</div>
        <div style={{ fontSize: "2em", textAlign: "center" }}>Good Job</div>
        <div style={{ fontSize: "2em", textAlign: "center" }}>Try Another</div>
        <div>
          <button className="success-button" onClick={onBackToLobby}>
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;

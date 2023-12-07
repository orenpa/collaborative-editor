import React from "react";
import LobbyMenu from "../components/LobbyMenu";
import "../styles/LobbyPage.css";
function LobbyPage() {
  return (
    <div className="lobby-container">
      <h1>Choose Code Block:</h1>
      <LobbyMenu />
    </div>
  );
}

export default LobbyPage;

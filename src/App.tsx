import React from "react";
import "./App.css";
import LobbyPage from "./pages/LobbyPage";
import { Route, Routes } from "react-router-dom";
import CodeBlockPage from "./pages/CodeBlockPage";
import { SocketProvider } from "./contexts/SocketContext";

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="codeblock/:codeBlockId" element={<CodeBlockPage />} />
        </Routes>
      </div>
    </SocketProvider>
  );
}

export default App;

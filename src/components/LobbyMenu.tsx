import React, { useState, useEffect, useCallback } from "react";
import "../styles/ButtonToCodeBlock.scss";
import { Link } from "react-router-dom";
import { CodeBlock } from "../types/CodeBlockType";
import axios from "axios";

function LobbyMenu() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);

  const fetchCodeBlocks = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://collaborative-editor-api-production.up.railway.app/api/codeblocks"
      );
      setCodeBlocks(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchCodeBlocks();
  }, [fetchCodeBlocks]);

  return (
    <div className="buttons-to-codeblocks-container">
      {codeBlocks.map((block) => (
        <div key={block.id} className="task-button">
          <Link to={`/codeblock/${block.id}`} state={{ codeBlocks }}>
            <button className="button-style">
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">{block.title}</span>
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default LobbyMenu;

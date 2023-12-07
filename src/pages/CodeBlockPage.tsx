import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Editor from "../components/Editor";
import EditorSettingsMenu from "../components/EditorSettingsMenu";

import "../styles/CodeBlockPage.scss"; // Importing the CSS file

import { CodeBlock } from "../types/CodeBlockType";
import CodeTester from "../components/CodeTester";

import { useSocket } from "../contexts/SocketContext";

function CodeBlockPage() {
  //states
  const { codeBlockId } = useParams<{ codeBlockId: string }>();
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [currentCodeBlock, setCurrentCodeBlock] = useState<CodeBlock>({
    id: "",
    title: "",
    code: "",
  });
  const [showGutter, setShowGutter] = useState<boolean>(true);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [enableBasicAutoComplete, setEnableBasicAutoComplete] =
    useState<boolean>(false);
  const [highLightActiveLines, setHighLightActiveLines] =
    useState<boolean>(true);
  const [theme, setTheme] = useState<string>("vs-dark");
  const [fontSize, setFontSize] = useState<number>(20);
  const [language, setLanguage] = useState<string>("javascript");
  const [submittedCode, setSubmittedCode] = useState("");
  const [role, setRole] = useState<string>("student");
  const [retry, setRetry] = useState(false);
  const socket = useSocket();
  const location = useLocation();

  //transfer data from LobbyMenu
  useEffect(() => {
    //if not undeifined so we setCodeBlocks
    if (location.state) {
      setCodeBlocks(location.state.codeBlocks);
    }
  }, [location]);

  //role assignment for client
  useEffect(() => {
    // Listen for role assignment
    socket.emit("request role");
    if (socket) {
      socket.on("role assigned", (assignedRole) => {
        setRole(assignedRole);
      });
    }
    return () => {
      socket.off("role assigned");
    };
  }, [socket]);

  //to set the currentBlock after we found it
  //when data is arriving and state
  //update the latest code

  useEffect(() => {
    const foundBlock = codeBlocks.find(
      (block: CodeBlock) => block.id === codeBlockId
    );
    if (foundBlock) {
      setCurrentCodeBlock(foundBlock);
    }
  }, [codeBlockId, codeBlocks]);

  //if codetest isnt passed:
  const onRetry = () => {
    setRetry(true);
  };

  const onCodeSubmit = (code: string) => {
    setSubmittedCode(code);
    setRetry(false);
  };
  return (
    <div className="codeblock-page-container">
      <header className="codeblock-header">{currentCodeBlock.title}</header>
      <div className="editor-menu-container">
        <div className="settings-menu-wrapper">
          <EditorSettingsMenu
            role={role}
            setShowGutter={setShowGutter}
            setShowLineNumbers={setShowLineNumbers}
            setEnableBasicAutoComplete={setEnableBasicAutoComplete}
            setHighLightActiveLines={setHighLightActiveLines}
            setTheme={setTheme}
            setFontSize={setFontSize}
            setLanguage={setLanguage}
          />
        </div>
        <div className="editor-wrapper">
          <Editor
            codeBlocks={codeBlocks}
            codeBlock={currentCodeBlock}
            showGutter={showGutter}
            enableBasicAutoComplete={enableBasicAutoComplete}
            showLineNumbers={showLineNumbers}
            highLightActiveLines={highLightActiveLines}
            theme={theme}
            fontSize={fontSize}
            language={language}
            onCodeSubmit={onCodeSubmit}
            retry={retry}
            setRetry={setRetry}
            submittedCode={submittedCode}
            readOnly={role !== "student"}
          />
        </div>
      </div>
      {submittedCode && !retry && (
        <CodeTester
          codeToTest={submittedCode}
          taskId={currentCodeBlock.id}
          onRetry={onRetry}
        />
      )}
    </div>
  );
}

export default CodeBlockPage;

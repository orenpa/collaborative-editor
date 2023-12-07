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

  //useParams extract the codeblock id from the dynamcic route from LobbyMenu clicked Link button
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
    // Listen for if there is a role assignment, assign if is.
    socket.emit("request role");
    if (socket) {
      socket.on("role assigned", (assignedRole) => {
        setRole(assignedRole);
      });
    }

    //after roll assigned we remove the listener, we already have a role (student ot mentor)
    return () => {
      socket.off("role assigned");
    };
  }, [socket]);

  //when clicked from LobbyMenu, we get two things:
  //the list of codeblocks and the codeblock id through a dynamic router
  //we use this to set the current codeblock
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

  //code submmission after a try
  const onCodeSubmit = (code: string) => {
    setSubmittedCode(code);
    setRetry(false);
  };
  return (
    <div className="codeblock-page-container">
      <header className="codeblock-page-header">
        {currentCodeBlock.title}
      </header>
      <div className="settings-menu-container">
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
      {/* if there was a code submission by a client, test the code */}
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

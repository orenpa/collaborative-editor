import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Editor.css";

import { CodeBlock } from "../types/CodeBlockType";

import MonacoEditor, { Monaco, OnChange } from "@monaco-editor/react";
import monokaiTheme from "monaco-themes/themes/Monokai.json";
import chromeTheme from "monaco-themes/themes/Clouds Midnight.json";
import gitHubLight from "monaco-themes/themes/GitHub Light.json";
import gitHubDark from "monaco-themes/themes/GitHub Dark.json";
import dracula from "monaco-themes/themes/Dracula.json";

import { useSocket } from "../contexts/SocketContext";
import { editor } from "monaco-editor";

interface EditorSettingsMenuProps {
  codeBlock: CodeBlock;
  showGutter: boolean;
  showLineNumbers: boolean;
  enableBasicAutoComplete: boolean;
  highLightActiveLines: boolean;
  theme: string;
  fontSize: number;
  language: string;
  onCodeSubmit: (code: string) => void;
  retry: boolean;
  setRetry: React.Dispatch<React.SetStateAction<boolean>>;
  submittedCode: string;
  readOnly: boolean;
  codeBlocks: CodeBlock[];
}

function Editor(editorProps: EditorSettingsMenuProps) {
  const {
    codeBlock,
    showGutter,
    showLineNumbers,
    enableBasicAutoComplete,
    highLightActiveLines,
    theme,
    fontSize,
    language,
    onCodeSubmit,
    retry,
    setRetry,
    submittedCode,
    readOnly,
    codeBlocks,
  } = editorProps;

  const { id, code } = codeBlock;
  //states
  const [nowEditCode, setNowEditCode] = useState<string>(code);

  const socket = useSocket();
  const naviagte = useNavigate();

  //when blockId changes i fetch new codeblock
  useEffect(() => {
    if (retry) {
      // When retrying, load the previously submitted code
      setNowEditCode(submittedCode);
    } else {
      // When not retrying, ensure the current code block is up-to-date
      setNowEditCode(code);
    }
  }, [retry, setRetry, submittedCode, code]);

  const updateCode = useCallback(
    (data: { codeBlockId: string; newCode: string }) => {
      if (data.codeBlockId == id) {
        setNowEditCode(data.newCode);
      }
    },
    [id]
  );
  //listen to code changes on your codeblock
  useEffect(() => {
    console.log("REGISTERING LISTENER");
    socket.on("code change", updateCode);
  }, [updateCode]);

  //wait for the editor to mount and then it adds the themes
  const editorDidMount = (editor: any, monaco: Monaco): void => {
    monaco.editor.defineTheme("monokai", monokaiTheme as any);
    monaco.editor.defineTheme("chrome", chromeTheme as any);
    monaco.editor.defineTheme("github", gitHubLight as any);
    monaco.editor.defineTheme("github-dark", gitHubDark as any);
    monaco.editor.defineTheme("dracula", dracula as any);
    editor.focus();
  };

  const handleCodeChange = (
    newCode: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => {
    // Don't send a message if a change was not made by the user typing
    if (ev.isFlush) {
      return;
    }
    if (newCode) {
      setNowEditCode(newCode);
      console.log("EMIT CODE CHANGE!");
      socket.emit("code change", {
        codeBlockId: id,
        newCode,
      });
    }
  };

  //handle buttons
  const handleClickSubmitCode = () => {
    setRetry(false);
    onCodeSubmit(nowEditCode);
  };

  const handleClickResetCode = () => {
    const originalCodeBlock = codeBlocks.find(
      (block) => block.id === codeBlock.id
    );
    if (originalCodeBlock) {
      setNowEditCode(originalCodeBlock.code);
      socket.emit("code change", {
        codeBlockId: originalCodeBlock.id,
        newCode: originalCodeBlock.code,
      });
    }
  };

  // const handleClickClearAll = () => {
  //   setNowEditCodeBlock((prev) => ({ ...prev, code: "" }));
  // };

  const handleBackToLobby = () => {
    //back to the lobby
    naviagte("/");
  };

  return (
    <div className="codeblockcomponent-container">
      <MonacoEditor
        height={600}
        width={1000}
        language={language}
        theme={theme}
        value={nowEditCode}
        onChange={handleCodeChange}
        onMount={editorDidMount}
        options={{
          lineNumbers: showLineNumbers ? "on" : "off",
          readOnly: readOnly,
          scrollBeyondLastLine: false,
          quickSuggestions: enableBasicAutoComplete,
          minimap: { enabled: true },
          showFoldingControls: showGutter ? "always" : "never",
          renderLineHighlight: highLightActiveLines ? "all" : "none",
          parameterHints: { enabled: true },
          showUnused: true,
          automaticLayout: true,
          fixedOverflowWidgets: true,
          tabSize: 2,
          fontSize: fontSize,
        }}
      />
      <div className="buttons-container">
        <button className="button" onClick={handleClickResetCode}>
          Reset Code
        </button>
        <button className="button" onClick={handleBackToLobby}>
          Back to Lobby
        </button>
        <button className="button" onClick={handleClickSubmitCode}>
          Submit Code
        </button>
      </div>
    </div>
  );
}

export default Editor;

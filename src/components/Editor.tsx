import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Editor.css";

import { CodeBlock } from "../types/CodeBlockType";

import MonacoEditor, { Monaco } from "@monaco-editor/react";
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

  //states
  const { id, code } = codeBlock;
  const [nowEditCode, setNowEditCode] = useState<string>(code);

  const socket = useSocket();
  const naviagte = useNavigate();

  //wait for the editor to mount and then it adds the themes
  const editorDidMount = (editor: any, monaco: Monaco): void => {
    monaco.editor.defineTheme("monokai", monokaiTheme as any);
    monaco.editor.defineTheme("chrome", chromeTheme as any);
    monaco.editor.defineTheme("github", gitHubLight as any);
    monaco.editor.defineTheme("github-dark", gitHubDark as any);
    monaco.editor.defineTheme("dracula", dracula as any);
    editor.focus();
  };

  //If fail, try again with the submitted code, else passed
  useEffect(() => {
    if (retry) {
      // When retrying task, load the previously submitted code
      setNowEditCode(submittedCode);
    } else {
      // When not retrying, ensure the current code is up-to-date
      setNowEditCode(code);
    }
  }, [retry, setRetry, submittedCode, code]);

  //update code upon change
  const updateCode = useCallback(
    (data: { codeBlockId: string; newCode: string }) => {
      if (data.codeBlockId === id) {
        setNowEditCode(data.newCode);
      }
    },
    [id]
  );

  //listen to code changes on your codeblock
  useEffect(() => {
    socket.on("code change", updateCode);
  }, [updateCode, socket]);

  const handleCodeChange = (
    newCode: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => {
    // Don't send a message if a change was not made by the user who is typing
    if (ev.isFlush) {
      return;
    }
    //notify other clients that code changed
    if (newCode) {
      setNowEditCode(newCode);
      socket.emit("code change", {
        codeBlockId: id,
        newCode,
      });
    }
  };

  //handle submit code for test
  const handleClickSubmitCode = () => {
    setRetry(false);
    onCodeSubmit(nowEditCode);
  };

  //resets the codeblock for everyone to its original code defined by the server
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

  //back to the lobby
  const handleBackToLobby = () => {
    naviagte("/");
  };

  return (
    <div className="editor-container">
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

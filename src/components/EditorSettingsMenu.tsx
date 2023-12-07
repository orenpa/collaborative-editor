import React from "react";
import "../styles/EditorSettingsMenu.css";

import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import { orange } from "@mui/material/colors";
import RoleTag from "./RoleTag";

interface EditorSettingsMenuProps {
  setShowGutter: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLineNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  setEnableBasicAutoComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setHighLightActiveLines: React.Dispatch<React.SetStateAction<boolean>>;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  role: string;
}

function EditorSettingsMenu(props: EditorSettingsMenuProps) {
  const {
    setShowGutter,
    setShowLineNumbers,
    setEnableBasicAutoComplete,
    setHighLightActiveLines,
    setTheme,
    setFontSize,
    setLanguage,
    role,
  } = props;

  function handleThemeChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setTheme(event.target.value);
  }
  function handleLanguageChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setLanguage(event.target.value);
  }
  function handleFontSizeChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    const newFontSize = Number(event.target.value);
    setFontSize(newFontSize);
  }

  //checkboxes and selects
  const label = { inputProps: { "aria-label": "Checkbox" } };
  const checkboxStyle = {
    color: orange[800],
    "&.Mui-checked": {
      color: orange[600],
    },
  };

  const labelStyle = {
    justifyContent: "flex-start",
    marginLeft: 0,
    width: "100%",
    color: orange[600], // Set the text color to orange
  };

  function handleAutoCompleteChange(
    event: React.ChangeEvent,
    checked: boolean
  ): void {
    checked
      ? setEnableBasicAutoComplete(true)
      : setEnableBasicAutoComplete(false);
  }

  function handleShowGutterChange(
    event: React.ChangeEvent,
    checked: boolean
  ): void {
    checked ? setShowGutter(true) : setShowGutter(false);
  }

  function handleHighlighActiveLineChange(
    event: React.ChangeEvent,
    checked: boolean
  ): void {
    checked ? setHighLightActiveLines(true) : setHighLightActiveLines(false);
  }

  function handleShowLineNumbersChange(
    event: React.ChangeEvent,
    checked: boolean
  ): void {
    checked ? setShowLineNumbers(true) : setShowLineNumbers(false);
  }

  return (
    <div className="menu">
      <div className="role-tag-div">
        <RoleTag role={role} />
      </div>
      <div className="select-div">
        <select id="mySelect" onChange={handleThemeChange}>
          <option value="">Visual Studio</option>
          <option className="vs" value="vs">
            Visual Studio
          </option>
          <option value="vs-dark">Visual Studio Dark</option>
          <option value="hc-black">High Contrast Dark</option>
          <option value="github">Github</option>
          <option value="github-dark">Github Dark</option>
          <option value="chrome">Chrome</option>
          <option value="monokai">Monokai</option>
          <option value="dracula">Dracula</option>
        </select>
      </div>
      <div className="select-div">
        <select id="mySelect" onChange={handleFontSizeChange}>
          <option value="">Font Size</option>
          <option value={14}>14</option>
          <option value={16}>16</option>
          <option value={18}>18</option>
          <option value={20}>20</option>
          <option value={24}>24</option>
          <option value={28}>28</option>
          <option value={32}>32</option>
          <option value={40}>40</option>
        </select>
      </div>
      <div className="select-div">
        <select id="mySelect" onChange={handleLanguageChange}>
          <option value="">Javascript</option>
          <option value={"python"}>Python</option>
          <option value={"javascript"}>Javascript</option>
          <option value={"typescript"}>Typescript</option>
          <option value={"java"}>Java</option>
          <option value={"csharp"}>C#</option>
          <option value={"cpp"}>C++</option>
        </select>
      </div>

      <div className="checker">
        <FormControlLabel
          control={
            <Checkbox
              {...label}
              onChange={handleAutoCompleteChange}
              sx={checkboxStyle}
            />
          }
          label="Enable Autocomplete"
          sx={labelStyle}
        />
      </div>
      <div className="checker">
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              {...label}
              onChange={handleShowGutterChange}
              sx={checkboxStyle}
            />
          }
          label="Show Gutter"
          sx={labelStyle}
        />
      </div>
      <div className="checker">
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              {...label}
              onChange={handleHighlighActiveLineChange}
              sx={checkboxStyle}
            />
          }
          label="Highlight Active Line"
          sx={labelStyle}
        />
      </div>
      <div className="checker">
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              {...label}
              onChange={handleShowLineNumbersChange}
              sx={checkboxStyle}
            />
          }
          label="Show Line Numbers"
          sx={labelStyle}
        />
      </div>
    </div>
  );
}

export default EditorSettingsMenu;

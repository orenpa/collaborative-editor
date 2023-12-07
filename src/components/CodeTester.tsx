import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Success from "./Success";
import Fail from "./Fail";

interface CodeTesterProps {
  codeToTest: string;
  taskId: string;
  onRetry: () => void;
}

const CodeTester = (props: CodeTesterProps) => {
  const { codeToTest, taskId, onRetry } = props;
  const [testResult, setTestResult] = useState<boolean | any>(false);

  const navigate = useNavigate();

  function testArrays(userCode: string) {
    try {
      // eslint-disable-next-line no-new-func
      const userFunction = new Function("nums", userCode);
      const testArray = [1, 2, 3];
      const expectedOutput = [2, 4, 6];
      const userResult = userFunction(testArray);
      return JSON.stringify(userResult) === JSON.stringify(expectedOutput);
    } catch (error) {
      console.error("Error testing user code:", error);
      return false;
    }
  }

  function testStrings(userCode: string) {
    try {
      // Create a new function from the user's code
      // eslint-disable-next-line no-new-func
      const userFunction = new Function("str", userCode);

      // Test case: reverse a simple string
      const testString = "hello";
      const expectedOutput = "olleh";
      const userResult = userFunction(testString);

      // Check if the user's function returns the correct reversed string
      return userResult === expectedOutput;
    } catch (error) {
      console.error("Error testing user string code:", error);
      return false;
    }
  }

  function testIsEven(userCode: string) {
    try {
      // Dynamically create the user's function
      // eslint-disable-next-line no-new-func
      const userFunction = new Function("num", userCode);

      // Test cases
      const isTest1Correct = userFunction(2) === true; // Even number
      const isTest2Correct = userFunction(3) === false; // Odd number

      // Check if both tests correct
      return isTest1Correct && isTest2Correct;
    } catch (error) {
      console.error("Error testing user code for isEven:", error);
      return false;
    }
  }

  function testZeroedMatrix(userCode: string) {
    try {
      // Dynamically create the user function
      // eslint-disable-next-line no-new-func
      const userFunction = new Function("matrix", userCode);

      // Test case 2x2 matrix
      const testMatrix = [
        [1, 2],
        [3, 4],
      ];
      const zeroed = userFunction(testMatrix);

      // Check if all elements in the returned matrix are zero
      return zeroed.every((row: number[]) =>
        row.every((element) => element === 0)
      );
    } catch (error) {
      console.error("Error testing user code for zeroedMatrix:", error);
      return false;
    }
  }

  const runTest = useCallback((userCode: string, taskId: string) => {
    // Define the test based on taskId
    if (taskId === "arrays") {
      return testArrays(userCode);
    } else if (taskId === "strings") {
      return testStrings(userCode);
    } else if (taskId === "arithmetics") {
      return testIsEven(userCode);
    } else if (taskId === "loops") {
      return testZeroedMatrix(userCode);
    }
  }, []);

  //Handling chunks of codes to enter the tester
  function extractCodeBetweenLines(
    code: string,
    startLine: number,
    endLine: number
  ) {
    const lines = code.split("\n");
    const extractedLines = lines.slice(startLine - 1, endLine);
    return extractedLines.join("\n");
  }

  //If there is a code to test, run a test on it, reurn the result
  useEffect(() => {
    if (codeToTest && taskId) {
      const extractedCode = extractCodeBetweenLines(codeToTest, 5, 15);
      const passedTest = runTest(extractedCode, taskId);
      setTestResult(passedTest);
    }
  }, [codeToTest, taskId, runTest]);

  //handler Back to Lobby
  const handleBackToLobby = () => {
    navigate("/");
  };

  //alerts the reults upon seccess or fail
  const renderTestResult = () => {
    if (testResult === null) return null;
    if (testResult) {
      return <Success onBackToLobby={handleBackToLobby} />;
    } else {
      return <Fail onRetry={onRetry} />;
    }
  };

  return renderTestResult();
};

export default CodeTester;

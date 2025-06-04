// CodeEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import debounce from "lodash.debounce";
import axios from "axios";

const languageOptions = [
  { id: 63, name: "JavaScript", language: "javascript" },
  { id: 54, name: "C++", language: "cpp" },
  { id: 62, name: "Java", language: "java" },
  { id: 71, name: "Python", language: "python" },
];

const CodeEditor = () => {
  const { roomId } = useParams();
  const socket = useRef(null);
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");
  const [languageId, setLanguageId] = useState(63);
  const [monacoLang, setMonacoLang] = useState("javascript");

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.emit("join-room", roomId);

    socket.current.on("code-change", ({ code: incomingCode }) => {
      setCode((prevCode) => {
        if (incomingCode !== prevCode) {
          return incomingCode;
        }
        return prevCode;
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId]);

  const emitCodeChange = useRef(
    debounce((newCode) => {
      socket.current.emit("code-change", { roomId, code: newCode });
    }, 300)
  ).current;

  const handleEditorChange = (value) => {
    setCode(value);
    emitCodeChange(value);
  };

  const handleLanguageChange = (e) => {
    const selected = languageOptions.find(
      (lang) => lang.id === parseInt(e.target.value)
    );
    setLanguageId(selected.id);
    setMonacoLang(selected.language);
  };

  const handleRun = async () => {
    setOutput("Running...");
    try {
      const { data } = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageId,
          stdin: "",
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "YOUR_API_KEY_HERE",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = data.token;

      const checkResult = async () => {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": "YOUR_API_KEY_HERE",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        if (result.data.status.id <= 2) {
          setTimeout(checkResult, 1000);
        } else {
          const outputText =
            result.data.stdout ||
            result.data.stderr ||
            result.data.compile_output ||
            "No output.";
          setOutput(outputText);
        }
      };

      checkResult();
    } catch (error) {
      setOutput("Error: " + error.message);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center gap-4 p-2 bg-gray-800">
        <select
          onChange={handleLanguageChange}
          value={languageId}
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleRun}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          Run Code
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>

      <div className="p-2 bg-black text-green-300 text-sm overflow-auto h-40">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;

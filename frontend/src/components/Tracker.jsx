import React, { useState } from "react";
import axios from "axios";

export const Tracker = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (endpoint, selectedMode) => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload resume and enter job description.");
      return;
    }

    setLoading(true);
    setResult(null);
    setMode(selectedMode);

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("file", resumeFile);

    try {
      console.log(formData)
      const response = await axios.post(`http://127.0.0.1:8000/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Something went wrong." });
    }

    setLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return <p className="text-red-600">{result.error}</p>;
    }

    if (mode === "keywords") {
      return (
        <div>
          <p><strong>Technical Skills:</strong> {result["Technical Skills"]?.join(", ")}</p>
          <p><strong>Analytical Skills:</strong> {result["Analytical Skills"]?.join(", ")}</p>
          <p><strong>Soft Skills:</strong> {result["Soft Skills"]?.join(", ")}</p>
        </div>
      );
    }

    return <pre>{JSON.stringify(result.result || result, null, 2)}</pre>;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">ATS Score Checker</h2>

      <label className="block mb-2 font-semibold">Job Description</label>
      <textarea
        className="w-full border border-gray-300 rounded p-2 mb-4"
        rows="5"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <label className="block mb-2 font-semibold">Upload Resume (PDF only)</label>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleSubmit("analyze-resume", "review")}
        >
          ATS Review
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => handleSubmit("extract-keywords", "keywords")}
        >
          Get Keywords
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => handleSubmit("percentage-match", "match")}
        >
          Match %
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Processing...</p>
      ) : (
        // <div className="bg-gray-100 p-4 rounded overflow-x-auto">
        //   {renderResult()}
        // </div>
        <div className="bg-gray-100 p-4 rounded overflow-x-auto">
          <div className="prose max-w-none">
            <p className="leading-relaxed text-gray-800">
              {renderResult()}
            </p>
          </div>
        </div>

      )}
    </div>
  );
};

// import React, { useState } from "react";
// import axios from "axios";

// export const Tracker = () => {
//   const [jobDescription, setJobDescription] = useState("");
//   const [resumeFile, setResumeFile] = useState(null);
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setResumeFile(e.target.files[0]);
//   };

//   const handleSubmit = async (endpoint) => {
//     if (!resumeFile || !jobDescription) {
//       alert("Please upload resume and enter job description.");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("job_description", jobDescription);
//     formData.append("file", resumeFile);

//     try {
//       const response = await axios.post(`http://localhost:8000/${endpoint}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setResult(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//       setResult({ error: "Something went wrong." });
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-4 text-center">ATS Score Checker</h2>

//       <label className="block mb-2 font-semibold">Job Description</label>
//       <textarea
//         className="w-full border border-gray-300 rounded p-2 mb-4"
//         rows="5"
//         placeholder="Paste job description here..."
//         value={jobDescription}
//         onChange={(e) => setJobDescription(e.target.value)}
//       />

//       <label className="block mb-2 font-semibold">Upload Resume (PDF only)</label>
//       <input
//         type="file"
//         accept=".pdf"
//         onChange={handleFileChange}
//         className="mb-4"
//       />

//       <div className="flex gap-4 mb-4">
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={() => handleSubmit("analyze-resume")}
//         >
//           ATS Review
//         </button>
//         <button
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           onClick={() => handleSubmit("extract-keywords")}
//         >
//           Get Keywords
//         </button>
//         <button
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//           onClick={() => handleSubmit("percentage-match")}
//         >
//           Match %
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-600">Processing...</p>
//       ) : result ? (
//         <div className="bg-gray-100 p-4 rounded overflow-x-auto">
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       ) : null}
//     </div>
//   );
// };


// import React from 'react'

//  = () => {
//   return (
//     <div>Tracker</div>
//   )
// }

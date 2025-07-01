"use client";
import { useState } from "react";
import HealthStatusIndicator from "./HealthStatus";

type ApiResponse = {
  answer: string;
  context_chunks: string[];
  processing_time: number;
  document_hash: string;
};

export default function PdfQaForm() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !question) return;

    setLoading(true);
    setError("");
    setResult(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get answer");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 relative">
      <HealthStatusIndicator />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            PDF File:
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </label>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">
            Your Question:
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Processing..." : "Ask Question"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-lg mb-2">Answer:</h3>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: result.answer }} />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-lg mb-2">Processing Details:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Time taken:</span>
                <span className="ml-2 font-medium">{result.processing_time.toFixed(2)} seconds</span>
              </div>
              <div>
                <span className="text-gray-500">Document hash:</span>
                <span className="ml-2 font-mono text-sm">{result.document_hash}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-lg mb-2">Relevant Context:</h3>
            <div className="space-y-2">
              {result.context_chunks.map((chunk, i) => (
                <div key={i} className="p-3 bg-white rounded border border-gray-200">
                  <p className="text-sm">{chunk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
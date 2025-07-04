import PdfQaForm from "@/components/QaForm";

export default function Home() {
  return (
    <main className="min-h-screen py-10 bg-white">
      {/* Notice Section */}
      <section className="max-w-4xl mx-auto mb-12 px-6 py-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-3 flex items-center justify-center">
           Note
        </h1>
        <p className="text-lg text-gray-800 mb-4 text-center">
          <span className="font-semibold">This is only the Front End of the Project.</span><br />
          The model is <span className="text-red-500 font-semibold">not yet deployed</span>. Please run on <code className="bg-gray-200 px-2 py-1 rounded">localhost</code> to test the complete functionality.
        </p>
        <p className="text-center text-gray-700 text-lg">
          Find the model here:{" "}
          <a
            href="https://github.com/tanmaydev56/GenAIbmProject-pdf_qaModel.git"
            className="text-blue-600 font-medium underline hover:text-blue-800 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
          PDF Question Answering System
        </h2>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Upload a PDF document and ask questions about its content. The system will analyze the document and provide relevant answers based on your query.
        </p>
        <div className="max-w-3xl mx-auto">
          <PdfQaForm />
        </div>
      </section>
    </main>
  );
}

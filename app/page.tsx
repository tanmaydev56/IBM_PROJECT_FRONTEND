import ModelWarningNotice from "@/components/ModelWarningNotice";
import PdfQaForm from "@/components/QaForm";

export default function Home() {
  return (
    <main className="min-h-screen py-10 bg-white">
      {/* Notice Section */}
     <ModelWarningNotice/>

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

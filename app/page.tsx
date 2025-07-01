import PdfQaForm from "@/components/QaForm";

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">PDF Question Answering System</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload a PDF document and ask questions about its content. The system will analyze the document and provide accurate answers.
        </p>
        <PdfQaForm />
      </div>
    </main>
  );
}
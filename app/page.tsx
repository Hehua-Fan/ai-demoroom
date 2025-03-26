import EssayEvaluator from "@/components/evaluation";

export default function Home() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/background.jpg')" }}
    >
      <div className="min-h-screen max-w-screen-xl mx-auto p-6">
        <EssayEvaluator />
      </div>
    </main>
  );
}
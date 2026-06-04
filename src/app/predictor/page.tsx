import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { PredictorForm } from "@/components/predictor/predictor-form";
import { getPredictionHistory } from "@/services/predictor.service";

export const metadata: Metadata = {
  title: "Admission Predictor",
};

export default async function PredictorPage() {
  const session = await auth();
  const history = session?.user?.id ? await getPredictionHistory(session.user.id) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">College Predictor</h1>
        <p className="mt-3 max-w-2xl text-surface-400">
          Estimate your admission chances across JEE Main, KCET, and COMEDK using rank bands and college outcome signals.
        </p>
      </div>
      <PredictorForm history={history} />
    </div>
  );
}

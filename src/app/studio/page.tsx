import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RecordingStudio from "@/components/RecordingStudio";

export default async function StudioPage() {
  const { userId } = await auth();
  // Only allow access for authenticated users (customize for team as needed)
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Recording Studio</h1>
      {/* Recording studio UI */}
      <div id="studio-root">
        <RecordingStudio />
      </div>
    </div>
  );
}

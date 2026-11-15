import { CameraView } from "@components/CameraView";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-camera-background gap-6 px-4">
      <CameraView />
    </main>
  );
}

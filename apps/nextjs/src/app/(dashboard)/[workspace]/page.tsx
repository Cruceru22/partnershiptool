import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { VideoDropzone } from "./_components/video-dropzone";
import { VideoList } from "./_components/video-list/video-list";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  prefetch(trpc.video.all.queryOptions());

  return (
    <HydrateClient>
      <div className="flex flex-col gap-6 p-4">
        <VideoDropzone />
        {/* <AuthShowcase /> */}

        <VideoList />
      </div>
    </HydrateClient>
  );
}

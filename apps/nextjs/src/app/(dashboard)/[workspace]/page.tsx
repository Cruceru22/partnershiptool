import { HydrateClient } from "~/trpc/server";
import { APIList } from "./_components/api-list";

export default function HomePage() {

  return (
    <HydrateClient>
      <div className="container mx-auto">
        <APIList />
      </div>
    </HydrateClient>
  );
}

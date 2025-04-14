import { getHistory } from "@/entities/history/actions/history-action";
import { ClientHistory } from "./client";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import Container from "@/shared/components/container";

export default async function HistoryPage() {
  const history = await getHistory();

  if (!history || !history.videos || history.videos.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 font-medium text-lg">No history found</h3>
        <p className="mb-6 text-gray-500">
          You haven't analyzed any videos yet
        </p>
        <Link href="/">
          <Button>Analyze a Video</Button>
        </Link>
      </div>
    );
  }

  return (
    <Container>
      <ClientHistory videos={history.videos} />
    </Container>
  );
}

import DSASidebar from "@/components/DSASidebar";

export function generateStaticParams() {
  return [
    { topicKey: "arrays" },
    { topicKey: "linked-list" },
    { topicKey: "strings" },
    { topicKey: "stack-queue" },
    { topicKey: "trees" },
    { topicKey: "graph" },
    { topicKey: "dp" },
    { topicKey: "greedy" },
    { topicKey: "sorting-searching" },
    { topicKey: "recursion-backtracking" },
  ];
}

export default async function TopicProblemsPage({
  params,
}: {
  params: Promise<{ topicKey: string }>;
}) {
  const { topicKey } = await params;
  return <DSASidebar initialTopicId={topicKey} />;
}

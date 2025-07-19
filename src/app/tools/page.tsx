'use client';
import dynamic from "next/dynamic";

// Dynamically import the client-side Tools component
const ToolsClient = dynamic(() => import("@/components/tools-client"), {
  ssr: false,
  loading: () => <div className="p-8 text-white">Loading tools...</div>,
});

export default function ToolsPage() {
  return <ToolsClient />;
}

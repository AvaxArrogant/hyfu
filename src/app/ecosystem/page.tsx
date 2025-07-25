// app/ecosystem/page.tsx
'use client';

import dynamic from "next/dynamic";

// Dynamically import the client-side ecosystem component
const EcosystemClient = dynamic(() => import("@/components/ecosystem-client"), {
  ssr: false,
  loading: () => <div className="p-8 text-white">Loading ecosystem...</div>,
});

export default function EcosystemPage() {
  return <EcosystemClient />;
}

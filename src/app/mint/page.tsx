// app/mint/page.tsx (Server Component)
import MintClient from "@/components/mint-client";

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <MintClient searchParams={searchParams} />;
}
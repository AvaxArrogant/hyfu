// app/page.tsx
import HomeClient from "@/components/home-client";

export default async function Page({ searchParams }: { searchParams: URLSearchParams }) {
  const ref = searchParams.get("ref") || null;

  return <HomeClient searchParams={{ ref }} />;
}

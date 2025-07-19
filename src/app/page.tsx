// app/page.tsx
import HomeClient from "@/components/home-client";

export default async function Page({
  searchParams,
}: {
  searchParams?: { ref?: string };
}) {
  const ref = typeof searchParams?.ref === "string" ? searchParams.ref : null;

  return <HomeClient searchParams={{ ref }} />;
}

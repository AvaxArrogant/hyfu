// app/hyper-admin/page.tsx (Server Component)
import HyperAdminClient from "@/components/hyper-admin-client";

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <HyperAdminClient searchParams={searchParams} />;
}

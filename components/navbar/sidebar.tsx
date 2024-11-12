import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { ClientSidebar } from "./app-sidebar";


export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  return <ClientSidebar session={session} />;
}
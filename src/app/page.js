import { Chatbot } from "@/components/chatbot";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex">
      {/* <Sidebar /> */}
      <Chatbot />
    </main>
  );
}

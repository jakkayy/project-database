import Navbar from "@/app/components/Navbar";
import NewArrivals from "@/app/components/NewArrivals";
import ChatbotWidget from "@/app/components/ChatbotWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NewArrivals />
      <ChatbotWidget />
    </div>
  );
}

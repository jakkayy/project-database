import Navbar from "@/app/components/Navbar";
import NewArrivals from "@/app/components/NewArrivals";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NewArrivals />
    </div>
  );
}

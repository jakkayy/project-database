import Navbar from "@/app/components/Navbar";
import NewArrivals from "@/app/components/NewArrivals";
import ShopBySport from "@/app/components/ShopBySport";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
       <Navbar />
      <NewArrivals />
    </div>
  );
}

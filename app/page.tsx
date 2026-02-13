import Navbar from "./components/Navbar";
import NewArrivals from "./components/NewArrivals";
import ShopBySport from "./components/ShopBySport";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <NewArrivals />
      <ShopBySport />
    </div>
  );
}

import Navbar from "@/app/components/Navbar";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {children}
    </div>
  );
}

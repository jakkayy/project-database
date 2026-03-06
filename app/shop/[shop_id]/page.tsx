import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import ProductCard from "@/app/components/ProductCard";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";

export default async function ShopPage({ params }: { params: Promise<{ shop_id: string }> }) {
  const { shop_id } = await params;
  const shopId = Number(shop_id);
  if (isNaN(shopId)) notFound();

  const shop = await prisma.shop.findUnique({ where: { shop_id: shopId } });
  if (!shop) notFound();

  // Get in-stock product IDs for this shop
  const stockRows = await prisma.productStock.findMany({
    where: { shop_id: shopId, stock: { gt: 0 } },
    select: { product_id: true },
    distinct: ["product_id"],
  });
  const productIds = stockRows.map((r) => r.product_id);

  await connectMongo();
  const products = productIds.length > 0
    ? await Product.find({ _id: { $in: productIds } }).lean()
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Shop Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-10 py-10 flex items-center gap-6">
          {/* Shop Avatar */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
            {shop.image ? (
              <Image
                src={shop.image}
                alt={shop.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-green-100 text-2xl font-black text-green-600">
                {shop.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">Shop</p>
            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">{shop.name}</h1>
            {shop.description && (
              <p className="mt-1 text-sm text-gray-500 max-w-xl">{shop.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">{products.length} product{products.length !== 1 ? "s" : ""} available</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="mx-auto max-w-7xl px-10 py-10">
        {products.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm uppercase tracking-widest text-gray-400">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {(products as any[]).map((p) => (
              <ProductCard
                key={p._id.toString()}
                _id={p._id.toString()}
                image={p.images?.[0] || "/placeholder.png"}
                name={p.name}
                category={p.category || ""}
                basePrice={p.basePrice}
                slug={p.slug}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

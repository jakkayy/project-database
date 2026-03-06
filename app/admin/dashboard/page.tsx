import AdminNav from "../../components/AdminNav";
import InventoryAlerts from "../components/InventoryAlerts";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";
import { OrderStatus } from "@prisma/client";

function formatSales(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `฿${n.toFixed(0)}`;
}

export default async function AdminDashboardPage() {
  // Fetch total sales: SUM(price * quantity) for orders with a COMPLETED payment
  const totalSalesResult = await prisma.$queryRaw<[{ total: string | null }]>`
    SELECT SUM(oi.price * oi.quantity) AS total
    FROM OrderItem oi
    INNER JOIN \`Order\` o ON oi.order_id = o.order_id
    WHERE EXISTS (
      SELECT 1 FROM Payment p
      WHERE p.order_id = o.order_id AND p.status = 'COMPLETED'
    )
  `;
  const totalSalesNum = Number(totalSalesResult[0]?.total ?? 0);
  const totalSalesFormatted = formatSales(totalSalesNum);

  // Fetch completed orders count
  const completedOrderCount = await prisma.order.count({
    where: { status: OrderStatus.COMPLETED },
  });

  // Fetch top selling products (sum quantity by product_id, top 3)
  const topSalesRaw = await prisma.orderItem.groupBy({
    by: ["product_id"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 3,
  });

  // Fetch low stock items (stock < 5) from MySQL
  const lowStockRows = await prisma.productStock.findMany({
    where: { stock: { lt: 5 } },
    orderBy: { stock: "asc" },
  });

  // Merge all product IDs and batch fetch names from MongoDB
  await connectMongo();
  const allProductIds = [
    ...new Set([
      ...topSalesRaw.map((r) => r.product_id),
      ...lowStockRows.map((r) => r.product_id),
    ]),
  ];
  const products = await Product.find({ _id: { $in: allProductIds } }).select("_id name");
  const productMap: Record<string, string> = {};
  for (const p of products) {
    productMap[p._id.toString()] = p.name;
  }

  // Build top selling list with relative percentage bar
  const maxSold = topSalesRaw[0]?._sum.quantity ?? 1;
  const topSelling = topSalesRaw.map((r) => ({
    name: productMap[r.product_id] ?? r.product_id,
    sold: r._sum.quantity ?? 0,
    pct: Math.round(((r._sum.quantity ?? 0) / maxSold) * 100),
  }));

  // Build inventory alerts
  const inventoryAlerts = lowStockRows.map((row) => ({
    name: productMap[row.product_id] ?? row.product_id,
    color: row.color,
    size: row.size,
    stock: row.stock,
    badge: row.stock === 0 ? "OUT OF STOCK" : "LOW STOCK",
    badgeStyle:
      row.stock === 0
        ? "text-red-400 bg-red-900/30 border-red-800/50"
        : "text-[#C9A84C] bg-amber-900/30 border-amber-800/50",
  }));

  const statCards = [
    {
      title: "TOTAL SALES",
      value: totalSalesFormatted,
      subtitle: "From completed payments",
      subtitleColor: "text-emerald-400",
      borderColor: "border-l-emerald-500",
    },
    {
      title: "COMPLETED ORDERS",
      value: completedOrderCount.toLocaleString(),
      subtitle: "Needs fulfillment",
      subtitleColor: "text-neutral-500",
      borderColor: "border-l-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-5">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl border border-neutral-800 border-l-4 ${card.borderColor} bg-neutral-950 p-5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {card.title}
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {card.value}
              </p>
              <p className={`mt-1.5 text-xs font-medium ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Quick stats row */}
        <div className="mt-6 grid grid-cols-3 items-start gap-5">
          {/* Top Products */}
          <div className="col-span-2 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Top Selling Products
            </h2>
            <div className="mt-4 space-y-3">
              {topSelling.length === 0 ? (
                <p className="text-xs text-neutral-500">No sales data yet</p>
              ) : (
                topSelling.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-sm font-black text-[#C9A84C]">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {item.name}
                        </p>
                        <span className="text-xs text-neutral-500 ml-2 shrink-0">
                          {item.sold} sold
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-neutral-800">
                        <div
                          className="h-1.5 rounded-full bg-amber-400"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Inventory Alerts */}
          <InventoryAlerts alerts={inventoryAlerts} />
        </div>
      </main>
    </div>
  );
}

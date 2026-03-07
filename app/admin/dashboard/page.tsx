import AdminNav from "../../components/AdminNav";
import InventoryAlerts from "../components/InventoryAlerts";
import SalesChart from "../components/SalesChart";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";
import { OrderStatus, Prisma } from "@prisma/client";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";

function formatSales(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `฿${n.toFixed(0)}`;
}

export default async function AdminDashboardPage() {
  // Get current admin's shop
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const payload = requireAuth(token, "ADMIN");

  const shop = await prisma.shop.findUnique({ where: { user_id: payload.user_id } });
  if (!shop) return <div className="p-8 text-red-500">Shop not found.</div>;

  // Get all product_ids belonging to this shop
  const shopStocks = await prisma.productStock.findMany({
    where: { shop_id: shop.shop_id },
    select: { product_id: true },
  });
  const shopProductIds = [...new Set(shopStocks.map((s) => s.product_id))];

  // Fetch total sales filtered by shop products
  let totalSalesNum = 0;
  if (shopProductIds.length > 0) {
    const totalSalesResult = await prisma.$queryRaw<[{ total: string | null }]>`
      SELECT SUM(oi.price * oi.quantity) AS total
      FROM OrderItem oi
      INNER JOIN \`Order\` o ON oi.order_id = o.order_id
      WHERE oi.product_id IN (${Prisma.join(shopProductIds)})
        AND EXISTS (
          SELECT 1 FROM Payment p
          WHERE p.order_id = o.order_id AND p.status = 'COMPLETED'
        )
    `;
    totalSalesNum = Number(totalSalesResult[0]?.total ?? 0);
  }
  const totalSalesFormatted = formatSales(totalSalesNum);

  // Fetch completed orders count (orders containing this shop's products)
  const completedOrderCount = shopProductIds.length > 0
    ? await prisma.order.count({
        where: {
          status: OrderStatus.COMPLETED,
          items: { some: { product_id: { in: shopProductIds } } },
        },
      })
    : 0;

  // Fetch top selling products for this shop
  const topSalesRaw = shopProductIds.length > 0
    ? await prisma.orderItem.groupBy({
        by: ["product_id"],
        where: { product_id: { in: shopProductIds } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 3,
      })
    : [];

  // Fetch low stock items for this shop
  const lowStockRows = await prisma.productStock.findMany({
    where: { stock: { lt: 5 }, shop_id: shop.shop_id },
    orderBy: { stock: "asc" },
  });

  // Daily sales for last 30 days (this shop only)
  let salesChartData: { date: string; total: number }[] = [];
  if (shopProductIds.length > 0) {
    const dailySalesRaw = await prisma.$queryRaw<{ date: Date; total: string }[]>`
      SELECT DATE(o.createdAt) as date, SUM(oi.price * oi.quantity) as total
      FROM OrderItem oi
      INNER JOIN \`Order\` o ON oi.order_id = o.order_id
      WHERE oi.product_id IN (${Prisma.join(shopProductIds)})
        AND EXISTS (
          SELECT 1 FROM Payment p WHERE p.order_id = o.order_id AND p.status = 'COMPLETED'
        )
        AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(o.createdAt)
      ORDER BY date ASC
    `;
    salesChartData = dailySalesRaw.map((r) => ({
      date: new Date(r.date).toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
      total: Number(r.total),
    }));
  }

  await connectMongo();

  // Fetch products for this shop from MongoDB
  const allProducts = await Product.find({ shop_id: shop.shop_id }, { name: 1, _id: 0 }).lean() as { name: string }[];
  const allProductNames = allProducts.map((p) => p.name);

  // Fetch product names for top sales + low stock
  const neededIds = [
    ...new Set([
      ...topSalesRaw.map((r) => r.product_id),
      ...lowStockRows.map((r) => r.product_id),
    ]),
  ];
  const objectIds = neededIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  const foundProducts = await Product.find(
    { _id: { $in: objectIds } },
    { name: 1 }
  ).lean() as { _id: mongoose.Types.ObjectId; name: string }[];

  const productMap: Record<string, string> = {};
  for (const p of foundProducts) {
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
        ? "text-red-600 bg-red-50 border-red-200"
        : "text-green-700 bg-green-50 border-green-200",
  }));

  const statCards = [
    {
      title: "TOTAL SALES",
      value: totalSalesFormatted,
      subtitle: "From completed payments",
      subtitleColor: "text-green-600",
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
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-wider text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-5">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl border border-gray-200 border-l-4 ${card.borderColor} bg-white shadow-sm p-5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.title}
              </p>
              <p className="mt-3 text-3xl font-black text-gray-900">
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
          <div className="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Top Selling Products
            </h2>
            <div className="mt-4 space-y-3">
              {topSelling.length === 0 ? (
                <p className="text-xs text-gray-400">No sales data yet</p>
              ) : (
                topSelling.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-sm font-black text-green-600">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <span className="text-xs text-gray-400 ml-2 shrink-0">
                          {item.sold} sold
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-green-500"
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

        {/* Sales Chart */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Daily Sales — Last 30 Days
            </h2>
            <span className="text-xs text-gray-400">เฉพาะ payment ที่ COMPLETED</span>
          </div>
          <SalesChart data={salesChartData} />
        </div>

      </main>
    </div>
  );
}

"use client";

import ClientNavbar from "@/app/components/ClientNavbar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  date_bought: string;
  order_id: number;
  product_id: string;
  order_status: string;
}

export default function HistoryPage() {
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      const data = await response.json();
      setOrderHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ClientNavbar />

      {/* Sub Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Orders</h1>
        <div className="flex gap-8 text-sm text-gray-400">
          <Link href="/profile" className="transition-colors hover:text-gray-900">
            Profile
          </Link>
          <Link
            href="/history"
            className="border-b-2 border-green-500 pb-3 -mb-4 font-semibold text-gray-900"
          >
            Orders
          </Link>
          <Link href="/favorites" className="transition-colors hover:text-gray-900">
            Wishlist
          </Link>
        </div>
      </div>

      {/* Orders Content */}
      <div className="flex-1 px-10 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500 text-sm">Error: {error}</div>
          </div>
        ) : orderHistory.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">You have no orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm text-left text-gray-900">
              <thead className="text-xs uppercase bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3">Color</th>
                  <th scope="col" className="px-6 py-3">Size</th>
                  <th scope="col" className="px-6 py-3">Qty</th>
                  <th scope="col" className="px-6 py-3">Unit Price</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((item) => (
                  <tr
                    key={`${item.order_id}-${item.product_id}-${item.color}-${item.size}`}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(item.date_bought)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        item.order_status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : item.order_status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {item.order_status === 'COMPLETED' ? 'Completed' :
                         item.order_status === 'PENDING' ? 'Pending' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-10 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
              Resources
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="#" className="transition-colors hover:text-gray-900">Find a Store</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Become a Member</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Student Discounts</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Send Feedback</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Promo Codes</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
              Help
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="#" className="transition-colors hover:text-gray-900">Get Help</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Order Status</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Shipping</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Returns</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Payment Options</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
              Company
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="#" className="transition-colors hover:text-gray-900">About Re-Store</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">News</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Careers</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Investors</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900">Sustainability</Link></li>
            </ul>
          </div>
          <div className="flex justify-end">
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span>Thailand</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

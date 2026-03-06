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
    <div className="flex min-h-screen flex-col bg-black">
      <ClientNavbar />

      {/* Profile Sub Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-10 py-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">Orders</h1>
        <div className="flex gap-8 text-sm text-neutral-500">
          <Link href="/profile" className="transition-colors hover:text-white">
            Profile
          </Link>
          <Link
            href="/history"
            className="border-b-2 border-[#C9A84C] pb-3 -mb-4 font-semibold text-white"
          >
            Orders
          </Link>
          <Link href="/favorites" className="transition-colors hover:text-white">
            Wishlist
          </Link>
          <Link href="/setting" className="transition-colors hover:text-white">
            Settings
          </Link>
        </div>
      </div>

      {/* Orders Content */}
      <div className="flex-1 px-10 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500">Error: {error}</div>
          </div>
        ) : orderHistory.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xs uppercase tracking-wider text-neutral-500">You have no orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-white">
              <thead className="text-xs uppercase bg-neutral-900 border-b border-neutral-800">
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
                {orderHistory.map((item, index) => (
                  <tr 
                    key={`${item.order_id}-${item.product_id}-${item.color}-${item.size}`}
                    className="bg-black border-b border-neutral-800 hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {formatDate(item.date_bought)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.order_status === 'COMPLETED' 
                          ? 'bg-green-900 text-green-300' 
                          : item.order_status === 'PENDING'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
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
      <footer className="border-t border-neutral-800 bg-neutral-900 px-10 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Resources
            </h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Find a Store
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Become a Member
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Student Discounts
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Send Feedback
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Promo Codes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Help
            </h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Get Help
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Order Status
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Payment Options
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Company
            </h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  About Niko
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Investors
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Location */}
          <div className="flex justify-end">
            <div className="flex items-start gap-2 text-xs text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span>Thailand</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

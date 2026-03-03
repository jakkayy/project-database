"use client";

import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Footwear");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selections, setSelections] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Footwear",
    basePrice: "",
    image: "",
    tags: "",
    color: "",
    size: "",
    stock: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("เพิ่มสินค้าสำเร็จ!");
      setIsModalOpen(false); // ปิดหน้าต่าง Modal
      
      // *** จุดสำคัญ: ต้องเรียกฟังก์ชันนี้เพื่อให้ตารางอัปเดต ***
      await fetchInventory(); 
      
      // ล้างข้อมูลในฟอร์ม (Optional)
      setFormData({ name: "", category: "Footwear", basePrice: "", image: "", tags: "", color: "", size: "", stock: "" });
    }
  } catch (err) { 
    console.error(err); 
  } finally { 
    setLoading(false); 
  }
};

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      console.log("Frontend received:", data); // เช็คใน F12 Console
      if (Array.isArray(data)) {
        setProducts(data);
        const initialSels: any = {};
        data.forEach((p) => {
          if (p.variants.length > 0) {
            initialSels[p.mongodb_id] = {
              color: p.variants[0].color,
              size: p.variants[0].size,
            };
          }
        });
        setSelections(initialSels);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // บรรทัดนี้สำคัญ: ลองให้มันโชว์สินค้าทั้งหมดโดยไม่ต้องกรอง Category ก่อน
  const displayProducts = products;

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      <AdminNav />
      <main className="p-8 mx-auto max-w-7xl">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-black italic uppercase">Stock</h1>
          <div className="flex justify-between mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 font-bold text-black bg-amber-400 rounded-lg hover:bg-amber-300 transition-all"
            >
              ADD PRODUCT
            </button>
          </div>
        </div>

        <div className="overflow-hidden bg-[#161920] border border-gray-800 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Options</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.length > 0 ? (
                displayProducts.map((p: any) => {
                  const sel = selections[p.mongodb_id] || {
                    color: "",
                    size: "",
                  };
                  const colors = Array.from(
                    new Set(p.variants.map((v: any) => v.color)),
                  );
                  const sizes = p.variants
                    .filter((v: any) => v.color === sel.color)
                    .map((v: any) => v.size);
                  const stock =
                    p.variants.find(
                      (v: any) => v.color === sel.color && v.size === sel.size,
                    )?.stock ?? 0;

                  return (
                    <tr
                      key={p.mongodb_id}
                      className="border-b border-gray-800/50 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            className="w-10 h-10 rounded bg-black object-cover"
                          />
                          <span className="font-bold">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <select
                          className="bg-black border border-gray-700 text-[10px] p-1 rounded"
                          onChange={(e) =>
                            setSelections({
                              ...selections,
                              [p.mongodb_id]: {
                                color: e.target.value,
                                size: p.variants.find(
                                  (v: any) => v.color === e.target.value,
                                )?.size,
                              },
                            })
                          }
                        >
                          {colors.map((c: any) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <select
                          className="bg-black border border-gray-700 text-[10px] p-1 rounded"
                          onChange={(e) =>
                            setSelections({
                              ...selections,
                              [p.mongodb_id]: { ...sel, size: e.target.value },
                            })
                          }
                        >
                          {sizes.map((s: any) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-mono font-bold">
                        {stock} Units
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-bold">
                        ฿{p.basePrice.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-gray-500 italic"
                  >
                    No Data found in API. Please check Terminal for "Found in
                    Mongo" logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#161920] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="border-b border-gray-800 p-6 flex justify-between items-center bg-black/20">
              <h2 className="text-lg font-black uppercase text-amber-400">
                Add New Product
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-8 overflow-y-auto max-h-[75vh]"
            >
              <div className="grid grid-cols-2 gap-5 text-sm">
                <input
                  name="name"
                  placeholder="Product Name"
                  onChange={handleChange}
                  required
                  className="col-span-2 bg-[#0d0f14] border border-gray-800 p-3 rounded-lg outline-none focus:border-amber-400 text-white"
                />
                <input
                  name="image"
                  placeholder="Image URL"
                  onChange={handleChange}
                  required
                  className="col-span-2 bg-[#0d0f14] border border-gray-800 p-3 rounded-lg outline-none focus:border-amber-400 text-white"
                />
                <input
                  name="basePrice"
                  type="number"
                  placeholder="Price"
                  onChange={handleChange}
                  required
                  className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg outline-none focus:border-amber-400 text-white"
                />
                <select
                  name="category"
                  onChange={handleChange}
                  value={formData.category}
                  className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-gray-400 outline-none"
                >
                  {["Footwear", "Apparel", "Accessories"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="col-span-2 border-t border-gray-800 mt-4 pt-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  Initial Variant (MySQL)
                </div>
                <input
                  name="color"
                  placeholder="Color"
                  onChange={handleChange}
                  required
                  className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-400 text-white"
                />
                <input
                  name="size"
                  placeholder="Size"
                  onChange={handleChange}
                  required
                  className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-400 text-white"
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  onChange={handleChange}
                  required
                  className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-400 text-white"
                />
                <div className="col-span-2 flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-amber-400 text-black py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-amber-300 transition-all"
                  >
                    {loading ? "SAVING..." : "SAVE PRODUCT"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

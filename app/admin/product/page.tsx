"use client";

import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selections, setSelections] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "Footwear", basePrice: "", image: "", tags: "", color: "", size: "", stock: "",
  });

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        const initialSels: any = {};
        data.forEach((p) => {
          if (p.variants && p.variants.length > 0) {
            initialSels[p.mongodb_id] = { color: p.variants[0].color, size: p.variants[0].size };
          }
        });
        setSelections(initialSels);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const updateStock = async (variantId: number, currentStock: number, amount: number) => {
    const newStock = Math.max(0, currentStock + amount);
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, newStock }),
      });
      await fetchInventory();
    } catch (err) { console.error(err); }
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
        setIsModalOpen(false);
        await fetchInventory();
        setFormData({ name: "", category: "Footwear", basePrice: "", image: "", tags: "", color: "", size: "", stock: "" });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      <AdminNav />
      <main className="p-8 mx-auto max-w-7xl">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Stock</h1>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 font-bold text-black bg-amber-400 rounded-lg shadow-lg">
            ADD PRODUCT
          </button>
        </div>

        <div className="overflow-hidden bg-[#161920] border border-gray-800 rounded-xl">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800 bg-black/20">
                <th className="px-6 py-5 w-[40%]">Model</th>
                <th className="px-6 py-5 w-[25%]">Options</th>
                <th className="px-6 py-5 w-[20%]">Stock</th>
                <th className="px-6 py-5 w-[15%]">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {products.map((p: any) => {
                const sel = selections[p.mongodb_id] || { color: "", size: "" };
                const colors = Array.from(new Set(p.variants.map((v: any) => v.color)));
                const sizes = p.variants.filter((v: any) => v.color === sel.color).map((v: any) => v.size);
                const variant = p.variants.find((v: any) => v.color === sel.color && v.size === sel.size);
                const stock = variant?.stock ?? 0;

                return (
                  <tr key={p.mongodb_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded bg-black object-cover border border-gray-800" />
                        <span className="font-bold text-sm truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select className="bg-black border border-gray-700 text-[10px] p-1 rounded w-20" value={sel.color} onChange={(e) => setSelections({...selections, [p.mongodb_id]: { color: e.target.value, size: p.variants.find((v:any)=>v.color===e.target.value)?.size }})}>
                          {colors.map((c: any) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select className="bg-black border border-gray-700 text-[10px] p-1 rounded w-16" value={sel.size} onChange={(e) => setSelections({...selections, [p.mongodb_id]: { ...sel, size: e.target.value }})}>
                          {sizes.map((s: any) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => variant && updateStock(variant.id, variant.stock, -1)} className="w-5 h-5 flex items-center justify-center border border-gray-700 rounded text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all">-</button>
                        <span className="text-emerald-400 font-mono font-bold text-sm min-w-[60px] text-center">{stock} Units</span>
                        <button onClick={() => variant && updateStock(variant.id, variant.stock, 1)} className="w-5 h-5 flex items-center justify-center border border-gray-800 rounded text-gray-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-bold text-sm">฿{p.basePrice.toLocaleString()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#161920] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-black uppercase text-amber-400 mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 text-sm">
              <input name="name" placeholder="Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} required className="col-span-2 bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-amber-400" />
              <input name="image" placeholder="Image URL" onChange={(e)=>setFormData({...formData, image: e.target.value})} required className="col-span-2 bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-amber-400" />
              <input name="basePrice" type="number" placeholder="Price" onChange={(e)=>setFormData({...formData, basePrice: e.target.value})} required className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-amber-400" />
              <select name="category" onChange={(e)=>setFormData({...formData, category: e.target.value})} value={formData.category} className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-gray-400 outline-none">
                <option value="Footwear">Footwear</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
              </select>
              <div className="col-span-2 border-t border-gray-800 mt-4 pt-4 text-[10px] text-blue-400 uppercase font-bold tracking-widest">Initial Variant Specification</div>
              <input name="color" placeholder="Color" onChange={(e)=>setFormData({...formData, color: e.target.value})} required className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
              <input name="size" placeholder="Size" onChange={(e)=>setFormData({...formData, size: e.target.value})} required className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
              <input name="stock" type="number" placeholder="Stock" onChange={(e)=>setFormData({...formData, stock: e.target.value})} required className="bg-[#0d0f14] border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
              <div className="col-span-2 flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-gray-500 uppercase text-xs">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-amber-400 text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-amber-300">
                  {loading ? "SAVING..." : "SAVE PRODUCT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
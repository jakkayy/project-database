"use client";

import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";
import { getAdminInventory, addProduct, updateStock } from "lib/apiServices/admin.service";

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
      const data = await getAdminInventory();
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

  const handleUpdateStock = async (variantId: number, currentStock: number, amount: number) => {
    const newStock = Math.max(0, currentStock + amount);
    try {
      await updateStock({ variantId, newStock });
      await fetchInventory();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct(formData);
      alert("เพิ่มสินค้าสำเร็จ!");
      setIsModalOpen(false);
      await fetchInventory();
      setFormData({ name: "", category: "Footwear", basePrice: "", image: "", tags: "", color: "", size: "", stock: "" });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />
      <main className="p-8 mx-auto max-w-7xl">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Stock</h1>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 font-bold text-black bg-[#C9A84C] rounded-lg shadow-lg">
            ADD PRODUCT
          </button>
        </div>

        <div className="overflow-hidden bg-neutral-950 border border-neutral-800 rounded-xl">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] uppercase text-neutral-500 border-b border-neutral-800 bg-black/20">
                <th className="px-6 py-5 w-[40%]">Model</th>
                <th className="px-6 py-5 w-[25%]">Options</th>
                <th className="px-6 py-5 w-[20%]">Stock</th>
                <th className="px-6 py-5 w-[15%]">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
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
                        <img src={p.image} className="w-10 h-10 rounded bg-black object-cover border border-neutral-800" />
                        <span className="font-bold text-sm truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="relative">
                          <select
                            className="appearance-none bg-neutral-900 border border-neutral-700 hover:border-[#C9A84C] focus:border-[#C9A84C] text-white text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg outline-none transition-colors cursor-pointer"
                            value={sel.color}
                            onChange={(e) => setSelections({...selections, [p.mongodb_id]: { color: e.target.value, size: p.variants.find((v:any)=>v.color===e.target.value)?.size }})}
                          >
                            {colors.map((c: any) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="relative">
                          <select
                            className="appearance-none bg-neutral-900 border border-neutral-700 hover:border-[#C9A84C] focus:border-[#C9A84C] text-white text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg outline-none transition-colors cursor-pointer"
                            value={sel.size}
                            onChange={(e) => setSelections({...selections, [p.mongodb_id]: { ...sel, size: e.target.value }})}
                          >
                            {sizes.map((s: any) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => variant && handleUpdateStock(variant.id, variant.stock, -1)} className="w-5 h-5 flex items-center justify-center border border-neutral-700 rounded text-neutral-500 hover:bg-red-500/10 hover:text-red-500 transition-all">-</button>
                        <span className="text-emerald-400 font-mono font-bold text-sm min-w-[60px] text-center">{stock} Units</span>
                        <button onClick={() => variant && handleUpdateStock(variant.id, variant.stock, 1)} className="w-5 h-5 flex items-center justify-center border border-neutral-800 rounded text-neutral-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#C9A84C] font-bold text-sm">฿{p.basePrice.toLocaleString()}</span>
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
          <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-black uppercase text-[#C9A84C] mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 text-sm">
              <input name="name" placeholder="Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} required className="col-span-2 bg-black border border-neutral-800 p-3 rounded-lg text-white outline-none focus:border-[#C9A84C]" />
              <input name="image" placeholder="Image URL" onChange={(e)=>setFormData({...formData, image: e.target.value})} required className="col-span-2 bg-black border border-neutral-800 p-3 rounded-lg text-white outline-none focus:border-[#C9A84C]" />
              <input name="basePrice" type="number" placeholder="Price" onChange={(e)=>setFormData({...formData, basePrice: e.target.value})} required className="bg-black border border-neutral-800 p-3 rounded-lg text-white outline-none focus:border-[#C9A84C]" />
              <select name="category" onChange={(e)=>setFormData({...formData, category: e.target.value})} value={formData.category} className="bg-black border border-neutral-800 p-3 rounded-lg text-neutral-400 outline-none">
                <option value="Footwear">Footwear</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
              </select>
              <div className="col-span-2 border-t border-neutral-800 mt-4 pt-4 text-[10px] text-blue-400 uppercase font-bold tracking-widest">Initial Variant Specification</div>
              <input name="color" placeholder="Color" onChange={(e)=>setFormData({...formData, color: e.target.value})} required className="bg-black border border-neutral-800 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
              <input name="size" placeholder="Size" onChange={(e)=>setFormData({...formData, size: e.target.value})} required className="bg-black border border-neutral-800 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
              <input name="stock" type="number" placeholder="Stock" onChange={(e)=>setFormData({...formData, stock: e.target.value})} required className="bg-black border border-neutral-800 p-3 rounded-lg text-white outline-none focus:border-blue-400" />
              <div className="col-span-2 flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-neutral-500 uppercase text-xs">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#C9A84C] text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90">
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
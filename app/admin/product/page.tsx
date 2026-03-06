"use client";

import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";
import { getAdminInventory, addProduct, updateStock } from "lib/apiServices/admin.service";
import { toast } from "sonner";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selections, setSelections] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "Clothes", basePrice: "", image: "", tags: "", color: "", size: "", stock: "",
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
      toast.success("Product added successfully!", { description: formData.name });
      setIsModalOpen(false);
      await fetchInventory();
      setFormData({ name: "", category: "Clothes", basePrice: "", image: "", tags: "", color: "", size: "", stock: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product", { description: "Please check the form and try again" });
    }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNav />
      <main className="p-8 mx-auto max-w-7xl">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Stock</h1>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 font-bold text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 transition-colors">
            ADD PRODUCT
          </button>
        </div>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-5 w-[40%]">Model</th>
                <th className="px-6 py-5 w-[25%]">Options</th>
                <th className="px-6 py-5 w-[20%]">Stock</th>
                <th className="px-6 py-5 w-[15%]">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p: any) => {
                const sel = selections[p.mongodb_id] || { color: "", size: "" };
                const colors = Array.from(new Set(p.variants.map((v: any) => v.color)));
                const sizes = p.variants.filter((v: any) => v.color === sel.color).map((v: any) => v.size);
                const variant = p.variants.find((v: any) => v.color === sel.color && v.size === sel.size);
                const stock = variant?.stock ?? 0;

                return (
                  <tr key={p.mongodb_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded bg-gray-100 object-cover border border-gray-200" />
                        <span className="font-bold text-sm truncate text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="relative">
                          <select
                            className="appearance-none bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 text-gray-900 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg outline-none transition-colors cursor-pointer"
                            value={sel.color}
                            onChange={(e) => setSelections({...selections, [p.mongodb_id]: { color: e.target.value, size: p.variants.find((v:any)=>v.color===e.target.value)?.size }})}
                          >
                            {colors.map((c: any) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="relative">
                          <select
                            className="appearance-none bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 text-gray-900 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg outline-none transition-colors cursor-pointer"
                            value={sel.size}
                            onChange={(e) => setSelections({...selections, [p.mongodb_id]: { ...sel, size: e.target.value }})}
                          >
                            {sizes.map((s: any) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => variant && handleUpdateStock(variant.id, variant.stock, -1)} className="w-5 h-5 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">-</button>
                        <span className="text-green-600 font-mono font-bold text-sm min-w-[60px] text-center">{stock} Units</span>
                        <button onClick={() => variant && handleUpdateStock(variant.id, variant.stock, 1)} className="w-5 h-5 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-bold text-sm">฿{p.basePrice.toLocaleString()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-black uppercase text-gray-900 mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 text-sm">
              <input name="name" placeholder="Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} required className="col-span-2 bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 outline-none focus:border-green-500 placeholder-gray-400" />
              <input name="image" placeholder="Image URL" onChange={(e)=>setFormData({...formData, image: e.target.value})} required className="col-span-2 bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 outline-none focus:border-green-500 placeholder-gray-400" />
              <input name="basePrice" type="number" placeholder="Price" onChange={(e)=>setFormData({...formData, basePrice: e.target.value})} required className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 outline-none focus:border-green-500 placeholder-gray-400" />
              <select name="category" onChange={(e)=>setFormData({...formData, category: e.target.value})} value={formData.category} className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-700 outline-none focus:border-green-500">
                <option value="Clothes">Clothes</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
              <div className="col-span-2 border-t border-gray-200 mt-4 pt-4 text-[10px] text-blue-600 uppercase font-bold tracking-widest">Initial Variant Specification</div>
              <input name="color" placeholder="Color" onChange={(e)=>setFormData({...formData, color: e.target.value})} required className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 outline-none focus:border-green-500 placeholder-gray-400" />
              <input name="size" placeholder="Size" onChange={(e)=>setFormData({...formData, size: e.target.value})} required className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 outline-none focus:border-green-500 placeholder-gray-400" />
              <input name="stock" type="number" placeholder="Stock" onChange={(e)=>setFormData({...formData, stock: e.target.value})} required className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 outline-none focus:border-green-500 placeholder-gray-400" />
              <div className="col-span-2 flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-gray-400 uppercase text-xs">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-colors">
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
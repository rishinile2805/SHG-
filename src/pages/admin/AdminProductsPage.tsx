import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { ProductModal } from '../../components/admin/ProductModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    showToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameMr?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalogue?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Catalogue Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C221E] mt-0.5">
            Products & Kitchen Inventory
          </h1>
          <p className="text-xs text-[#735F50]">
            Add, update pricing, restock, or edit details for all homemade varieties.
          </p>
        </div>

        <button
          id="admin-add-product-btn"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#1E4D2B] hover:bg-[#163E23] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#735F50] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ingredient..."
            className="w-full pl-10 pr-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E] outline-hidden focus:border-[#1E4D2B]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Papad', 'Achar', 'Chakli', 'Laddus', 'Masala'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E4D2B] text-white'
                  : 'bg-[#FAF7F2] text-[#5C4A3E] hover:bg-[#E8DEC8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2C221E]">
            <thead className="bg-[#FAF7F2] text-[#735F50] uppercase text-[10px] font-bold border-b border-[#E8DEC8]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Pack Size</th>
                <th className="py-3 px-4">Inventory (Stock)</th>
                <th className="py-3 px-4">Special Tag</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock > 0 && p.stock < 10;
                const isOut = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    {/* Item with Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FAF7F2] border border-[#E5DACD] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-sm text-[#2C221E]">{p.name}</div>
                          {p.nameMr && (
                            <div className="text-[11px] text-[#735F50] font-serif">
                              {p.nameMr}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-sm text-[#1E4D2B]">₹{p.price}</span>
                      {p.discountPrice && (
                        <span className="block text-[10px] text-gray-400 line-through">
                          ₹{p.discountPrice}
                        </span>
                      )}
                    </td>

                    {/* Pack size */}
                    <td className="py-3 px-4 font-semibold text-[#5C4A3E]">
                      {p.weight}
                    </td>

                    {/* Quick Stock Controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#D5C6B5] rounded-lg bg-[#FAF7F2] p-0.5">
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 5))}
                            title="Subtract 5 units"
                            className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded text-xs"
                          >
                            -
                          </button>
                          <span className="w-9 text-center font-bold text-xs">{p.stock}</span>
                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 5)}
                            title="Add 5 units"
                            className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Status chip */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLowStock
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Healthy'}
                        </span>
                      </div>
                    </td>

                    {/* Featured Tag Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(p.id, { featured: !p.featured })}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          p.featured
                            ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-700'
                        }`}
                      >
                        {p.featured ? '★ SHG Special' : '+ Mark Featured'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-[#5C4A3E] hover:text-[#1E4D2B] hover:bg-white rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-[#5C4A3E] hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        onSave={(data) => {
          if (editingProduct) {
            updateProduct(editingProduct.id, data);
          } else {
            addProduct(data as any);
          }
        }}
      />
    </div>
  );
};

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiSearch } from "react-icons/fi";
import { productAPI } from "../../api/products";
import { categoryAPI } from "../../api/categories";
import { formatNaira } from "../../utils/formatCurrency";
import { TableRowSkeleton } from "../../components/common/LoadingSkeleton";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";

function ProductFormModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product ? {
      name: product.name, description: product.description,
      shortDescription: product.shortDescription,
      price: product.price, discountPrice: product.discountPrice,
      category: product.category?._id, stock: product.stock,
      unit: product.unit, brand: product.brand, sku: product.sku,
      isFeatured: product.isFeatured,
    } : { unit: "piece", stock: 0 }
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, v); });
      const fileInput = document.getElementById("product-images");
      if (fileInput?.files) {
        Array.from(fileInput.files).forEach(f => formData.append("images", f));
      }

      if (isEdit) {
        await productAPI.update(product._id, formData);
        toast.success("Product updated!");
      } else {
        await productAPI.create(formData);
        toast.success("Product created!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl my-4"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name *</label>
              <input {...register("name", { required: "Name is required" })} className="input" placeholder="e.g. NPK Fertilizer 20-10-10 50kg" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
              <select {...register("category", { required: "Category is required" })} className="input">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Brand</label>
              <input {...register("brand")} className="input" placeholder="e.g. Notore, Syngenta" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₦) *</label>
              <input {...register("price", { required: "Price is required", min: 0 })} type="number" className="input" placeholder="12500" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount Price (₦)</label>
              <input {...register("discountPrice", { min: 0 })} type="number" className="input" placeholder="Leave empty if no discount" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock Quantity *</label>
              <input {...register("stock", { required: "Stock is required", min: 0 })} type="number" className="input" placeholder="100" />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
              <select {...register("unit")} className="input">
                {["piece","kg","litre","bag","set","pack","roll","metre","tonne","dozen"].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">SKU</label>
              <input {...register("sku")} className="input" placeholder="e.g. NPK-001" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input {...register("isFeatured")} type="checkbox" id="featured" className="w-4 h-4 accent-primary-600" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ Mark as Featured</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Short Description</label>
            <input {...register("shortDescription")} className="input" placeholder="One line product summary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Description *</label>
            <textarea {...register("description", { required: "Description is required" })} rows={4} className="input resize-none" placeholder="Detailed product description..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <FiUpload className="inline mr-1" /> Product Images {!isEdit && "(Required)"}
            </label>
            <input
              id="product-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="input py-2 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:text-xs file:font-medium hover:file:bg-primary-100 cursor-pointer"
            />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-2">
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button form="product-form" type="submit" onClick={handleSubmit(onSubmit)} disabled={loading} className="btn-primary flex-1">
            {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productAPI.getAdminAll({ page, limit: 15, search }),
        categoryAPI.getAll(),
      ]);
      setProducts(prodRes.data.products);
      setPagination(prodRes.data.pagination);
      setCategories(catRes.data.categories);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This action can be undone by admin.`)) return;
    try {
      await productAPI.delete(id);
      toast.success("Product deleted.");
      fetchProducts();
    } catch { toast.error("Delete failed."); }
  };

  return (
    <>
      <Helmet><title>Manage Products — Agrotech Admin</title></Helmet>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-500 text-sm">{pagination.total} products total</p>
          </div>
          <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="btn-primary">
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="input pl-10"
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRowSkeleton cols={6} rows={8} />
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">No products found.</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]?.url || "https://placehold.co/48x48"} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-white truncate max-w-[180px]">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.sku || "No SKU"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.category?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-bold text-primary-600">{formatNaira(p.discountPrice || p.price)}</span>
                          {p.discountPrice && <p className="text-xs text-gray-400 line-through">{formatNaira(p.price)}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.stock > 10 ? "text-green-600" : p.stock > 0 ? "text-yellow-600" : "text-red-500"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={p.isActive ? "badge-green" : "badge-red"}>
                          {p.isActive ? "Active" : "Hidden"}
                        </span>
                        {p.isFeatured && <span className="badge bg-yellow-100 text-yellow-700 ml-1">⭐</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditProduct(p); setShowModal(true); }}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <ProductFormModal
              product={editProduct}
              categories={categories}
              onClose={() => setShowModal(false)}
              onSaved={fetchProducts}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

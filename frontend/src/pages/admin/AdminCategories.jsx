import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { categoryAPI } from "../../api/categories";
import toast from "react-hot-toast";

function CategoryModal({ category, onClose, onSaved }) {
  const isEdit = !!category;
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: category ? { name: category.name, description: category.description, icon: category.icon, order: category.order } : { icon: "🌱", order: 0 }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      const fileInput = document.getElementById("cat-image");
      if (fileInput?.files?.[0]) formData.append("image", fileInput.files[0]);

      if (isEdit) {
        await categoryAPI.update(category._id, formData);
        toast.success("Category updated!");
      } else {
        await categoryAPI.create(formData);
        toast.success("Category created!");
      }
      onSaved(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-heading font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><FiX size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
            <input {...register("name", { required: "Name is required" })} className="input" placeholder="e.g. Fertilizers" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Icon (Emoji)</label>
            <input {...register("icon")} className="input" placeholder="🌱" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea {...register("description")} className="input resize-none" rows={3} placeholder="Category description..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
            <input {...register("order")} type="number" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category Image</label>
            <input id="cat-image" type="file" accept="image/*" className="input py-2" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data.categories);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Products in this category will be unaffected.`)) return;
    try {
      await categoryAPI.delete(id);
      toast.success("Category deleted.");
      fetchCategories();
    } catch { toast.error("Delete failed."); }
  };

  return (
    <>
      <Helmet><title>Manage Categories — Agrotech Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-gray-500 text-sm">{categories.length} categories</p>
          </div>
          <button onClick={() => { setEditCat(null); setShowModal(true); }} className="btn-primary">
            <FiPlus /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="skeleton h-10 w-10 rounded-xl mb-3" />
                <div className="skeleton h-5 w-2/3 rounded mb-2" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="card p-5 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{cat.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.description || "No description"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge-green text-xs">{cat.productCount || 0} products</span>
                      <span className={`badge text-xs ${cat.isActive ? "badge-green" : "badge-red"}`}>
                        {cat.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 ml-2">
                  <button onClick={() => { setEditCat(cat); setShowModal(true); }} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <AnimatePresence>
          {showModal && (
            <CategoryModal category={editCat} onClose={() => setShowModal(false)} onSaved={fetchCategories} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

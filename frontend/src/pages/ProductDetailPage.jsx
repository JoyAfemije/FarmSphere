import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiMinus, FiPlus, FiShare2, FiChevronRight, FiStar } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa6";
import { productAPI } from "../api/products";
import { reviewAPI } from "../api/reviews";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import { formatNaira, buildEmailProductURL } from "../utils/formatCurrency";
import ProductCard from "../components/products/ProductCard";
import { ProductDetailSkeleton } from "../components/common/LoadingSkeleton";
import toast from "react-hot-toast";

// Sub-components
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar
          key={n}
          size={16}
          className={n <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          fill={n <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function ReviewForm({ productId, onSuccess }) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to leave a review."); return; }
    setLoading(true);
    try {
      const res = await import("../api/axios").then(m => m.default.post("/reviews", { product: productId, rating, title, comment }));
      toast.success("Review submitted! Thank you. 🌟");
      setComment(""); setTitle(""); setRating(5);
      onSuccess?.(res.data.review);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="card p-6 mt-6">
      <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setRating(n)} className="focus:outline-none">
              <FiStar size={26} className={n <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} fill={n <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Review title (optional)" className="input mb-3" />
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience with this product..." rows={4} className="input mb-4 resize-none" required />
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { addItem } = useCartStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getBySlug(slug);
        setProduct(data.product);

        const [relRes, revRes] = await Promise.all([
          productAPI.getRelated(data.product._id),
          import("../api/axios").then(m => m.default.get(`/reviews/product/${data.product._id}`)),
        ]);
        setRelated(relRes.data.products);
        setReviews(revRes.data.reviews);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();
    setSelectedImg(0); setQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) return <div className="container py-12"><ProductDetailSkeleton /></div>;
  if (!product) return (
    <div className="container py-24 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
      <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
    </div>
  );

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.metaTitle || `${product.name} — FarmSphere Africa`}</title>
        <meta name="description" content={product.metaDescription || product.shortDescription || product.description?.substring(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.shortDescription || product.description?.substring(0, 160)} />
        <meta property="og:image" content={product.images?.[0]?.url} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.images?.map(i => i.url),
          "description": product.description,
          "sku": product.sku,
          "brand": { "@type": "Brand", "name": product.brand || "FarmSphere" },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "NGN",
            "price": price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          },
          "aggregateRating": product.numReviews > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.numReviews
          } : undefined
        })}</script>
      </Helmet>

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          {product.category && (
            <>
              <FiChevronRight size={14} />
              <Link to={`/products?category=${product.category._id}`} className="hover:text-primary-600 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <FiChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ── Main Product Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square max-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImg}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images?.[selectedImg]?.url || "https://placehold.co/600x600/f0fdf4/166534?text=No+Image"}
                  alt={product.images?.[selectedImg]?.alt || product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {hasDiscount && (
                <div className="absolute top-4 left-4 badge bg-red-500 text-white text-sm font-bold px-3 py-1">
                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImg === i ? "border-primary-600 shadow-green" : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="py-2">
            {product.category && (
              <Link to={`/products?category=${product.category._id}`} className="badge-green mb-3 inline-block">
                {product.category.icon} {product.category.name}
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
                <span className="text-sm text-gray-400">·</span>
                <span className="text-sm text-primary-600">{product.sold} sold</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold font-heading text-primary-600">
                {formatNaira(price)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">{formatNaira(product.price)}</span>
              )}
              {product.unit && <span className="text-sm text-gray-400">/ {product.unit}</span>}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm">
                {product.shortDescription}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `In Stock — ${product.stock} units available` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
                    disabled={qty <= 1}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-lg">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
                    disabled={qty >= product.stock}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-400">Max: {product.stock}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => addItem(product, qty)}
                disabled={product.stock === 0}
                className="btn-primary flex-1 py-3.5 text-base rounded-2xl"
              >
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <a
                href={buildEmailProductURL(product)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base transition-colors"
              >
                <FaEnvelope size={18} /> Enquire by Email
              </a>
            </div>

            {/* Share */}
            <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 transition-colors">
              <FiShare2 size={15} /> Share this product
            </button>

            {/* Key Specs */}
            {product.brand && (
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2">
                {product.brand && <div className="flex gap-2 text-sm"><span className="text-gray-500 w-24">Brand:</span><span className="font-medium text-gray-800 dark:text-white">{product.brand}</span></div>}
                {product.sku && <div className="flex gap-2 text-sm"><span className="text-gray-500 w-24">SKU:</span><span className="font-medium text-gray-800 dark:text-white">{product.sku}</span></div>}
                {product.weight && <div className="flex gap-2 text-sm"><span className="text-gray-500 w-24">Weight:</span><span className="font-medium text-gray-800 dark:text-white">{product.weight} kg</span></div>}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs: Description / Specifications / Reviews ── */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab} {tab === "reviews" && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {activeTab === "description" && (
                <div className="prose prose-green dark:prose-invert max-w-none text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {product.description}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="overflow-x-auto">
                  {product.specifications?.length > 0 ? (
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specifications.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                            <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 w-1/3">{spec.key}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400">No specifications listed for this product.</p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <div className="text-5xl mb-3">⭐</div>
                      <p className="font-medium">No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    <div className="space-y-5 mb-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="card p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                                {review.user?.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{review.user?.name}</p>
                                {review.isVerifiedPurchase && <span className="badge-green text-xs px-2 py-0.5">✓ Verified Purchase</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <StarRating rating={review.rating} />
                              <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString("en-NG")}</p>
                            </div>
                          </div>
                          {review.title && <p className="font-semibold text-sm text-gray-800 dark:text-white mb-1">{review.title}</p>}
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <ReviewForm productId={product._id} onSuccess={(r) => setReviews([r, ...reviews])} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


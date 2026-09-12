import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory } from '../../types';
import { Modal } from '../common/Modal';
import { Sparkles, Image as ImageIcon, Check, Trash2, Upload, Link as LinkIcon, X, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  editingProduct?: Product | null;
}

const SAMPLE_IMAGES = [
  { label: 'Chakli', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pickle', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80' },
  { label: 'Laddus', url: 'https://images.unsplash.com/photo-1599785209796-786432b228bc?auto=format&fit=crop&w=600&q=80' },
  { label: 'Papad', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { label: 'Masala', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' }
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct
}) => {
  const [name, setName] = useState('');
  const [nameMr, setNameMr] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Papad');
  const [price, setPrice] = useState(120);
  const [discountPrice, setDiscountPrice] = useState(140);
  const [weight, setWeight] = useState('250g');
  const [stock, setStock] = useState(25);
  const [shelfLife, setShelfLife] = useState('3 Months');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(SAMPLE_IMAGES[0].url);
  const [featured, setFeatured] = useState(false);

  // Image Upload States & Handlers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url' | 'preset'>('upload');

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      // Client-side image scaling to keep data lightweight for storage
      const img = document.createElement('img');
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL('image/jpeg', 0.85);
          setImage(optimized);
        } else {
          setImage(rawDataUrl);
        }
      };
      img.onerror = () => {
        setImage(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  useEffect(() => {
    setUploadError('');
    setIsDragging(false);
    if (editingProduct) {
      setName(editingProduct.name);
      setNameMr(editingProduct.nameMr || '');
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      setDiscountPrice(editingProduct.discountPrice || editingProduct.price);
      setWeight(editingProduct.weight);
      setStock(editingProduct.stock);
      setShelfLife(editingProduct.shelfLife);
      setDescription(editingProduct.description);
      setImage(editingProduct.image);
      setFeatured(!!editingProduct.featured);
      setImageSourceMode(editingProduct.image?.startsWith('data:') ? 'upload' : 'upload');
    } else {
      setName('');
      setNameMr('');
      setCategory('Papad');
      setPrice(120);
      setDiscountPrice(140);
      setWeight('250g');
      setStock(30);
      setShelfLife('3 Months');
      setDescription('');
      setImage(SAMPLE_IMAGES[0].url);
      setFeatured(false);
      setImageSourceMode('upload');
    }
  }, [editingProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      nameMr,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      weight,
      stock: Number(stock),
      shelfLife,
      description,
      image,
      featured,
      ingredients: editingProduct?.ingredients || ['Grain/Pulse', 'Rock Salt', 'Spices'],
      weightOptions: editingProduct?.weightOptions || [
        { weight: weight, price: Number(price), discountPrice: discountPrice ? Number(discountPrice) : undefined }
      ]
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Edit Homemade Product' : 'Add New Homemade Product'}
      subtitle="Enter details below. Your change will immediately appear in the customer shop."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Product Name (English) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Special Bhajani Chakli"
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:border-[#1E4D2B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Product Name (मराठी)
            </label>
            <input
              type="text"
              value={nameMr}
              onChange={(e) => setNameMr(e.target.value)}
              placeholder="उदा. स्पेशल खमंग भाजणी चकली"
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:border-[#1E4D2B]"
            />
          </div>
        </div>

        {/* Category & Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:border-[#1E4D2B]"
            >
              <option value="Papad">Papad (पापड)</option>
              <option value="Achar">Achar & Thecha (लोणचे)</option>
              <option value="Chakli">Chakli & Snacks (चकली व फराळ)</option>
              <option value="Laddus">Traditional Laddus (लाडू)</option>
              <option value="Masala">Nashik Spices & Masala (मसाले)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Pack Weight / Size *
            </label>
            <input
              type="text"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 250g / 500g / 1kg"
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:border-[#1E4D2B]"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              required
              min="10"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Original MRP (₹)
            </label>
            <input
              type="number"
              min="10"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Stock Quantity (Packets) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
            />
          </div>
        </div>

        {/* Shelf life and Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs font-bold text-[#2C221E] block mb-1">
              Shelf Life *
            </label>
            <input
              type="text"
              required
              value={shelfLife}
              onChange={(e) => setShelfLife(e.target.value)}
              placeholder="e.g. 3 Months"
              className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
            />
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-[#2C221E]">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#1E4D2B] rounded border-gray-300"
              />
              <span>Mark as "SHG Special / Featured" on Homepage</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-[#2C221E] block mb-1">
            Short Description *
          </label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe preparation style, key ingredients, taste profile..."
            className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E]"
          ></textarea>
        </div>

        {/* Image Selection / Add Image / URL / Presets */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#2C221E] block">
              Product Photograph *
            </label>
            <div className="flex items-center gap-1 bg-[#F0E8DC] p-0.5 rounded-xl text-[11px] font-semibold w-fit">
              <button
                type="button"
                id="photo-tab-upload"
                onClick={() => setImageSourceMode('upload')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  imageSourceMode === 'upload'
                    ? 'bg-white text-[#1E4D2B] shadow-xs'
                    : 'text-[#735F50] hover:text-[#2C221E]'
                }`}
              >
                <Upload className="w-3 h-3 text-[#C85A32]" />
                <span>Add Image</span>
              </button>
              <button
                type="button"
                id="photo-tab-url"
                onClick={() => setImageSourceMode('url')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  imageSourceMode === 'url'
                    ? 'bg-white text-[#1E4D2B] shadow-xs'
                    : 'text-[#735F50] hover:text-[#2C221E]'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Photo URL</span>
              </button>
              <button
                type="button"
                id="photo-tab-preset"
                onClick={() => setImageSourceMode('preset')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  imageSourceMode === 'preset'
                    ? 'bg-white text-[#1E4D2B] shadow-xs'
                    : 'text-[#735F50] hover:text-[#2C221E]'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Presets</span>
              </button>
            </div>
          </div>

          {/* Current Image Preview & Add / Upload Interface */}
          <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E5DACD]">
            {/* Thumbnail Preview */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-[#D5C6B5] bg-white shadow-xs">
              {image ? (
                <img
                  src={image}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-2 text-center text-[10px]">
                  <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                  <span>No Photo</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 w-full space-y-2.5">
              {/* ADD IMAGE / UPLOAD MODE */}
              {imageSourceMode === 'upload' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    isDragging
                      ? 'border-[#1E4D2B] bg-[#EDF3EE]'
                      : 'border-[#D5C6B5] hover:border-[#1E4D2B] bg-white'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="product-image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <button
                      type="button"
                      id="add-product-image-button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#1E4D2B] hover:bg-[#163E23] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Add Image</span>
                    </button>
                    <span className="text-xs text-[#735F50]">or drag & drop file here</span>
                  </div>
                  <p className="text-[10px] text-[#8C7A6B] mt-2">
                    Supports JPG, PNG, WEBP from your device (stored with product details)
                  </p>
                </div>
              )}

              {/* URL MODE */}
              {imageSourceMode === 'url' && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    id="product-image-url-input"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E] focus:border-[#1E4D2B]"
                  />
                  <p className="text-[10px] text-[#735F50]">
                    Direct URL to an online product photo.
                  </p>
                </div>
              )}

              {/* PRESET SAMPLES MODE */}
              {imageSourceMode === 'preset' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setImage(img.url)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
                          image === img.url
                            ? 'bg-[#1E4D2B] text-white border-[#1E4D2B]'
                            : 'bg-white text-[#5C4A3E] border-[#D5C6B5] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {image === img.url && <Check className="w-3 h-3" />}
                        <span>{img.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#735F50]">
                    Select a ready-made high quality Maharashtrian delicacy photo.
                  </p>
                </div>
              )}

              {/* Upload Error Message */}
              {uploadError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Status & Clear Action */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#735F50]">
                <span>
                  {image?.startsWith('data:')
                    ? '✓ Custom photo uploaded from device'
                    : image
                    ? '✓ Image selected'
                    : 'No image selected'}
                </span>
                {image && (
                  <button
                    type="button"
                    id="clear-photo-btn"
                    onClick={() => setImage('')}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Clear photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#D5C6B5] text-[#735F50] text-xs font-bold hover:bg-[#F3ECE4]"
          >
            Cancel
          </button>
          <button
            id="product-modal-save-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1E4D2B] hover:bg-[#163E23] text-white text-xs font-bold shadow-xs"
          >
            {editingProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

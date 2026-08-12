import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'USD',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');

        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 outline-none transition-colors duration-300 placeholder:text-neutral-700 focus:border-[#ff6b6b]";

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen w-full bg-black text-white selection:bg-[#ff6b6b]/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-5xl mx-auto px-6 lg:px-12 xl:px-20">

                    {/* ── Top Bar ── */}
                    <div className="pt-6 pb-0 flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-neutral-500 hover:text-[#ff6b6b] text-lg transition-colors duration-200 leading-none"
                            aria-label="Go back"
                        >
                            ←
                        </button>
                        <span
                            className="text-[10px] font-bold tracking-[0.32em] uppercase text-[#ff6b6b]"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            FYNIX
                        </span>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-6 pb-0">
                        <h1
                            className="text-3xl lg:text-4xl font-black uppercase tracking-[0.12em] leading-tight"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            New Listing
                        </h1>
                        <div className="mt-3 w-12 h-px bg-[#ff6b6b]" />
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="pt-8 pb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">

                            {/* ── LEFT COLUMN: Text Fields ── */}
                            <div className="flex flex-col gap-6">

                                {/* Product Title */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="cp-title"
                                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="cp-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className={inputClass}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="cp-description"
                                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="cp-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 outline-none transition-colors duration-300 resize-none leading-relaxed placeholder:text-neutral-700 focus:border-[#ff6b6b]"
                                    />
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Price
                                    </label>
                                    <div className="flex gap-4 items-end">
                                        {/* Amount */}
                                        <div className="flex flex-col gap-1 flex-[3]">
                                            <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-600 font-bold">Amount</span>
                                            <input
                                                id="cp-priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className={inputClass}
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex flex-col gap-1 flex-[1]">
                                            <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-600 font-bold">Currency</span>
                                            <select
                                                id="cp-priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-0 border-b border-neutral-800 text-white text-[13px] py-2 outline-none cursor-pointer appearance-none transition-colors duration-300 focus:border-[#ff6b6b]"
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} className="bg-black text-white">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN: Images ── */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label
                                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Images
                                    </label>
                                    <span className="text-[10px] text-neutral-500 font-bold">
                                        {images.length}/{MAX_IMAGES}
                                    </span>
                                </div>

                                {/* Drop Zone */}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border border-dashed px-4 py-8 lg:py-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${isDragging ? 'border-[#ff6b6b] bg-[#ff6b6b]/10' : 'border-neutral-800 hover:border-neutral-600'}`}
                                    >
                                        {/* Upload icon */}
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center border transition-colors duration-300 ${isDragging ? 'border-[#ff6b6b] text-[#ff6b6b]' : 'border-neutral-700 text-neutral-500'}`}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[12px] leading-relaxed text-neutral-400">
                                                Drop images here or{' '}
                                                <span className="text-[#ff6b6b] underline underline-offset-2">
                                                    tap to upload
                                                </span>
                                            </p>
                                            <p className="text-[9px] uppercase tracking-[0.15em] mt-1.5 text-neutral-600 font-bold">
                                                Up to {MAX_IMAGES} images
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-1">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square overflow-hidden group bg-neutral-900 border border-neutral-800"
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Remove overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[9px] font-bold tracking-widest uppercase bg-black/70 text-white"
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Submit Button ── */}
                        <div className="mt-10 lg:mt-12">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#ff6b6b] text-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: "Montserrat, sans-serif", borderRadius: 0 }}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;
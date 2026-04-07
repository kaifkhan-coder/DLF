import React, { useMemo, useState } from "react";
import { apiPost } from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Tag, 
  MapPin, 
  ArrowLeftCircleIcon, 
  Calendar, 
  FileText, 
  User, 
  Image as ImageIcon, 
  UploadCloud, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportItemPage() {
  // --- Core Logic & State (Preserved) ---
  const [type, setType] = useState("LOST");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const categories = useMemo(
    () => ["Select Category", "Electronics", "Wallet", "ID Card", "Keys", "Bottle", "Bag", "Books", "Other"],
    []
  );

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        type,
        title,
        category,
        location,
        date,
        description,
        color: "",
        image: imageBase64 || "",
        contact,
      };

      const res = await apiPost("/api/items", payload);

      setMsg(res.message || "Reported ✅ Waiting for admin verification.");
      setTimeout(() => nav("/dashboard"), 800);
    } catch (err) {
      setError(err?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => nav("/admin");
  const isLost = type === "LOST";

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
if (file.size > 1 * 1024 * 1024) {
  setError("Image too large. Max 1MB.");
  return;
}

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");
    setImageBase64("");
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, rotateX: 10, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      rotateX: 0, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 60, damping: 15, mass: 1 } 
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, type: "spring", stiffness: 100 }
    })
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 perspective-1000 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Panel: Visual & Info */}
        <div className={`relative p-8 md:w-1/3 flex flex-col justify-between transition-colors duration-500 ${isLost ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
          <div className="z-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium mb-8"
            >
              <ArrowLeftCircleIcon size={20} /> Back
            </button>
            <motion.h1 
              key={type} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="text-4xl font-black text-white mb-2 tracking-tight"
            >
              {isLost ? "Lost Item" : "Found Item"}
            </motion.h1>
            <p className="text-white/80 font-medium leading-relaxed">
              {isLost 
                ? "Help us help you. Provide details to track down your belongings." 
                : "Thank you for your honesty. Let's get this item back to its owner."}
            </p>
          </div>

          {/* 3D Illustration Placeholder */}
          <div className="relative h-48 w-full mt-8 flex items-center justify-center">
             <motion.div 
               animate={{ rotateY: [0, 10, -10, 0], rotateX: [0, 5, -5, 0] }}
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="text-white/20"
             >
               {isLost ? <AlertCircle size={120} /> : <CheckCircle2 size={120} />}
             </motion.div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="p-8 md:w-2/3 overflow-y-auto max-h-[90vh]">
          <form onSubmit={submit} className="space-y-6">
            
            {/* Type Toggle 3D Switch */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl relative shadow-inner">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl shadow-sm ${isLost ? 'left-1.5 bg-white' : 'left-[50%] bg-white'}`}
              />
              <button
                type="button"
                onClick={() => setType("LOST")}
                className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-xl transition-colors ${isLost ? 'text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Lost Something
              </button>
              <button
                type="button"
                onClick={() => setType("FOUND")}
                className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-xl transition-colors ${!isLost ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Found Something
              </button>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {msg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> {msg}
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Upload */}
            <motion.div variants={fieldVariants} custom={0} initial="hidden" animate="visible">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Photo</label>
              <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50/30">
                {!preview ? (
                  <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                    <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">Click to upload image</span>
                    <span className="text-xs text-slate-400 mt-1">Max 1MB (Optional)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
                  </label>
                ) : (
                  <div className="relative h-48 w-full">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 cursor-pointer text-white transition">
                        <UploadCloud size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
                      </label>
                      <button type="button" onClick={removeImage} className="p-2 bg-rose-500/80 backdrop-blur-md rounded-full hover:bg-rose-600 text-white transition">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField 
                custom={1} 
                label="Item Title" 
                icon={<Tag size={16} />} 
                value={title} 
                onChange={setTitle} 
                placeholder="e.g. Black Wallet" 
              />
              
              <motion.div variants={fieldVariants} custom={2} initial="hidden" animate="visible">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Tag size={14} /> Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c === "Select Category" ? "" : c} disabled={c === "Select Category"}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </motion.div>

              <InputField 
                custom={3} 
                label="Location" 
                icon={<MapPin size={16} />} 
                value={location} 
                onChange={setLocation} 
                placeholder="Where was it?" 
              />
              
              <motion.div variants={fieldVariants} custom={4} initial="hidden" animate="visible">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Calendar size={14} /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </motion.div>

              <div className="md:col-span-2">
                <motion.div variants={fieldVariants} custom={5} initial="hidden" animate="visible">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    <FileText size={14} /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Provide identifiable features..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                  />
                </motion.div>
              </div>

              <div className="md:col-span-2">
                <InputField 
                  custom={6} 
                  label="Your Name / ID" 
                  icon={<User size={16} />} 
                  value={contact} 
                  onChange={setContact} 
                  placeholder="Name / Roll No" 
                />
              </div>
            </div>

            <motion.button
              variants={fieldVariants}
              custom={7}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full h-14 mt-6 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLost ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Submit Report"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// Helper Component for Inputs with Animation
function InputField({ label, icon, value, onChange, placeholder, custom }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: custom * 0.05 } }
      }}
      initial="hidden"
      animate="visible"
    >
      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {icon} {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
      />
    </motion.div>
  );
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

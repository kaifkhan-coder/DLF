import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Search,
  MapPin,
  Tag,
  Loader2,
  LayoutGrid,
  AlertCircle,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { apiGet } from "../services/api";
import TiltCard from "./TiltCardUser";

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    VERIFIED: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
    RETURNED: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
    DEFAULT: "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20",
  };

  const activeStyle = styles[status] || styles.DEFAULT;

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ring-1 shadow-sm",
        activeStyle
      )}
    >
      {status}
    </span>
  );
};

const DashboardItem = ({ item }) => {
  return (
    <TiltCard className="h-full rounded-3xl">
      <Link
        to={`/item/${item._id}`}
        className="group relative flex flex-col h-full bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-500"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image Section */}
        <div
          className="relative h-48 overflow-hidden bg-slate-100"
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={item.image || `https://picsum.photos/seed/${item._id}/800/500`}
            className="w-full h-full object-cover"
            alt={item.title}
          />
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={item.status} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div
          className="p-5 flex flex-col flex-1 bg-white/50 backdrop-blur-sm"
          style={{ transform: "translateZ(10px)" }}
        >
          <div className="mb-3">
            <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <Tag className="w-3 h-3" /> {item.category}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </TiltCard>
  );
};

// --- Main Dashboard ---

export default function UserDashboard() {
  // Logic Preservation
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [enter, setEnter] = useState(false);
  const [user1, setUser1] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/api/items/my");
        setMyItems(Array.isArray(data) ? data : data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiGet("/api/users/me");
        setUser1(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch (e) {
        console.log("loadUser error:", e.message);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setEnter(true);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 50, damping: 15 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 40, damping: 12 },
    },
  };

  return (
    <motion.div
      className="min-h-screen p-4 md:p-8 font-sans text-slate-900 bg-slate-50"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage: "linear-gradient(120deg, #f0f9ff, #f0fdf4, #fffbeb)",
        backgroundSize: "200% 200%",
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <motion.header
          variants={headerVariants}
          className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-xl shadow-slate-200/40"
        >
          {/* Decorative background blob */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <Link
              to="/profile"
              className="group relative"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <img
                src={user1?.profileImage || "/avatar.png"}
                className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                alt="profile"
              />
            </Link>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-0.5">
                Welcome back
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user1?.name || "User"}
              </h1>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-1 relative z-10">
            <p className="text-slate-500 font-medium">
              Logged in as <span className="text-blue-600 font-bold">{user?.name || "User"}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Link>
              <Link
                to="/report"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Report Item</span>
              </Link>
              <Link
                to="/items"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Browse</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-100 hover:bg-rose-100 hover:border-rose-200 transition-all active:scale-95 ml-auto md:ml-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content Section */}
        <motion.section
          variants={containerVariants}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Reports</h2>
              <p className="text-sm text-slate-500">Manage your lost and found posts</p>
            </div>
          </div>

          <div className="min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 rounded-3xl bg-white/40 border border-white/50 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                <p className="text-slate-500 font-medium animate-pulse">Loading your items...</p>
              </div>
            ) : myItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-80 bg-white/60 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-300 text-center p-8"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <AlertCircle className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No items reported yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-8">
                  Have you lost or found something? Create your first report to get started.
                </p>
                <Link
                  to="/report"
                  className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  Create Report &rarr;
                </Link>
              </motion.div>
            ) : (
              <motion.div
                layout
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {myItems.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      layout
                    >
                      <DashboardItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import CustomSelect from "../Select";
import { LuCircleCheckBig, LuLoaderCircle } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  idea: string;
  message: string;
}

export default function CollaboratePanel({ isOpen, onClose }: Props) {
  const [emailSent, setEmailSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    idea: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-close panel after sending
  useEffect(() => {
    if (!emailSent) return;
    const timer = setTimeout(() => {
      onClose();
      setEmailSent(false);
      setErrorMsg(null);
      setFormData({ name: "", email: "", idea: "", message: "" });
    }, 1800);
    return () => clearTimeout(timer);
  }, [emailSent, onClose]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setErrorMsg(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data?.emailSent) {
        setEmailSent(true);
      } else {
        setErrorMsg(data?.error || "Failed to dispatch. Please check your network.");
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          {/* Backdrop with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md"
          />

          {/* Glass Command Dialogue - Smooth Bottom Slide-Up Transition */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#090b12]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-slate-900 dark:text-white"
          >
            {/* Mobile Sheet Handle Bar */}
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-1 mb-4 sm:hidden flex-shrink-0" />

            {/* Header Telemetry Pill */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  // INITIATE TRANSMISSION
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-5">
              <h3 className="font-space text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {emailSent ? "Dispatch Transmitted" : "Send Direct Dispatch"}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {emailSent
                  ? "Your message was sent successfully. I will follow up shortly."
                  : "Have a product, architectural challenge, or engineering opportunity? Let's connect."}
              </p>
            </div>

            {/* Content Area */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {emailSent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                      <LuCircleCheckBig />
                    </div>
                    <div>
                      <h4 className="font-space text-lg font-bold">Signal Locked & Received</h4>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                        Closing terminal...
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSend}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                        Your Identity
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Gokul or Company"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                        Direct Email
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                        Inquiry Scope
                      </label>
                      <CustomSelect
                        selected={formData.idea}
                        onSelect={(value) =>
                          setFormData({ ...formData, idea: value })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                        Brief & Objectives
                      </label>
                      <textarea
                        required
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Briefly describe the product, problem space, or role..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="font-mono text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-2 rounded-xl">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !formData.name || !formData.email || !formData.message}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-mono text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <LuLoaderCircle className="animate-spin text-base" />
                          <span>Routing Dispatch...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Dispatch</span>
                          <HiOutlineRocketLaunch className="text-base" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useState } from "react";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { useFirebase } from "../../context/firebaseContext";
import { MdOutlineAddCircle, MdClose } from "react-icons/md";

const db = getDatabase();

const UserOwnHelpCard = () => {
  const { user } = useFirebase();
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    location: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    requirements: [],
  });
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, currentRequirement.trim()],
      });
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!formData.title || !user) return alert("Please add a title");

    const min = Number(formData.minPrice);
    const max = Number(formData.maxPrice);

    if (min > max && max !== 0) {
      return alert("Minimum price cannot be higher than maximum price");
    }

    setIsPosting(true);
    try {
      const requestsRef = ref(db, "helpRequests");
      await push(requestsRef, {
        ...formData,
        minPrice: formData.minPrice || "0",
        maxPrice: formData.maxPrice || "0",
        userId: user.uid,
        userName: user.email.split("@")[0],
        createdAt: serverTimestamp(),
      });
      setFormData({
        title: "",
        category: "Other",
        location: "",
        description: "",
        minPrice: "",
        maxPrice: "",
        requirements: [],
      });
    } catch (err) {
      console.error("Error posting:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const inputClasses =
    "bg-zinc-800 border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-1 ring-blue-500 transition-all text-sm";

  return (
    <form
      onSubmit={handlePost}
      className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 mb-8 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
          <MdOutlineAddCircle size={26} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Need a Hand?
          </h2>
          <p className="text-xs text-zinc-400">
            Set your budget range and post your request.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What do you need help with?"
          className={`w-full ${inputClasses}`}
        />

        <textarea
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe your situation..."
          className={`w-full ${inputClasses} min-h-25 resize-none`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Location"
            className={inputClasses}
          />

          <div className="flex gap-2">
            <input
              type="text"
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addRequirement())
              }
              placeholder="Add requirement..."
              className={`${inputClasses} flex-1`}
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </div>

        {formData.requirements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-zinc-800/50 border border-white/10 px-3 py-2 rounded-lg text-sm text-zinc-300"
              >
                <span>{req}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Budget Range (USD)
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">
                $
              </span>
              <input
                required
                type="number"
                value={formData.minPrice}
                onChange={(e) =>
                  setFormData({ ...formData, minPrice: e.target.value })
                }
                placeholder="Min"
                className={`${inputClasses} w-full pl-8`}
              />
            </div>
            <span className="text-zinc-600 font-bold">—</span>
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">
                $
              </span>
              <input
                required
                type="number"
                value={formData.maxPrice}
                onChange={(e) =>
                  setFormData({ ...formData, maxPrice: e.target.value })
                }
                placeholder="Max"
                className={`${inputClasses} w-full pl-8`}
              />
            </div>
          </div>
        </div>

        <button
          disabled={isPosting}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
        >
          {isPosting ? "Posting..." : "Post Request"}
        </button>
      </div>
    </form>
  );
};

export { UserOwnHelpCard };

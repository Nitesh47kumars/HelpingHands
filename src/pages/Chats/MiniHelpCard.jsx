import React from "react";
import { MdLocationOn, MdAttachMoney, MdCheckCircle } from "react-icons/md";

const MiniHelpCard = ({ cardData }) => {
  if (!cardData) return null;

  return (
    <div className="mt-2 bg-zinc-800/50 border border-zinc-700 rounded-xl p-2 sm:p-3 max-w-xs sm:max-w-sm">
      {/* Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
        <h4 className="font-bold text-white text-xs sm:text-sm truncate">
          {cardData.title}
        </h4>
      </div>

      {/* Location & Category */}
      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-400 mb-1.5 sm:mb-2 flex-wrap">
        <div className="flex items-center gap-1">
          <MdLocationOn size={10} className="sm:w-3 sm:h-3 text-blue-400" />
          <span className="truncate max-w-25">{cardData.location}</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <span className="bg-zinc-700/50 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px]">
          {cardData.category}
        </span>
      </div>

      {/* Requirements */}
      {cardData.requirements && cardData.requirements.length > 0 && (
        <div className="mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold mb-1">
            <MdCheckCircle size={9} className="sm:w-2.5 sm:h-2.5 text-emerald-400" />
            Requirements
          </div>
          <div className="flex flex-wrap gap-1">
            {cardData.requirements.slice(0, 2).map((req, index) => (
              <span
                key={index}
                className="text-[9px] sm:text-[10px] bg-zinc-900/50 border border-zinc-700 px-1.5 sm:px-2 py-0.5 rounded text-zinc-300 truncate max-w-30"
              >
                {req}
              </span>
            ))}
            {cardData.requirements.length > 2 && (
              <span className="text-[9px] sm:text-[10px] text-zinc-500">
                +{cardData.requirements.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Budget */}
      <div className="pt-1.5 sm:pt-2 border-t border-zinc-700 flex items-center justify-between">
        <span className="text-[8px] sm:text-[9px] text-zinc-500 uppercase font-bold">
          Budget
        </span>
        <div className="flex items-center text-emerald-400 font-bold text-xs sm:text-sm">
          <MdAttachMoney size={12} className="sm:w-3.5 sm:h-3.5 -ml-1" />
          <span>${cardData.minPrice} - ${cardData.maxPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default MiniHelpCard;
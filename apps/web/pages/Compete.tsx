import React, { useMemo, useState } from "react";
import { motion as motionBase } from "framer-motion";
import { Filter, Trophy, Users, Clock, ArrowRight, Flame } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { unwrapData, formatCurrency } from "../lib/apiHelpers";
import {
  fallbackCompetitions,
  normalizeCompetitionList,
  type CompetitionCard,
} from "../lib/healthData";

const motion = motionBase as any;
const filters = ["All", "Strength", "Cardio", "Steps", "Endurance", "Wellness"];

interface CompeteProps {
  onOpenCompetition: (id: string) => void;
}

export const Compete: React.FC<CompeteProps> = ({ onOpenCompetition }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const queryClient = useQueryClient();

  const { data: competitionsResponse, isLoading } = useQuery({
    queryKey: ["web-competitions"],
    queryFn: () => api.getCompetitions().catch(() => null),
  });

  const competitions = useMemo(
    () => normalizeCompetitionList(unwrapData<any[]>(competitionsResponse)),
    [competitionsResponse]
  );
  const filteredCompetitions =
    selectedFilter === "All"
      ? competitions
      : competitions.filter(
          (c) => c.category.toLowerCase() === selectedFilter.toLowerCase()
        );

  const joinMutation = useMutation({
    mutationFn: (id: string) => api.joinCompetition(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["web-competitions"] }),
  });

  const handleJoin = (event: React.MouseEvent, comp: CompetitionCard) => {
    event.stopPropagation();
    if (comp.live) joinMutation.mutate(comp.id);
    else onOpenCompetition(comp.id);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-fuchsia-500 dark:text-fuchsia-300 font-black uppercase tracking-[0.35em] text-xs mb-3">
            Live competitions
          </p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
            Battle Arena
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-3 max-w-2xl">
            Join fitness challenges, chase prize pools, and climb the leaderboard with real competitors.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black text-sm transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {fallbackCompetitions.filter((item) => item.live).length} Live Battles
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-[2rem] p-10 text-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-slate-400 font-bold transition-colors">
          Loading competitions...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompetitions.map((competition, index) => (
            <motion.button
              key={competition.id}
              onClick={() => onOpenCompetition(competition.id)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, scale: 1.02 }}
              // Make card fill row height and use flex column layout
              className="h-full flex flex-col group relative text-left rounded-[2.5rem] overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
            >
              {/* Header – always same height */}
              <div className="p-6 bg-gradient-to-br from-purple-500 via-fuchsia-600 to-rose-500 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-white/80">
                      {competition.category}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-md mt-1">
                      {competition.title}
                    </h2>
                  </div>
                  {competition.live && (
                    <span className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-black backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                      </span>
                      LIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Body – flex-1 to expand and push footer down */}
              <div className="flex-1 flex flex-col p-6 space-y-6 bg-white dark:bg-white/5">
                {/* Metrics always at top */}
                <div className="grid grid-cols-3 gap-4">
                  <Metric icon={<Trophy size={18} />} label="Prize Pool" value={competition.prize} highlight />
                  <Metric icon={<Users size={18} />} label="Participants" value={competition.participants.toLocaleString()} />
                  <Metric icon={<Clock size={18} />} label={competition.live ? "Ends In" : "Starts In"} value={competition.time} />
                </div>

                {/* Description (if any) – will take up available space */}
                {competition.description && (
                  <p className="text-gray-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                    {competition.description}
                  </p>
                )}

                {/* Entry fee + button – pushed to bottom */}
                <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-slate-400">
                    <Flame size={16} className="text-amber-500" />
                    Entry: {competition.entryFee ? formatCurrency(competition.entryFee) : "Free"}
                  </div>
                  <button
                    onClick={(event) => handleJoin(event, competition)}
                    disabled={joinMutation.isPending}
                    className="relative overflow-hidden px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black flex items-center gap-2 disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {competition.live ? "Join Battle" : "View Details"}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  </button>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredCompetitions.length === 0 && (
        <div className="rounded-[2rem] p-10 text-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 transition-colors">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-slate-400 mb-4">
            <Filter size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">No battles in this category</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Try another filter or check back when the next competition opens.
          </p>
        </div>
      )}
    </div>
  );
};

/** Metric card – clean and crisp */
function Metric({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        highlight
          ? "bg-amber-500/5 border-amber-500/20 dark:bg-amber-500/10"
          : "bg-gray-100/80 dark:bg-slate-900/40 border-gray-200 dark:border-white/5"
      }`}
    >
      <div className={highlight ? "text-amber-500" : "text-emerald-600 dark:text-emerald-300"}>
        {icon}
      </div>
      <div className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest mt-2">
        {label}
      </div>
      <div
        className={`text-xl font-black mt-1 ${
          highlight
            ? "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Zap, 
  Clock, 
  Crosshair, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  SlidersHorizontal,
  CloudRain,
  X,
  Cpu
} from 'lucide-react';

export default function CloudburstEventCard({
  event,
  riskPercent,
  onFocusEpicenter,
  onOpenAdvisory,
  onSelectPreset,
  activePresetKey = 'kedarnath',
  onClose,
  className = ""
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!event) return null;

  const displayRisk = riskPercent ?? event.metrics?.riskPercent ?? 95;
  const isCritical = event.status === 'CRITICAL' || displayRisk >= 80;

  return (
    <aside 
      className={`select-none pointer-events-auto transition-all duration-300 z-30 ${className}`}
      aria-label="Demo cloudburst scenario"
    >
      <div className="w-[330px] sm:w-[370px] bg-[#0c1524]/92 backdrop-blur-xl border border-red-500/40 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.35)] overflow-hidden">
        {/* Top Emergency Status Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-3.5 py-1.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="text-[11px] font-mono font-black tracking-wider uppercase">
              {isCritical ? 'DEMO · CRITICAL SCENARIO' : 'DEMO · HIGH-RISK SCENARIO'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 text-amber-300 font-mono text-[10px] font-black border border-white/20">
              {displayRisk}% DEMO RISK
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? "Collapse demo scenario" : "Expand demo scenario"}
              className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Dismiss demo scenario"
                className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsed Compact View */}
        {!isExpanded && (
          <div className="px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                {event.locationName}
              </span>
              <span className="text-[10px] font-mono text-red-300">
                <span className="font-bold text-amber-300 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-500/30 mr-1.5">{displayRisk}% demo risk</span>
                Demo rain rate: {event.metrics?.predictedRainRateMmh} mm/h • Demo timing: {event.leadTimeMinutes}m
              </span>
            </div>
            <button
              type="button"
              onClick={onFocusEpicenter}
              className="px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow"
            >
              <Crosshair className="w-3 h-3" />
              Focus
            </button>
          </div>
        )}

        {/* Expanded Full Mission Control Telemetry */}
        {isExpanded && (
          <div className="p-3.5 flex flex-col gap-3">
            {/* Location & Time Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 tracking-tight">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{event.locationName}</span>
                </h3>
                <p className="text-[11px] text-slate-300 pl-5">
                  Elevation: <span className="font-mono text-white">{event.elevationMeters}m</span> • Sector: {event.state}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs font-mono font-black text-white">{displayRisk}% DEMO RISK</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Simulated scenario · not backend ML
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">
                  Demo scenario time {event.detectedAt}
                </span>
              </div>
            </div>

            {/* Key Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
              {/* Rain Rate */}
              <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-cyan-400" />
                  Simulated Peak Rain Rate
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-mono font-black text-white">
                    {event.metrics.predictedRainRateMmh}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">mm/h</span>
                </div>
                <span className="text-[9px] text-rose-400 font-semibold mt-0.5">
                  Scenario reference: &gt;100 mm/h
                </span>
              </div>

              {/* Early Warning Lead Time */}
              <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Simulated Warning Timing
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-mono font-black text-amber-300">
                    ~{event.leadTimeMinutes}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">mins</span>
                </div>
                <span className="text-[9px] text-amber-400/90 font-semibold mt-0.5">
                  Demo timing only · not an evacuation window
                </span>
              </div>

              {/* CAPE Energy */}
              <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  Simulated CAPE Scenario
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-mono font-bold text-yellow-300">
                    {event.metrics.capeJkg}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">J/kg</span>
                </div>
                <span className="text-[9px] text-yellow-400/80 font-medium">Demo scenario value</span>
              </div>

              {/* Pressure Collapse */}
              <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-[10px] font-medium text-slate-400">
                  Simulated Pressure Drop (ΔP)
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-mono font-bold text-rose-300">
                    -{event.metrics.pressureDropHpa}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">hPa/3h</span>
                </div>
                <span className="text-[9px] text-rose-400/80 font-medium">Demo scenario value</span>
              </div>
            </div>

            {/* Affected River Drainage Corridors */}
            <div className="flex flex-col gap-1 text-[11px]">
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                Demo scenario drainage areas ({event.hazardRadiusKm} km illustration):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {event.affectedBasins.map((basin) => (
                  <span 
                    key={basin}
                    className="px-2 py-0.5 rounded-md bg-red-950/60 text-red-200 border border-red-500/30 text-[10px] font-medium"
                  >
                    {basin}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo advisory is illustrative and not operational guidance. */}
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-2.5 text-[11px] text-red-100 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="leading-tight font-medium">
                DEMO ADVISORY — NOT OPERATIONAL GUIDANCE: {event.advisory}
              </p>
            </div>

            {/* Action Bar & Preset Selector */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onFocusEpicenter}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                Focus Epicenter
              </button>

              {/* Event Scenario Switcher (Lets user or evaluator toggle between events) */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => onSelectPreset?.('kedarnath')}
                  title="Load Kedarnath demo scenario"
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activePresetKey === 'kedarnath'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Kedarnath
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPreset?.('dharamshala')}
                  title="Load Dharamshala demo scenario"
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activePresetKey === 'dharamshala'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dharamshala
                </button>
              </div>
            </div>

            {/* Backend ML Integration Contract Info */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-2 px-0.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold">Backend rainfall estimate:</span>
              </div>
              <span className="font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 text-[9px]">
                Separate panel above
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

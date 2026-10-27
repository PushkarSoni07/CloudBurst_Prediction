import { Loader2, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThreatAnalyticsPanel({
  station = null,
  backendPrediction = null,
  backendPredictionStatus = 'loading',
  backendPredictionError = null,
  backendPredictionStale = false,
  onRefreshBackendPrediction,
  onClose
}) {
  const score = backendPrediction?.predicted_probability;
  const threshold = backendPrediction?.threshold;
  const location = backendPrediction?.location;
  const locationLabel = Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude)
    ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    : station?.name || 'Selected location';
  const isLoading = backendPredictionStatus === 'loading' || backendPredictionStatus === 'refreshing';

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-72 sm:w-80 flex flex-col gap-2.5 select-none z-20 text-slate-100"
    >
      <section className="apple-liquid-glass rounded-3xl p-4 relative overflow-hidden flex flex-col gap-3 shadow-2xl">
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-cyan-200">Backend ML Prediction</h2>
            <p className="mt-1 text-[10px] text-slate-300">
              Next-day extreme-rainfall estimate · {locationLabel}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRefreshBackendPrediction}
              disabled={isLoading}
              className="apple-liquid-glass-pill flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] text-slate-200 hover:text-white disabled:opacity-50 cursor-pointer"
              title="Refresh backend prediction"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Refresh
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="apple-liquid-glass-pill p-1 rounded-full text-slate-300 hover:text-white cursor-pointer"
                title="Hide panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {isLoading && !backendPrediction && (
          <div role="status" className="flex items-center gap-2 py-3 text-[10px] text-slate-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-300" />
            Fetching weather and calculating the selected-location estimate…
          </div>
        )}

        {backendPredictionStatus === 'error' && !backendPrediction && (
          <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-950/30 p-3 text-[10px] leading-relaxed text-rose-200">
            Could not calculate a backend estimate: {backendPredictionError || 'The request failed.'}
          </p>
        )}

        {backendPrediction && (
          <div className="flex flex-col gap-2">
            {backendPredictionError && (
              <p role="alert" className="rounded-lg border border-amber-400/20 bg-amber-950/30 p-2 text-[9px] text-amber-200">
                Refresh failed; showing the previous result. {backendPredictionError}
              </p>
            )}
            {backendPredictionStatus === 'refreshing' && (
              <p role="status" className="text-[9px] text-cyan-200">Updating estimate for this location…</p>
            )}

            <div className="apple-liquid-glass-well rounded-2xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-400">
                    Uncalibrated model score · probability estimate
                  </p>
                  <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-white">
                    {Number.isFinite(score) ? `${(score * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <span className="rounded-full px-2 py-1 text-[9px] font-semibold border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
                  {backendPrediction.risk_label || 'Model result'}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-2 text-[9px]">
                <div>
                  <span className="text-slate-400">Feature date</span>
                  <p className="font-mono text-slate-100">{backendPrediction.feature_date || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Target date</span>
                  <p className="font-mono text-slate-100">{backendPrediction.target_date || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Decision threshold</span>
                  <p className="font-mono text-slate-100">
                    {Number.isFinite(threshold) ? `${(threshold * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Response status</span>
                  <p className={backendPredictionStale ? 'font-semibold text-amber-200' : 'text-emerald-200'}>
                    {backendPredictionStale ? 'Stale · previous result' : 'Latest response'}
                  </p>
                </div>
              </div>
            </div>

            {backendPredictionStale && (
              <p role="status" className="rounded-lg border border-amber-400/20 bg-amber-950/30 p-2 text-[9px] leading-relaxed text-amber-200">
                The latest request failed; this is the previous result for these coordinates.
              </p>
            )}

            {Array.isArray(backendPrediction.top_factors) && backendPrediction.top_factors.length > 0 && (
              <div className="apple-liquid-glass-well rounded-2xl p-3">
                <h3 className="mb-2 text-[10px] font-semibold text-slate-200">
                  Model score factors · not causal explanations
                </h3>
                <div className="flex flex-col gap-2">
                  {backendPrediction.top_factors.map((factor, index) => (
                    <div key={`${factor.feature}-${index}`} className="flex items-start justify-between gap-3 text-[9px]">
                      <span className="min-w-0 truncate text-slate-300" title={factor.feature}>
                        {factor.feature}
                      </span>
                      <span className="shrink-0 text-right font-mono text-slate-100">
                        value {factor.value ?? 'N/A'} · contribution {factor.contribution ?? 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(backendPrediction.warnings) && backendPrediction.warnings.length > 0 && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-950/20 p-2.5">
                <p className="mb-1 text-[9px] font-semibold text-amber-200">Data-quality and scope warnings</p>
                {backendPrediction.warnings.map((warning, index) => (
                  <p key={`${index}-${warning}`} className="text-[9px] leading-relaxed text-amber-100/80">{warning}</p>
                ))}
              </div>
            )}

            {backendPrediction.model_scope && (
              <p className="text-[9px] leading-relaxed text-slate-400">{backendPrediction.model_scope}</p>
            )}
            {backendPrediction.note && (
              <p className="text-[9px] leading-relaxed text-amber-200/80">{backendPrediction.note}</p>
            )}
          </div>
        )}

        <p className="text-[9px] leading-relaxed text-slate-400">
          This is an uncalibrated next-day extreme-rainfall model score, not a cloudburst detection or evacuation recommendation.
          The model was trained for the Dehradun region; validity elsewhere has not been established.
        </p>
      </section>
    </motion.aside>
  );
}

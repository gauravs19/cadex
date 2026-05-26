import React from 'react';
import { EFFORT_PROFILES } from '../../data/effortHeuristics';
import type { EffortProfile } from '../../data/effortHeuristics';
import type { Duration, DealSize } from '../../types';

interface Props {
  workCategory: string;
  duration: string;
  dealSize: string;
}

const DURATION_ORDER: Duration[] = ['lt3m', '3-6m', '6-12m', 'gt12m'];
const DEAL_SIZE_ORDER: DealSize[] = ['lt100k', '100k-500k', '500k-2m', 'gt2m'];

function durationDistance(a: Duration, b: Duration): number {
  return Math.abs(DURATION_ORDER.indexOf(a) - DURATION_ORDER.indexOf(b));
}

function dealSizeDistance(a: DealSize, b: DealSize): number {
  return Math.abs(DEAL_SIZE_ORDER.indexOf(a) - DEAL_SIZE_ORDER.indexOf(b));
}

function findBestProfile(
  workCategory: string,
  duration: string,
  dealSize: string
): EffortProfile | null {
  const categoryMatches = EFFORT_PROFILES.filter(
    (p) => p.workCategory === workCategory
  );
  if (categoryMatches.length === 0) return null;

  const dur = duration as Duration;
  const size = dealSize as DealSize;

  let best: EffortProfile | null = null;
  let bestScore = Infinity;

  for (const profile of categoryMatches) {
    const dDist = durationDistance(profile.duration, dur);
    const sDist = dealSizeDistance(profile.dealSize, size);
    const score = dDist + sDist;
    if (score < bestScore) {
      bestScore = score;
      best = profile;
    }
  }

  return best;
}

function formatFte(fte: number): string {
  if (fte === Math.floor(fte)) return `× ${fte}`;
  return `× ${fte}`;
}

const EffortEstimator: React.FC<Props> = ({ workCategory, duration, dealSize }) => {
  if (!workCategory || !duration || !dealSize) {
    return null;
  }

  const profile = findBestProfile(workCategory, duration, dealSize);

  if (!profile) {
    return (
      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs text-slate-400 italic">
          No team composition estimate available for this work type.
        </p>
      </div>
    );
  }

  const isExactMatch =
    profile.duration === duration && profile.dealSize === dealSize;

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Indicative Team Composition
        </span>
        <span className="text-xs text-blue-400 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
          benchmark only
        </span>
      </div>

      {!isExactMatch && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mb-3">
          No exact match — showing closest profile ({profile.duration} / {profile.dealSize}).
        </p>
      )}

      {/* Headline */}
      <p className="text-sm font-semibold text-blue-900 mb-3">{profile.headline}</p>

      {/* Roles grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {profile.roles.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg px-3 py-2 text-sm"
          >
            <span className="text-slate-700 font-medium truncate">{r.role}</span>
            <span className="ml-auto text-blue-600 font-semibold whitespace-nowrap">
              {formatFte(r.fte)}
            </span>
          </div>
        ))}
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-1.5 bg-white border border-blue-100 rounded-full px-3 py-1">
          <span className="text-xs text-slate-500">Sprints</span>
          <span className="text-xs font-semibold text-blue-700">
            {profile.sprintRange[0]}–{profile.sprintRange[1]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-blue-100 rounded-full px-3 py-1">
          <span className="text-xs text-slate-500">Person-days</span>
          <span className="text-xs font-semibold text-blue-700">
            {profile.peopleDaysRange[0].toLocaleString()}–{profile.peopleDaysRange[1].toLocaleString()}
          </span>
        </div>
      </div>

      {/* Daily rate range */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500">Blended daily rate benchmark</span>
        <span className="text-xs font-semibold text-blue-700">
          ${profile.dailyRateRangeUSD[0].toLocaleString()} – ${profile.dailyRateRangeUSD[1].toLocaleString()} / day
        </span>
      </div>

      {/* Caveats */}
      {profile.caveats.length > 0 && (
        <ul className="mb-3 space-y-1">
          {profile.caveats.map((c, i) => (
            <li key={i} className="text-xs text-slate-500 italic flex gap-1.5">
              <span className="text-slate-400 mt-px">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer note */}
      <p className="text-xs text-blue-500 border-t border-blue-200 pt-2 mt-2">
        Populate bid economics above with your actuals — this is a starting reference only.
      </p>
    </div>
  );
};

export default EffortEstimator;

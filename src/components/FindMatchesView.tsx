import React, { useState } from 'react';
import { Match, SkillLevel, MatchFormat } from '../types';

interface FindMatchesViewProps {
  matches: Match[];
  onChallengeMatch: (match: Match) => void;
  onBookmarkMatch: (matchId: string) => void;
  onCreateMatchClick: () => void;
}

export const FindMatchesView: React.FC<FindMatchesViewProps> = ({
  matches,
  onChallengeMatch,
  onBookmarkMatch,
  onCreateMatchClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [levelFilter, setLevelFilter] = useState<SkillLevel | 'ALL'>('ALL');
  const [formatFilter, setFormatFilter] = useState<MatchFormat | 'ALL'>('ALL');
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [selectedMapMatch, setSelectedMapMatch] = useState<Match | null>(null);

  // Filter matches defensively
  const filteredMatches = matches.filter((match) => {
    const teamName = match.teamName || '';
    const venue = match.venue || '';
    
    const matchesQuery =
      teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const distance = match.distanceKm ?? 0;
    const matchesDistance = distance <= selectedRadius;
    const matchesLevel = levelFilter === 'ALL' || match.level === levelFilter;
    const matchesFormat = formatFilter === 'ALL' || match.format === formatFilter;

    return matchesQuery && matchesDistance && matchesLevel && matchesFormat;
  });

  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Sticky Search & Filters Header */}
      <div className="sticky top-16 z-40 bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#171f33] px-4 py-3 flex flex-col gap-3 shadow-md">
        {/* Search row & Radius filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf] text-xl group-focus-within:text-[#4edea3] transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, venues..."
              className="w-full bg-[#222a3d] border border-[#2d3449] text-[#dae2fd] placeholder:text-[#bbcabf]/70 font-normal text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] transition-all h-[48px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbcabf] hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setShowRadiusModal(true)}
            className="flex items-center justify-center bg-[#222a3d] border border-[#2d3449] rounded-xl h-[48px] px-3.5 gap-1.5 text-[#dae2fd] hover:text-[#4edea3] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-lg text-[#4edea3]">tune</span>
            <span className="text-xs font-bold tracking-wider whitespace-nowrap">
              {selectedRadius} KM
            </span>
          </button>
        </div>

        {/* Quick Skill & Format Chips */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-1">
          <button
            onClick={() => setLevelFilter(levelFilter === 'ALL' ? 'INTERMEDIATE' : 'ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
              levelFilter !== 'ALL'
                ? 'bg-[#7bd0ff]/20 border-[#7bd0ff] text-[#7bd0ff]'
                : 'bg-[#171f33] border-[#2d3449] text-[#bbcabf] hover:text-white'
            }`}
          >
            {levelFilter === 'ALL' ? 'Level: All' : `Level: ${levelFilter}`}
          </button>

          <button
            onClick={() => setFormatFilter(formatFilter === 'ALL' ? '7v7' : 'ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
              formatFilter !== 'ALL'
                ? 'bg-[#4edea3]/20 border-[#4edea3] text-[#4edea3]'
                : 'bg-[#171f33] border-[#2d3449] text-[#bbcabf] hover:text-white'
            }`}
          >
            {formatFilter === 'ALL' ? 'Format: All' : `Format: ${formatFilter}`}
          </button>

          <button
            onClick={onCreateMatchClick}
            className="ml-auto px-3 py-1 bg-[#4edea3]/10 border border-[#4edea3]/50 text-[#4edea3] rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#4edea3]/20 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Host Match</span>
          </button>
        </div>

        {/* View Mode Toggle: List / Map */}
        <div className="flex bg-[#131b2e] rounded-lg p-1 w-full max-w-[240px] mx-auto mt-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-1.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              viewMode === 'list'
                ? 'bg-[#2d3449] text-[#dae2fd] shadow-sm'
                : 'text-[#bbcabf] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
            List
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-1.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              viewMode === 'map'
                ? 'bg-[#2d3449] text-[#dae2fd] shadow-sm'
                : 'text-[#bbcabf] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            Map
          </button>
        </div>
      </div>

      {/* Main Content: List or Map View */}
      {viewMode === 'list' ? (
        <div className="flex flex-col gap-4 p-4 pt-3">
          {filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-[#bbcabf]/40 mb-3">
                sports_soccer
              </span>
              <h3 className="text-lg font-bold text-[#dae2fd]">No matches found</h3>
              <p className="text-sm text-[#bbcabf] max-w-xs mt-1">
                Try expanding your search radius or changing filters to find opponent teams.
              </p>
              <button
                onClick={() => {
                  setSelectedRadius(25);
                  setLevelFilter('ALL');
                  setFormatFilter('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#4edea3] text-[#003824] rounded-lg text-sm font-bold shadow-md hover:bg-[#6ffbbe] transition-colors"
              >
                Reset Filters & Expand Radius
              </button>
            </div>
          ) : (
            filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-[#171f33]/60 backdrop-blur-md rounded-xl border border-[#2d3449] overflow-hidden relative group hover:border-[#4edea3]/40 transition-all duration-300 shadow-md"
              >
                {/* Subtle Glow Effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7bd0ff]/10 rounded-full blur-3xl group-hover:bg-[#4edea3]/20 transition-all pointer-events-none" />

                <div className="p-4 flex flex-col gap-4 relative z-10">
                  {/* Header Row */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {/* Team Logo Badge */}
                      <div className="w-12 h-12 rounded-full border-2 border-[#2d3449] bg-[#0b1326] overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                        <img
                          src={match.teamLogo || 'https://images.unsplash.com/photo-1614630125192-0d3af12318be?w=150'}
                          alt={match.teamName || 'Team'}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-[#dae2fd] leading-tight">
                          {match.teamName || 'Team Name'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {match.level === 'ELITE' ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#4edea3] text-[#003824] font-bold text-[10px]">
                              ELITE
                            </span>
                          ) : match.level === 'INTERMEDIATE' ? (
                            <span className="px-2 py-0.5 rounded-md border border-[#7bd0ff] text-[#7bd0ff] font-bold text-[10px] bg-[#7bd0ff]/10">
                              INTERMEDIATE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md border border-[#bbcabf] text-[#bbcabf] font-bold text-[10px] bg-[#bbcabf]/10">
                              BEGINNER
                            </span>
                          )}
                          <span className="w-1 h-1 rounded-full bg-[#bbcabf]" />
                          <span className="text-[#bbcabf] text-xs font-medium">
                            {match.format || '7v7'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onBookmarkMatch(match.id)}
                      className="w-8 h-8 rounded-full bg-[#171f33] flex items-center justify-center text-[#bbcabf] hover:text-[#4edea3] transition-colors"
                      title={match.isBookmarked ? 'Saved' : 'Save match'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {match.isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  {/* Date, Time & Venue */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#4edea3] text-base mt-0.5">
                        calendar_today
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-wider text-[#bbcabf] uppercase">
                          DATE & TIME
                        </span>
                        <span className="text-xs font-medium text-[#dae2fd] mt-0.5">
                          {match.date || 'TBD'}
                        </span>
                        <span className="text-xs text-[#bbcabf]">{match.time || ''}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#7bd0ff] text-base mt-0.5">
                        location_on
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-wider text-[#bbcabf] uppercase">
                          VENUE
                        </span>
                        <span className="text-xs font-medium text-[#dae2fd] mt-0.5 line-clamp-1">
                          {match.venue || 'TBD'}
                        </span>
                        <span className="text-[11px] text-[#7bd0ff] mt-0.5 font-medium">
                          {match.distanceKm ?? 0} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-1 pt-3 border-t border-[#2d3449] flex gap-3 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {(match.playerAvatars || []).map((avatarUrl, idx) => (
                          <img
                            key={idx}
                            src={avatarUrl}
                            alt="Player avatar"
                            className="w-6 h-6 rounded-full border border-[#0b1326] bg-[#171f33] object-cover"
                          />
                        ))}
                        <div className="w-6 h-6 rounded-full border border-[#0b1326] bg-[#222a3d] flex items-center justify-center text-[10px] font-bold text-[#dae2fd]">
                          +{match.extraPlayersCount || 0}
                        </div>
                      </div>
                      <span className="text-xs text-[#bbcabf] hidden sm:inline">
                        Looking for opponent
                      </span>
                    </div>

                    <button
                      onClick={() => onChallengeMatch(match)}
                      className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-xs font-extrabold rounded-lg px-4 py-2.5 h-[44px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
                    >
                      <span>Challenge</span>
                      <span className="material-symbols-outlined text-sm">sports_soccer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* End of List Banner */}
          <div className="flex flex-col items-center justify-center py-8 text-[#bbcabf] opacity-80">
            <span className="material-symbols-outlined text-3xl mb-1">sports</span>
            <p className="text-xs font-medium">
              No more matches within {selectedRadius}km
            </p>
            <button
              onClick={() => setSelectedRadius((prev) => Math.min(prev + 15, 50))}
              className="mt-2 text-[#4edea3] text-xs font-bold hover:underline uppercase tracking-wider"
            >
              EXPAND RADIUS
            </button>
          </div>
        </div>
      ) : (
        /* Map View */
        <div className="p-4 flex flex-col gap-4">
          <div className="relative w-full h-[460px] bg-[#131b2e] rounded-2xl border border-[#2d3449] overflow-hidden shadow-inner flex flex-col">
            {/* Soccer Pitch Graphic Background */}
            <div className="absolute inset-0 bg-[#0f1d33] opacity-80">
              <div className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none" />
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/20 rounded-full pointer-events-none" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-16 border-b-2 border-x-2 border-white/20 pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-16 border-t-2 border-x-2 border-white/20 pointer-events-none" />
            </div>

            {/* Map Pins */}
            <div className="relative z-10 w-full h-full p-6">
              {filteredMatches.map((m, index) => {
                const positions = [
                  { top: '30%', left: '40%' },
                  { top: '65%', left: '70%' },
                  { top: '45%', left: '25%' },
                  { top: '75%', left: '35%' },
                ];
                const pos = positions[index % positions.length];

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMapMatch(m)}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative p-1 bg-[#0b1326] border-2 border-[#4edea3] rounded-full shadow-[0_0_15px_rgba(78,222,163,0.5)] group-hover:scale-110 transition-transform">
                        <img
                          src={m.teamLogo || 'https://images.unsplash.com/photo-1614630125192-0d3af12318be?w=150'}
                          alt={m.teamName || 'Team'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="absolute -top-1 -right-1 bg-[#4edea3] text-[#003824] text-[9px] font-extrabold px-1 rounded-full">
                          {m.format || '7v7'}
                        </div>
                      </div>
                      <div className="bg-[#0b1326]/90 border border-[#2d3449] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-md">
                        {m.teamName || 'Team'} ({m.distanceKm ?? 0}km)
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Overlay Selected Match Modal */}
            {selectedMapMatch && (
              <div className="absolute bottom-3 left-3 right-3 z-30 bg-[#171f33] border border-[#4edea3]/50 rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMapMatch.teamLogo || 'https://images.unsplash.com/photo-1614630125192-0d3af12318be?w=150'}
                    alt={selectedMapMatch.teamName || 'Team'}
                    className="w-10 h-10 rounded-full object-cover border border-[#4edea3]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedMapMatch.teamName || 'Team'}</h4>
                    <p className="text-xs text-[#bbcabf]">
                      {selectedMapMatch.venue || 'TBD'} • {selectedMapMatch.time || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChallengeMatch(selectedMapMatch)}
                    className="bg-[#4edea3] text-[#003824] font-bold text-xs px-3 py-2 rounded-lg"
                  >
                    Challenge
                  </button>
                  <button
                    onClick={() => setSelectedMapMatch(null)}
                    className="text-[#bbcabf] hover:text-white p-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Radius Selection Modal Sheet */}
      {showRadiusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">Search Distance Radius</h3>
              <button
                onClick={() => setShowRadiusModal(false)}
                className="text-[#bbcabf] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 25, 50].map((radius) => (
                <button
                  key={radius}
                  onClick={() => {
                    setSelectedRadius(radius);
                    setShowRadiusModal(false);
                  }}
                  className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                    selectedRadius === radius
                      ? 'bg-[#4edea3] border-[#4edea3] text-[#003824] shadow-md'
                      : 'bg-[#222a3d] border-[#2d3449] text-white hover:border-[#4edea3]'
                  }`}
                >
                  {radius} KM
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
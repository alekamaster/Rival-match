import React, { useState } from 'react';
import { Team, Player } from '../types';

interface MyTeamViewProps {
  team: Team;
  onChallengeTeamClick: () => void;
  onInvitePlayerClick: () => void;
}

export const MyTeamView: React.FC<MyTeamViewProps> = ({
  team,
  onChallengeTeamClick,
  onInvitePlayerClick,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showFullRosterModal, setShowFullRosterModal] = useState(false);
  const [teamAvailability, setTeamAvailability] = useState(
    team?.availability || [
      { day: 'Mon', short: 'M', available: true },
      { day: 'Tue', short: 'T', available: false },
      { day: 'Wed', short: 'W', available: true },
      { day: 'Thu', short: 'T', available: false },
      { day: 'Fri', short: 'F', available: true },
      { day: 'Sat', short: 'S', available: true },
      { day: 'Sun', short: 'S', available: false },
    ]
  );

  const toggleDayAvailability = (index: number) => {
    const updated = [...teamAvailability];
    updated[index].available = !updated[index].available;
    setTeamAvailability(updated);
  };

  const roster = team?.roster || [];
  const recentForm = team?.recentForm || [];
  const recentMatches = team?.recentMatches || [];

  return (
    <div className="flex flex-col w-full relative pb-28 min-h-screen">
      {/* Ambient Background Blur Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4edea3] rounded-full mix-blend-screen filter blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-[#7bd0ff] rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
      </div>

      <div className="flex flex-col w-full relative z-10 px-4 gap-6 pt-3">
        {/* Header Section */}
        <section className="flex flex-col items-center text-center mt-2 gap-3 animate-fade-in">
          <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-br from-[#4edea3] to-[#171f33] shadow-[0_0_24px_rgba(78,222,163,0.3)]">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#171f33] bg-[#2d3449] flex items-center justify-center">
              <img
                src={team?.crest || 'https://images.unsplash.com/photo-1614630125192-0d3af12318be?w=150'}
                alt={team?.name || 'Team Crest'}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Status Badge */}
            <div
              className="absolute bottom-2 right-2 w-7 h-7 bg-[#4edea3] rounded-full border-2 border-[#0b1326] flex items-center justify-center shadow-lg"
              title="Looking for matches"
            >
              <span className="material-symbols-outlined text-[16px] text-[#003824] font-bold">
                bolt
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-[#dae2fd] tracking-tight">
              {team?.name || 'My Team'}
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-[#bbcabf] text-sm">
              <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">
                location_on
              </span>
              <span>{team?.location || 'Local Pitch'}</span>
            </div>
          </div>
        </section>

        {/* Core Stats Banner */}
        <section className="flex bg-[#222a3d]/60 backdrop-blur-xl border border-[#3c4a42]/30 rounded-xl p-2 shadow-md divide-x divide-[#3c4a42]/30">
          <div className="flex-1 flex flex-col items-center justify-center gap-1 p-2">
            <div className="flex items-center gap-1 text-[#4edea3]">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-xl font-extrabold">{team?.rating ?? 5.0}</span>
            </div>
            <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider">
              Fair Play
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-1 p-2">
            <div className="flex items-center gap-1 text-[#7bd0ff]">
              <span className="material-symbols-outlined text-[20px]">timeline</span>
              <span className="text-xl font-extrabold text-[#dae2fd]">{team?.league || 'Division 1'}</span>
            </div>
            <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider">
              Current League
            </span>
          </div>
        </section>

        {/* Team DNA Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-[#dae2fd]">Team DNA</h2>
          <div className="bg-[#222a3d] rounded-xl p-4 border border-[#3c4a42]/30 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span className="material-symbols-outlined text-[#4edea3]">sports_soccer</span>
              <span className="font-bold text-base text-[#dae2fd]">
                {team?.playstyleTitle || 'High Press & Fast Counter'}
              </span>
            </div>
            <p className="text-sm text-[#bbcabf] leading-relaxed relative z-10">
              {team?.playstyleDescription || 'Aggressive forward pressing team looking for fast transitions and structured build-up play.'}
            </p>
          </div>
        </section>

        {/* Availability Section */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#dae2fd]">Availability</h2>
            <span className="material-symbols-outlined text-[#bbcabf] text-lg">
              calendar_month
            </span>
          </div>

          <div className="flex gap-2">
            {teamAvailability.map((item, idx) => (
              <button
                key={item.day || idx}
                onClick={() => toggleDayAvailability(idx)}
                className={`flex-1 py-3 rounded-lg border text-center transition-all ${
                  item.available
                    ? 'bg-[#10b981]/20 border-[#4edea3]/40 shadow-[inset_0_1px_4px_rgba(78,222,163,0.15)]'
                    : 'bg-[#171f33] border-[#3c4a42]/50 opacity-40 hover:opacity-70'
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    item.available ? 'text-[#4edea3]' : 'text-[#bbcabf]'
                  }`}
                >
                  {item.short}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Active Roster Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#dae2fd]">
              Active Roster ({roster.length})
            </h2>
            <button
              onClick={() => setShowFullRosterModal(true)}
              className="text-[#4edea3] text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {roster.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="flex flex-col items-center gap-1.5 snap-start min-w-[72px] text-center group focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#2d3449] group-hover:border-[#4edea3] overflow-hidden relative shadow-sm transition-colors">
                  <img
                    src={player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                  {player.isCaptain && (
                    <div className="absolute bottom-0 right-0 bg-[#4edea3] text-[#003824] text-[10px] font-extrabold px-1 rounded-tl-md">
                      C
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-[#dae2fd] truncate w-full">
                  {player.name}
                </span>
              </button>
            ))}

            {/* Invite Button */}
            <div className="flex flex-col items-center gap-1.5 snap-start min-w-[72px] justify-center">
              <button
                onClick={onInvitePlayerClick}
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#86948a] flex items-center justify-center text-[#bbcabf] hover:text-[#4edea3] hover:border-[#4edea3] transition-colors"
                title="Invite new player"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <span className="text-xs text-[#bbcabf]">Invite</span>
            </div>
          </div>
        </section>

        {/* Recent Form & Results */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#dae2fd]">Recent Form</h2>
            <div className="flex gap-1">
              {recentForm.map((result, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    result === 'W'
                      ? 'bg-[#4edea3] text-[#003824]'
                      : result === 'D'
                      ? 'bg-[#2d3449] text-[#dae2fd]'
                      : 'bg-[#ffb4ab] text-[#690005]'
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {recentMatches.map((m) => (
              <div
                key={m.id}
                className={`bg-[#171f33] rounded-lg p-3 flex items-center justify-between border-l-4 ${
                  m.isWin
                    ? 'border-l-[#4edea3]'
                    : m.isDraw
                    ? 'border-l-[#2d3449]'
                    : 'border-l-[#ffb4ab]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center border border-[#3c4a42]/30">
                    <span className="text-[10px] font-bold text-[#dae2fd]">
                      {m.opponent?.split(' ')[1] || 'FC'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#dae2fd]">{m.opponent}</span>
                    <span className="text-[11px] text-[#bbcabf]">
                      {m.type} • {m.date}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-lg font-extrabold ${
                    m.isWin ? 'text-[#4edea3]' : 'text-[#bbcabf]'
                  }`}
                >
                  {m.score}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Action Button: Challenge Team */}
        <div className="mt-2 sticky bottom-20 z-20">
          <button
            onClick={onChallengeTeamClick}
            className="w-full bg-[#4edea3] text-[#003824] h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(78,222,163,0.3)] hover:bg-[#6ffbbe] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">sports</span>
            <span>Challenge Team</span>
          </button>
        </div>
      </div>

      {/* Player Stats Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4 animate-fade-in relative">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 text-[#bbcabf] hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedPlayer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={selectedPlayer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#4edea3]"
              />
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedPlayer.name}
                  {selectedPlayer.isCaptain && (
                    <span className="text-xs bg-[#4edea3] text-[#003824] px-1.5 py-0.5 rounded font-extrabold">
                      CAPTAIN
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#7bd0ff] font-medium">
                  {selectedPlayer.position || 'Player'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#0b1326] p-3 rounded-xl border border-[#2d3449] text-center">
              <div>
                <span className="text-xl font-extrabold text-[#4edea3]">
                  {selectedPlayer.goals ?? 0}
                </span>
                <p className="text-[10px] text-[#bbcabf] uppercase font-bold">Goals</p>
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#7bd0ff]">
                  {selectedPlayer.assists ?? 0}
                </span>
                <p className="text-[10px] text-[#bbcabf] uppercase font-bold">Assists</p>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white">
                  {selectedPlayer.matchesPlayed ?? 0}
                </span>
                <p className="text-[10px] text-[#bbcabf] uppercase font-bold">Matches</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Roster Modal */}
      {showFullRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-md rounded-2xl p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#2d3449] pb-3">
              <h3 className="font-bold text-lg text-white">
                Full Active Roster ({roster.length})
              </h3>
              <button
                onClick={() => setShowFullRosterModal(false)}
                className="text-[#bbcabf] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {roster.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-[#222a3d] rounded-xl border border-[#2d3449]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#4edea3]"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.name}</h4>
                      <p className="text-xs text-[#bbcabf]">{p.position || 'Player'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#4edea3]">
                      {p.goals ?? 0} goals
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

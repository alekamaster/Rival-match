import React, { useState } from 'react';

interface RosterInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (name: string, position: string) => void;
}

export const RosterInviteModal: React.FC<RosterInviteModalProps> = ({
  isOpen,
  onClose,
  onAddPlayer,
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Midfield / CM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddPlayer(name.trim(), position);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#2d3449] pb-3">
          <h3 className="font-bold text-lg text-white">Invite Player to Roster</h3>
          <button onClick={onClose} className="text-[#bbcabf] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
              Player Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mateo Kovacic"
              className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
              Primary Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
            >
              <option value="Forward / ST">Forward / ST</option>
              <option value="Winger / RW/LW">Winger / RW/LW</option>
              <option value="Midfield / CM">Midfield / CM</option>
              <option value="Fullback / RB/LB">Fullback / RB/LB</option>
              <option value="Defender / CB">Defender / CB</option>
              <option value="Goalkeeper / GK">Goalkeeper / GK</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4edea3] text-[#003824] font-extrabold h-11 rounded-xl text-sm shadow-md hover:bg-[#6ffbbe] transition-all mt-2"
          >
            Add Player
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MatchFormat, SkillLevel } from '../types';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTeamName?: string;
  onSubmitMatch: (matchData: {
    teamName: string;
    venue: string;
    date: string;
    time: string;
    format: MatchFormat;
    level: SkillLevel;
    feePerPlayer: string;
  }) => Promise<void> | void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  targetTeamName,
  onSubmitMatch,
}) => {
  const [venue, setVenue] = useState('Eastside Sports Complex');
  const [date, setDate] = useState('Sat, Oct 19');
  const [time, setTime] = useState('8:00 PM');
  const [format, setFormat] = useState<MatchFormat>('7v7');
  const [level, setLevel] = useState<SkillLevel>('INTERMEDIATE');
  const [fee, setFee] = useState('$5');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmitMatch({
        teamName: targetTeamName || 'City FC',
        venue,
        date,
        time,
        format,
        level,
        feePerPlayer: fee,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting match:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#171f33] border border-[#2d3449] w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 animate-fade-in shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#2d3449] pb-3">
          <div>
            <h3 className="font-extrabold text-xl text-white">
              {targetTeamName ? `Challenge ${targetTeamName}` : 'Host a Match'}
            </h3>
            <p className="text-xs text-[#bbcabf]">
              {targetTeamName
                ? 'Send a formal match request to this team'
                : 'Post an open match request for nearby teams'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-[#bbcabf] hover:text-white disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
              Venue Location
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
                Match Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as MatchFormat)}
                className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
                disabled={isSubmitting}
              >
                <option value="5v5">5v5</option>
                <option value="7v7">7v7</option>
                <option value="11v11">11v11</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
                Skill Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as SkillLevel)}
                className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
                disabled={isSubmitting}
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ELITE">ELITE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">
              Ref/Pitch Fee per Player
            </label>
            <input
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full bg-[#222a3d] border border-[#2d3449] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#4edea3]"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4edea3] text-[#003824] font-extrabold h-12 rounded-xl text-base shadow-lg hover:bg-[#6ffbbe] transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Publishing...</span>
            ) : targetTeamName ? (
              'Send Match Challenge'
            ) : (
              'Publish Open Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
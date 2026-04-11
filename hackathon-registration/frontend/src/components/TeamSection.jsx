import { useState } from 'react';
import FormInput from './FormInput';

const toggleBtn =
  'flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-500/40';

export default function TeamSection() {
  const [participantMode, setParticipantMode] = useState('solo');
  const [teamAction, setTeamAction] = useState('create');

  const isTeam = participantMode === 'team';

  return (
    <fieldset className="space-y-6 rounded-xl border border-slate-700/60 bg-slate-900/30 p-5">
      <legend className="px-1 text-lg font-semibold text-white">Team</legend>

      <div>
        <span className="mb-3 block text-sm font-medium text-slate-300">Participation</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setParticipantMode('solo')}
            className={`${toggleBtn} ${
              participantMode === 'solo'
                ? 'border-violet-500 bg-violet-600/20 text-white'
                : 'border-slate-600 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            Solo
          </button>
          <button
            type="button"
            onClick={() => setParticipantMode('team')}
            className={`${toggleBtn} ${
              participantMode === 'team'
                ? 'border-violet-500 bg-violet-600/20 text-white'
                : 'border-slate-600 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            Team
          </button>
        </div>
      </div>

      {isTeam && (
        <>
          <FormInput
            id="teamName"
            name="teamName"
            label="Team name"
            placeholder="e.g. Neural Ninjas"
          />

          <div>
            <span className="mb-3 block text-sm font-medium text-slate-300">Team option</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTeamAction('create')}
                className={`${toggleBtn} ${
                  teamAction === 'create'
                    ? 'border-violet-500 bg-violet-600/20 text-white'
                    : 'border-slate-600 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                Create team
              </button>
              <button
                type="button"
                onClick={() => setTeamAction('join')}
                className={`${toggleBtn} ${
                  teamAction === 'join'
                    ? 'border-violet-500 bg-violet-600/20 text-white'
                    : 'border-slate-600 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                Join team
              </button>
            </div>
          </div>

          {teamAction === 'join' && (
            <FormInput
              id="teamCode"
              name="teamCode"
              label="Team code"
              placeholder="Enter the code shared by your team lead"
            />
          )}
        </>
      )}
    </fieldset>
  );
}

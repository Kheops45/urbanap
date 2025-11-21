import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GlassCard } from './GlassCard';

interface AnalyticsProps {
  history: { time: string; available: number }[];
}

const Analytics: React.FC<AnalyticsProps> = ({ history }) => {
  // Mock predictive data extending the history
  const lastValue = history.length > 0 ? history[history.length - 1].available : 25;
  const predictiveData = [
    ...history,
    { time: 'Now', available: lastValue },
    { time: '+10m', available: Math.max(0, lastValue - 5) },
    { time: '+20m', available: Math.max(0, lastValue - 8) },
    { time: '+30m', available: Math.max(0, lastValue - 2) },
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Analyse & Prédictions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Disponibilité Temps Réel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="available" stroke="#4ade80" fillOpacity={1} fill="url(#colorAvail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Prédiction de Demande (IA)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="available" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Projection basée sur l'historique et les tendances horaires.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
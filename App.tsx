import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Car, BarChart3, RefreshCw, Search, Navigation, BrainCircuit } from 'lucide-react';
import MapComponent from './components/MapComponent';
import Analytics from './components/Analytics';
import { GlassCard } from './components/GlassCard';
import { generateInitialSpots, updateSpotStatuses } from './services/mockDataService';
import { getParkingAnalysis } from './services/geminiService';
import { ParkingSpot, ParkingStats, ViewMode } from './types';

function App() {
  // State
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MAP);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<{time: string, available: number}[]>([]);

  // Derived Stats
  const calculateStats = (currentSpots: ParkingSpot[]): ParkingStats => {
    const total = currentSpots.length;
    const available = currentSpots.filter(s => s.status === 'available').length;
    const occupied = total - available;
    return {
      total,
      available,
      occupied,
      occupancyRate: Math.round((occupied / total) * 100)
    };
  };

  const stats = calculateStats(spots);

  // Init Data
  useEffect(() => {
    const initial = generateInitialSpots(50);
    setSpots(initial);
    setIsLoading(false);
    
    // Initial history point
    const now = new Date();
    setHistory([{ time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'}), available: calculateStats(initial).available }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate Real-time Updates (WebSocket fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prevSpots => {
        const updated = updateSpotStatuses(prevSpots);
        
        // Update history
        const stats = calculateStats(updated);
        setHistory(prev => {
          const newHist = [...prev, { time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'}), available: stats.available }];
          return newHist.slice(-10); // Keep last 10 points
        });
        
        return updated;
      });
    }, 5000); // Update every 5s

    return () => clearInterval(interval);
  }, []);

  // AI Analysis Handler
  const handleAiAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    const analysis = await getParkingAnalysis(stats);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  }, [stats]);

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-slate-900/80 backdrop-blur-sm flex flex-col">
        
        {/* Header */}
        <header className="p-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Car className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Urban<span className="text-blue-400">Flow</span></h1>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setViewMode(ViewMode.MAP)}
                className={`p-2 rounded-lg transition-all ${viewMode === ViewMode.MAP ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}
             >
               <MapPin className="w-6 h-6" />
             </button>
             <button 
                onClick={() => setViewMode(ViewMode.ANALYTICS)}
                className={`p-2 rounded-lg transition-all ${viewMode === ViewMode.ANALYTICS ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}
             >
               <BarChart3 className="w-6 h-6" />
             </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-hidden flex flex-col max-w-7xl mx-auto w-full gap-4">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-4 flex flex-col items-center justify-center">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Libres</span>
              <span className="text-3xl font-bold text-green-400">{stats.available}</span>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Occupées</span>
              <span className="text-3xl font-bold text-red-400">{stats.occupied}</span>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Taux</span>
              <span className="text-3xl font-bold text-blue-400">{stats.occupancyRate}%</span>
            </GlassCard>
            <button 
              onClick={handleAiAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 active:scale-95 border border-indigo-400/30"
            >
              {isAnalyzing ? <RefreshCw className="w-6 h-6 animate-spin text-white" /> : <BrainCircuit className="w-6 h-6 text-white mb-1" />}
              <span className="text-white text-xs font-bold">{isAnalyzing ? 'Analyse...' : 'IA Prediction'}</span>
            </button>
          </div>

          {/* Gemini Insight Panel */}
          {aiAnalysis && (
            <GlassCard className="p-4 animate-fade-in border-l-4 border-l-indigo-500">
              <div className="flex gap-3">
                <div className="mt-1">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-300 mb-1">Analyse Stratégique Gemini</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">{aiAnalysis}</p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Main View Area */}
          <div className="flex-1 relative min-h-[400px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : (
              <>
                {viewMode === ViewMode.MAP && (
                  <div className="h-full w-full relative group">
                    <GlassCard className="h-full w-full overflow-hidden p-1">
                      <MapComponent spots={spots} />
                    </GlassCard>
                    
                    {/* Floating Search Bar */}
                    <div className="absolute top-4 left-4 right-4 z-[400]">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Rechercher une zone (ex: Place du Martroi)..." 
                          className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                        />
                      </div>
                    </div>

                    {/* Quick Locate FAB */}
                    <button className="absolute bottom-6 right-6 z-[400] bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-600/40 hover:bg-blue-500 transition-colors">
                      <Navigation className="w-6 h-6 text-white" />
                    </button>
                  </div>
                )}

                {viewMode === ViewMode.ANALYTICS && (
                  <div className="h-full overflow-y-auto">
                     <Analytics history={history} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
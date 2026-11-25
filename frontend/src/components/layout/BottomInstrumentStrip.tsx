import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Activity, Clock, Layers } from 'lucide-react';
import { getHealth } from '../../api/system';

export const BottomInstrumentStrip: React.FC = () => {
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const probe = async () => {
      try {
        const res = await getHealth();
        if (isMounted) setApiOnline(res.status === 'healthy');
      } catch {
        if (isMounted) setApiOnline(false);
      }
    };
    probe();
    const interval = setInterval(probe, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `T+ ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-6.5 bg-[#101214] border-t border-[#35393D] px-3 flex items-center justify-between text-[10px] font-mono select-none shrink-0 z-30">
      {/* Left Segment: System State & API */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              apiOnline
                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                : 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]'
            }`}
          />
          <span className="text-[#929BA3]">CORE_API:</span>
          <span className={apiOnline ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
            {apiOnline ? '127.0.0.1:8000' : 'OFFLINE'}
          </span>
        </div>

        <span className="text-[#35393D]">|</span>

        <div className="flex items-center gap-1.5 text-[#929BA3]">
          <Layers className="w-2.5 h-2.5 text-cyan-400" />
          <span>WS:</span>
          <span className="text-[#D9DEE2]">default_lab</span>
        </div>

        <span className="text-[#35393D] hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1.5 text-[#929BA3]">
          <Activity className="w-2.5 h-2.5 text-amber-400" />
          <span>STATE:</span>
          <span className="text-amber-400">IDLE [BASELINE]</span>
        </div>
      </div>

      {/* Center Segment: Execution Contract */}
      <div className="hidden md:flex items-center gap-2 text-[#929BA3]">
        <Shield className="w-2.5 h-2.5 text-cyan-400" />
        <span>GATE:</span>
        <span className="text-cyan-300">PHASE_01_ACTIVE [HTTP_501_ENFORCED]</span>
      </div>

      {/* Right Segment: Environment & Running Session Clock */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-[#929BA3]">
          <Cpu className="w-2.5 h-2.5 text-purple-400" />
          <span>ENV:</span>
          <span className="text-[#D9DEE2]">DEV [Py3.14 / React18]</span>
        </div>

        <span className="text-[#35393D] hidden lg:inline">|</span>

        <div className="flex items-center gap-1 text-[#929BA3]">
          <Clock className="w-2.5 h-2.5 text-cyan-400" />
          <span className="text-[#D9DEE2] font-semibold">{formatTimer(secondsElapsed)}</span>
        </div>
      </div>
    </footer>
  );
};

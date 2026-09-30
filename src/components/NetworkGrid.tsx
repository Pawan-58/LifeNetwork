import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Server, 
  Activity, 
  ShieldCheck, 
  Wifi, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  RefreshCw 
} from 'lucide-react';
import { Hospital, SystemMetrics } from '../types/health';
import { INITIAL_METRICS } from '../data/mockData';
import { api } from '../utils/api';

interface NetworkGridProps {
  hospitals: Hospital[];
}

export const NetworkGrid: React.FC<NetworkGridProps> = ({ hospitals }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [refreshing, setRefreshing] = useState(false);
  const [qps, setQps] = useState(metrics.queriesPerSecond);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const data = await api.getHealth();
      if (data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // Simulate real-time heavy traffic fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setQps(prev => Math.floor(prev + (Math.random() * 400 - 200)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* High Availability & Heavy Traffic Resilience Dashboard */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                National Healthcare Grid Architecture
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              High Availability & Heavy Concurrency Engine
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Engineered for seamless multi-hospital synchronization under peak emergency loads
            </p>
          </div>

          <button
            onClick={fetchHealth}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Grid Availability SLA</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {metrics.uptime}
            </div>
            <div className="text-[11px] text-slate-400">Zero Single Point of Failure</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Real-Time Concurrency</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400 font-mono">
              {qps.toLocaleString()} QPS
            </div>
            <div className="text-[11px] text-slate-400">Distributed Load Balanced</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Synchronized Records</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 font-mono">
              {(metrics.totalRecordsEncrypted / 1000000).toFixed(1)}M+
            </div>
            <div className="text-[11px] text-slate-400">Encrypted HL7 FHIR v4</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Network Node Latency</span>
              <Wifi className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-400 font-mono">
              {metrics.avgLatencyMs} ms
            </div>
            <div className="text-[11px] text-slate-400">Multi-Region Edge Caching</div>
          </div>
        </div>

        {/* Heavy Traffic Architecture Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-teal-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Edge Token Caching & Rate Limiting
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Equipped with in-memory token hashing and multi-layer query caching so hospitals can retrieve emergency patient allergies in sub-20ms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Cryptographic Tamper-Proof Audit
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every single report access across different hospitals generates an immutable audit record verified with SHA-256 digital signatures.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              High Availability Clustered Nodes
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Multi-region server distribution ensures hospital access remains uninterrupted during power surges or regional network outages.
            </p>
          </div>
        </div>

      </div>

      {/* Connected Hospitals Directory */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            Connected Healthcare Facilities Directory
          </h2>
          <p className="text-xs text-slate-500">
            All participating institutions linked to the unified patient database
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition bg-slate-50/50 hover:bg-white space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {hospital.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {hospital.address}
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  {hospital.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">Hospital Code</span>
                  <span className="font-mono font-bold text-slate-800">{hospital.code}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tier Category</span>
                  <span className="font-semibold text-slate-700">{hospital.networkTier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Records Shared</span>
                  <span className="font-mono font-bold text-teal-700">{hospital.totalRecordsShared.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Latency</span>
                  <span className="font-mono font-bold text-sky-700">{hospital.latencyMs} ms</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {hospital.phone}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  License: {hospital.licenseNo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

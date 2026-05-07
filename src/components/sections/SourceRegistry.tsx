import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Link2, RefreshCw, Layers } from 'lucide-react';
import { SOURCE_REGISTRY } from '@/data/registry';

export function SourceRegistry() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Source Registry</h1>
        <p className="text-slate-400">Master SaaS Mapping Logic & Neural Backend Registry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="p-6">
            <CardTitle className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4" /> Active Master Files
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-3xl font-black text-white italic">02</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">SaaS Infrastructure Nodes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 p-6 bg-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" /> Integrated Brand Registries
            </CardTitle>
            <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[10px] italic">NEURAL STATUS: SYNCED</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Brand Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Master File ID (Backend)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Last Latch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SOURCE_REGISTRY.map((brand) => (
                <tr key={brand.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-white text-sm italic">{brand.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 w-fit">
                      <Link2 className="w-3 h-3 text-slate-500" />
                      <span className="text-[11px] font-mono text-slate-300">{brand.serverId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] font-black uppercase">Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-medium text-slate-500">
                    {new Date(brand.lastSync).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-orange-500/10 rounded-xl">
          <RefreshCw className="w-6 h-6 text-orange-500 animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white italic uppercase mb-1">Architecture Sync</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The Source Registry acts as the primary brain of the Divyanshi Hub. When a staff member logs in, 
            the system first identifies their Brand, pulls the <span className="text-white">Master File ID</span> as the backend data source, 
            and then maps their <span className="text-white">Emp Code</span> to a specific role-based dashboard template.
          </p>
        </div>
      </div>
    </div>
  );
}

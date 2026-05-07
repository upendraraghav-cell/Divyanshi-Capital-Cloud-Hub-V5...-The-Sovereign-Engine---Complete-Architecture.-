/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  FileImage, 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { callBackend } from '@/lib/api';
import { motion } from 'motion/react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  url: string;
  date: string;
}

export function DriveAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await callBackend<{ assets: Asset[] }>("GET_DRIVE_ASSETS");
      setAssets(data.assets);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drive Assets</h1>
          <p className="text-muted-foreground">Access your snapshots and documents saved in Google Drive (u.raghav003@gmail.com).</p>
        </div>
        <Button onClick={fetchAssets} disabled={isLoading} variant="outline" className="rounded-xl border-white/10">
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search assets..." 
            className="pl-10 bg-white/5 border-white/10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl border-white/10">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <Card className="premium-card overflow-hidden h-full flex flex-col hover:border-primary/50 transition-all">
                <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden p-2">
                  {asset.type === 'image' ? (
                    <img 
                      src={asset.url} 
                      alt={asset.name} 
                      className="max-w-full max-h-full object-contain transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : asset.type === 'pdf' ? (
                    <div className="flex flex-col items-center gap-2 text-center p-4">
                      <FileText className="w-12 h-12 text-emerald-400/40" />
                      <span className="text-[10px] text-muted-foreground truncate w-full max-w-[140px] font-medium">{asset.name}</span>
                    </div>
                  ) : (
                    <FolderOpen className="w-12 h-12 text-muted-foreground/30" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {asset.type === 'image' ? (
                        <FileImage className="w-4 h-4 text-blue-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-emerald-400" />
                      )}
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-white/10">
                        {asset.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold truncate">{asset.name}</CardTitle>
                  </div>
                  <div className="mt-4 text-[10px] text-muted-foreground font-medium">
                    Saved on {asset.date}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 rounded-full bg-white/5 border border-white/10">
            <FolderOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">No assets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or check your Drive folder.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

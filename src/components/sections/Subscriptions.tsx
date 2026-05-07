import { 
  Check, 
  ChevronRight, 
  Zap, 
  Crown, 
  ShieldCheck,
  TrendingUp,
  CreditCard,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', revenue: 32000 },
  { name: 'Feb', revenue: 35000 },
  { name: 'Mar', revenue: 38000 },
  { name: 'Apr', revenue: 42000 },
  { name: 'May', revenue: 44000 },
  { name: 'Jun', revenue: 45600 },
];

export function Subscriptions() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Monetization Hub</h1>
          <p className="text-slate-400">Scaling the Divyanshi Capital Matrix</p>
        </div>
        <div className="hidden md:flex items-center gap-4 p-2 rounded-2xl bg-white/5 border border-white/10">
          <div className="px-4 border-r border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Current MRR</p>
            <p className="text-lg font-black text-orange-500">₹45,600</p>
          </div>
          <div className="px-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Growth Rate</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <p className="text-lg font-black text-emerald-500">+12.4%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <Card className="bg-white/5 border-white/10 hover:border-orange-500/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-500/20" />
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">Basic</span>
              <Zap className="w-5 h-5 text-slate-400" />
            </CardTitle>
            <CardDescription className="text-slate-500">For individual sales pros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white italic">₹300</span>
              <span className="text-slate-500 text-sm">/user /mo</span>
            </div>
            <ul className="space-y-3">
              {['Divyanshi V1 Core OS', 'Manual CIBIL Check', 'CRM Dashboard', 'WhatsApp Integration (1 Hook)'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-11">Manage Plan</Button>
          </CardFooter>
        </Card>

        {/* Executive Plan */}
        <Card className="bg-white/5 border-orange-500/50 hover:border-orange-500 transition-all group overflow-hidden relative shadow-2xl shadow-orange-500/10 scale-105 z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
          <div className="absolute top-6 right-6">
            <Badge className="bg-orange-500 text-white border-0 text-[10px] font-black uppercase tracking-widest px-3">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">Executive</span>
              <ShieldCheck className="w-5 h-5 text-orange-500" />
            </CardTitle>
            <CardDescription className="text-slate-400">For mid-sized loan agencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white italic">₹600</span>
              <span className="text-slate-500 text-sm">/user /mo</span>
            </div>
            <ul className="space-y-3">
              {['Everything in Basic', 'Auto-Bank Stmt Analyzer', 'Lead Campaign Engine', 'Executive Desk HTML', 'BULBHUL Lite Assistant'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-xl shadow-orange-500/20">Upgrade Now</Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/20" />
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">Enterprise</span>
              <Crown className="w-5 h-5 text-purple-400" />
            </CardTitle>
            <CardDescription className="text-slate-500">For large-scale loan factories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white italic">₹900</span>
              <span className="text-slate-500 text-sm">/user /mo</span>
            </div>
            <ul className="space-y-3">
              {['Everything in Executive', 'Full LAILA Master Controller', 'Direct Meta Business API', 'Whitelabel Dashboard', 'Custom Node Hosting'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 h-11">Contact Sales</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
            <div>
              <CardTitle className="text-lg">Subscription Revenue Trend</CardTitle>
              <CardDescription>Monthly growth over the last quarter</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <History className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff1a', borderRadius: '12px' }}
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f97316" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" /> Billing Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-black italic text-white overflow-hidden ring-1 ring-white/10">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-bold text-white">•••• 4242</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Expires 12/26</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase tracking-widest font-bold">Upcoming Bill</span>
                <span className="font-bold text-white">₹4,200</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase tracking-widest font-bold">Tax (GST 18%)</span>
                <span className="font-bold text-white">₹756</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between">
                <span className="text-sm font-black text-white uppercase tracking-widest">Total Payable</span>
                <span className="text-lg font-black text-white italic">₹4,956</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-widest py-6">
              Download Last Invoice
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

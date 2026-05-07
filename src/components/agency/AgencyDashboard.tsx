import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from './Users';
import { Clients } from './Clients';
import { RoleManager } from './RoleManager';

export function AgencyDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Divyanshi Capital - P1 Master Registry</h1>
      </div>
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
          <TabsTrigger value="users" className="data-[state=active]:bg-[#43a4ff] data-[state=active]:text-white uppercase font-black text-xs px-6 py-2 rounded-lg">Users</TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-[#43a4ff] data-[state=active]:text-white uppercase font-black text-xs px-6 py-2 rounded-lg">Clients</TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-[#43a4ff] data-[state=active]:text-white uppercase font-black text-xs px-6 py-2 rounded-lg">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card className="p-6 bg-slate-900 border-white/5">
            <Users />
          </Card>
        </TabsContent>
        <TabsContent value="clients">
          <Card className="p-6 bg-slate-900 border-white/5">
            <Clients />
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card className="p-6 bg-slate-900 border-white/5">
            <RoleManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

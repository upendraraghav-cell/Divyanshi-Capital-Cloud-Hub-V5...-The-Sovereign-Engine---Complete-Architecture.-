/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function UserProfile({ userId }: { userId: string }) {
  // In a real scenario, fetch user data based on userId
  return (
    <div className="p-8 space-y-6">
       <Card className="bg-white/5 border-white/10 p-8 rounded-3xl">
          <h2 className="text-3xl font-black text-white italic">Node Matrix: {userId}</h2>
          <p className="text-slate-400">Detailed personnel node data will be rendered here based on the master registry lookup.</p>
          <div className="mt-6">
            <Badge className="bg-emerald-500/10 text-emerald-500">Node Secure</Badge>
          </div>
       </Card>
    </div>
  );
}

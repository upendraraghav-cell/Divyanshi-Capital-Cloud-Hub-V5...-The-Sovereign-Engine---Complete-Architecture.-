/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Layout, 
  Phone, 
  ChevronRight,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const templates = [
  { id: 'welcome', name: 'Welcome Message', content: 'Hello {{name}}, welcome to our workspace. We are excited to help you optimize your {{business_type}} systems.' },
  { id: 'offer', name: 'Service Upgrade Alert', content: 'Great news {{name}}! {{service}} has updated their integration features. This is a limited time optimization opportunity.' },
  { id: 'integration', name: 'Integration Pending', content: 'Hi {{name}}, we are waiting for your system credentials to finalize the {{service}} integration. Please share them securely.' },
  { id: 'followup', name: 'Follow-up', content: 'Hi {{name}}, just checking in to see if you had any questions regarding the SaaS proposal we shared.' },
];

export function WhatsAppTools() {
  const [mobile, setMobile] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val);
    const template = templates.find(t => t.id === val);
    if (template) {
      setMessage(template.content);
    }
  };

  const handleSend = () => {
    if (!mobile || !message) {
      toast.error("Please provide mobile number and message.");
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    const url = `https://wa.me/${cleanMobile}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success("Opening WhatsApp...");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Actions</h1>
          <p className="text-muted-foreground">Automated outreach and system messaging for QDN SaaS Engine.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">API Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Card */}
        <Card className="lg:col-span-2 premium-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Send Message</CardTitle>
                <CardDescription>Quickly reach out to clients using verified templates.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="mobile" 
                    placeholder="919876543210" 
                    className="pl-10 bg-white/5 border-white/10"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message Template</Label>
                <Select onValueChange={handleTemplateChange}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    {templates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview">Message Preview</Label>
              <Textarea 
                id="preview" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here or select a template..." 
                className="bg-white/5 border-white/10 min-h-[150px] font-mono text-sm"
              />
              <p className="text-[10px] text-muted-foreground italic">Note: Use {'{{name}}'}, {'{{service}}'}, etc. as placeholders for SuperAGI to fill later.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleSend}
                className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
              >
                <Send className="mr-2 w-4 h-4" />
                Send Now
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5"
              >
                <Calendar className="mr-2 w-4 h-4" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Sent to +91 98*** 43***</p>
                    <p className="text-[10px] text-muted-foreground">Welcome Template • 2m ago</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm">LAILA Insight</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                LAILA suggests sending the "Divyanshi V1 Quick Guide" to users who have just completed the trial.
              </p>
              <Button variant="link" className="p-0 h-auto text-[10px] text-primary mt-2 font-bold uppercase tracking-widest">
                Try Smart Outreach
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

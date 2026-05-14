/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Mail, Search, Filter, Star, Paperclip, MoreVertical, ChevronDown, Sparkles, Send, Trash2, Wand2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSuperAGIResponse } from '@/lib/gemini';
import { toast } from 'sonner';

const EMAIL_TEMPLATES = [
  { id: 'follow-up', name: 'Follow-up', context: 'A professional follow-up email after a meeting.' },
  { id: 'proposal', name: 'Proposal', context: 'Presenting a strategic partnership or business proposal.' },
  { id: 'meeting', name: 'Meeting Request', context: 'Requesting a time to discuss potential collaboration.' },
  { id: 'update', name: 'Status Update', context: 'Providing a progress update on an ongoing project.' },
];

const INITIAL_EMAILS = [
  { id: 1, sender: "Stripe", subject: "Payout Update - April 2026", preview: "Your weekly payout of ₹1,24,000 has been processed successfully. Check your dashboard...", tag: "Payout", time: "10:30 AM", unread: true, date: "2026-04-10T10:30:00Z" },
  { id: 2, sender: "OS Core", subject: "Daily Analytics Hub - 09/04/2026", preview: "Your daily performance summary is ready for review. Lead conversion is up by 15%...", tag: "System", time: "09:15 AM", unread: false, date: "2026-04-10T09:15:00Z" },
  { id: 3, sender: "Project Manager", subject: "New Client Workflow Scheduled", preview: "Account: Global Tech Solutions for Q2 rollout. Time: 2:00 PM...", tag: "Project", time: "Yesterday", unread: true, date: "2026-04-09T14:00:00Z" },
  { id: 4, sender: "AWS Support", subject: "SaaS Cluster Policy: Scaling Ratios", preview: "Effective immediately, the auto-scaling LTV for server clusters has been revised...", tag: "Infra", time: "Yesterday", unread: false, date: "2026-04-09T11:00:00Z" },
  { id: 5, sender: "Lead Engine", subject: "High Intent Leads Identified", preview: "3 new enterprise leads have been scored at 90+. Start engagement sequence...", tag: "Leads", time: "2 days ago", unread: false, date: "2026-04-08T10:00:00Z" },
];

type SortOption = 'newest' | 'oldest' | 'sender' | 'subject';

export function MailInbox() {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
    context: '',
    template: 'none'
  });
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiDraft = async () => {
    if (!composeData.context && composeData.template === 'none') {
      toast.error("Please provide context or select a template for LAILA drafting.");
      return;
    }

    setIsAiGenerating(true);
    try {
      const templateContext = EMAIL_TEMPLATES.find(t => t.id === composeData.template)?.context || '';
      const prompt = `Generate a professional email draft. 
      Company: QDN Management Services
      Product: Divyanshi V1 Loan OS
      Context: ${composeData.context}
      Template Style: ${templateContext}
      Recipient: ${composeData.to || 'a valued partner'}
      
      Respond in JSON format:
      {
        "subject": "Subject line here",
        "body": "Email body content here"
      }`;

      const aiResponse = await getSuperAGIResponse(prompt, [], 'LAILA', 'BOSS');
      const textResponse = typeof (aiResponse as any).text === 'function' ? (aiResponse as any).text() : (aiResponse as any).text || '';
      const cleanJson = textResponse.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      setComposeData(prev => ({
        ...prev,
        subject: result.subject,
        body: result.body
      }));
      toast.success("LAILA successfully drafted the email!");
    } catch (error) {
      console.error("AI Draft Error:", error);
      toast.error("Cloud nodes busy. LAILA failed to generate AI draft.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const sortedEmails = useMemo(() => {
    let result = [...INITIAL_EMAILS];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(email => 
        email.sender.toLowerCase().includes(query) || 
        email.subject.toLowerCase().includes(query) || 
        email.preview.toLowerCase().includes(query)
      );
    }

    // Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'sender':
          return a.sender.localeCompare(b.sender);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });
  }, [sortBy, searchQuery]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      case 'sender': return 'Sender';
      case 'subject': return 'Subject';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 text-left">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mail Inbox</h1>
          <p className="text-muted-foreground">Unified communication hub for QDN SaaS OS.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger
              render={
                <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                  <Mail className="w-4 h-4 mr-2" />
                  Compose
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[600px] bg-[#071018] border-white/10 text-white rounded-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Wand2 className="w-5 h-5 text-primary" />
                  Compose with LAILA
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Draft professional emails using system intelligence.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">Recipient</Label>
                    <Input 
                      id="to" 
                      placeholder="email@example.com" 
                      className="bg-white/5 border-white/10"
                      value={composeData.to}
                      onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Template</Label>
                    <Select 
                      onValueChange={(val) => setComposeData(prev => ({ ...prev, template: val }))}
                      defaultValue={composeData.template}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#071018] border-white/10 text-white">
                        <SelectItem value="none">Custom Context</SelectItem>
                        {EMAIL_TEMPLATES.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context" className="flex items-center justify-between">
                    Drafting Context
                    <span className="text-[10px] text-primary uppercase font-bold tracking-widest">AI Audit Priority</span>
                  </Label>
                  <div className="relative">
                    <Textarea 
                      id="context" 
                      placeholder="e.g. Follow up on the AWS migration proposal from last Tuesday..." 
                      className="bg-white/5 border-white/10 min-h-[80px]"
                      value={composeData.context}
                      onChange={(e) => setComposeData(prev => ({ ...prev, context: e.target.value }))}
                    />
                    <Button 
                      size="sm" 
                      className="absolute bottom-2 right-2 rounded-lg gap-2"
                      onClick={handleAiDraft}
                      disabled={isAiGenerating}
                    >
                      {isAiGenerating ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {isAiGenerating ? 'Synthesizing...' : 'Draft with AI'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Finalized Subject Line" 
                      className="bg-white/5 border-white/10"
                      value={composeData.subject}
                      onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Body</Label>
                    <Textarea 
                      id="body" 
                      placeholder="Drafted content..." 
                      className="bg-white/5 border-white/10 min-h-[150px]"
                      value={composeData.body}
                      onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="ghost" className="hover:bg-red-500/10 hover:text-red-500 gap-2" onClick={() => setIsComposeOpen(false)}>
                  <Trash2 className="w-4 h-4" />
                  Discard
                </Button>
                <Button className="rounded-xl gap-2 px-8" onClick={async () => {
                  toast.success("Message dispatched via Divyanshi Pipeline!");
                  setIsComposeOpen(false);
                  
                  // Neural Bridge Call (Real-time Sync)
                  try {
                    await fetch('/api/webhooks/bridge', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'MAIL_DISPATCH',
                        client_name: composeData.to,
                        subject: composeData.subject,
                        remarks: composeData.body,
                        status: 'DISPATCHED'
                      })
                    });
                  } catch (e) {
                    console.warn("Mail bridge log deferred.");
                  }
                }}>
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search inbox..." 
              className="pl-10 bg-white/5 border-white/10 rounded-xl" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-4">
            <span>Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="text-primary flex items-center gap-1 hover:opacity-80 transition-opacity outline-none">
                    {getSortLabel(sortBy)}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="glass-panel border-white/10">
                <DropdownMenuItem onClick={() => setSortBy('newest')} className="hover:bg-white/10 cursor-pointer">Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')} className="hover:bg-white/10 cursor-pointer">Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('sender')} className="hover:bg-white/10 cursor-pointer">Sender</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('subject')} className="hover:bg-white/10 cursor-pointer">Subject</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-white/5">
            {sortedEmails.map((email) => (
              <div 
                key={email.id} 
                className={`p-6 flex items-start gap-6 hover:bg-white/5 transition-colors cursor-pointer group relative ${email.unread ? 'bg-primary/5' : ''}`}
              >
                {email.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 ${email.unread ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                    <Mail className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-bold truncate ${email.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {email.sender}
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{email.time}</span>
                  </div>
                  <h3 className={`text-base font-bold mb-1 truncate ${email.unread ? 'text-primary' : 'text-foreground'}`}>
                    {email.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {email.preview}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Badge variant="secondary" className="bg-white/10 text-white border-none rounded-lg text-[10px] uppercase tracking-widest px-2 py-0.5">
                    {email.tag}
                  </Badge>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/10">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/10">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

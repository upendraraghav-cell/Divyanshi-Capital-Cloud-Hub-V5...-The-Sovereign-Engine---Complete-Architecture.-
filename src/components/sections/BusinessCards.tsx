/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef } from 'react';
import { Contact, MessageSquare, UserPlus, Phone, Mail, MapPin, Share2, MoreHorizontal, Copy, Check, Filter, XCircle, Download, Edit3, Save, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const contacts = [
  { id: 1, name: "Amit Sharma", role: "MD - Real Estate Group", company: "Skyline Ventures", phone: "+91 99887 76655", email: "amit@skyline.com", city: "Mumbai", type: "VIP" },
  { id: 2, name: "Priya Patel", role: "CEO", company: "Patel Logistics", phone: "+91 88776 65544", email: "priya@patel.in", city: "Ahmedabad", type: "Corporate" },
  { id: 3, name: "Vikram Singh", role: "Proprietor", company: "Singh Automobiles", phone: "+91 77665 54433", email: "vikram@singh.com", city: "Delhi", type: "SME" },
  { id: 4, name: "Sonia Verma", role: "Director", company: "Verma Exports", phone: "+91 66554 43322", email: "sonia@verma.com", city: "Bangalore", type: "Corporate" },
  { id: 5, name: "Rajesh Kumar", role: "Manager", company: "Kumar & Sons", phone: "+91 55443 32211", email: "rajesh@kumar.com", city: "Pune", type: "Retail" },
  { id: 6, name: "Anjali Gupta", role: "Founder", company: "Gupta Tech", phone: "+91 44332 21100", email: "anjali@gupta.tech", city: "Hyderabad", type: "Startup" },
];

export function BusinessCards() {
  const [sharingContact, setSharingContact] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [isEditingMyCard, setIsEditingMyCard] = useState(false);
  
  const [myCard, setMyCard] = useState({
    name: "Upendra Singh Raghav",
    role: "Director",
    phone: "78380 74351",
    email: "Upendra.Raghav@neuralenterprise.io",
    address: "B-1/637, 3rd Floor, Near Janakpuri East Metro Station, Janakpuri, New Delhi - 110058"
  });

  const types = useMemo(() => ['all', ...new Set(contacts.map(c => c.type))], []);
  const cities = useMemo(() => ['all', ...new Set(contacts.map(c => c.city))], []);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesType = filterType === 'all' || contact.type === filterType;
      const matchesCity = filterCity === 'all' || contact.city === filterCity;
      return matchesType && matchesCity;
    });
  }, [filterType, filterCity]);

  const handleShare = (contact: any) => {
    setSharingContact(contact);
  };

  const copyToClipboard = (contact: any) => {
    const text = `
Name: ${contact.name}
Role: ${contact.role}
Company: ${contact.company || 'Divyanshi Capital'}
Phone: ${contact.phone}
Email: ${contact.email}
City: ${contact.city || contact.address}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Contact details copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy to clipboard.");
    });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* My Digital Card Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Digital Card</h2>
            <p className="text-muted-foreground">Your professional identity, customized by role.</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-white/10 hover:bg-white/5"
            onClick={() => setIsEditingMyCard(!isEditingMyCard)}
          >
            {isEditingMyCard ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditingMyCard ? "Save Card" : "Customize Card"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card Preview */}
          <div className="relative w-full aspect-[1.75/1] max-w-[600px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            {/* Background Design */}
            <div className="absolute inset-0 bg-[#0A1A3F]" />
            
            {/* Gold Accents */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-full blur-3xl opacity-50" />
            
            {/* Gold Curves (Stylized) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
            
            {/* Left Side: Logo & Branding */}
            <div className="absolute inset-y-0 left-0 w-[40%] flex flex-col items-center justify-center p-8 border-r border-white/5">
              <div className="w-20 h-20 relative mb-4 flex items-center justify-center bg-primary rounded-2xl shadow-xl shadow-primary/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-white tracking-widest leading-none uppercase">Divyanshi Capital</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-[1px] w-4 bg-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Enterprise</span>
                  <div className="h-[1px] w-4 bg-amber-500" />
                </div>
              </div>
            </div>

            {/* Right Side: Contact Info */}
            <div className="absolute inset-y-0 right-0 w-[60%] p-10 flex flex-col justify-center space-y-6">
              <div>
                <h4 className="text-3xl font-bold text-white tracking-tight leading-tight">{myCard.name}</h4>
                <p className="text-lg font-medium text-amber-500 mt-1">{myCard.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-semibold">{myCard.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-semibold truncate">{myCard.email}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[10px] leading-tight font-medium">{myCard.address}</span>
                </div>
              </div>
            </div>

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
              <Button className="rounded-full bg-white text-black hover:bg-white/90">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                className="rounded-full bg-primary text-white hover:bg-primary/90"
                onClick={() => handleShare({ ...myCard, company: "Divyanshi Capital" })}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Digital
              </Button>
            </div>
          </div>

          {/* Customization Form */}
          <AnimatePresence>
            {isEditingMyCard && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 rounded-2xl border-white/10 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={myCard.name} 
                      onChange={(e) => setMyCard({...myCard, name: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role / Designation</Label>
                    <Input 
                      value={myCard.role} 
                      onChange={(e) => setMyCard({...myCard, role: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input 
                      value={myCard.phone} 
                      onChange={(e) => setMyCard({...myCard, phone: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      value={myCard.email} 
                      onChange={(e) => setMyCard({...myCard, email: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Office Address</Label>
                  <Input 
                    value={myCard.address} 
                    onChange={(e) => setMyCard({...myCard, address: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 mt-2"
                  onClick={() => setIsEditingMyCard(false)}
                >
                  Apply Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Network Cards Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Network Contacts</h2>
            <p className="text-muted-foreground">Premium contact tiles for quick actions and networking.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Filters
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] h-9 border-none bg-transparent hover:bg-white/5">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(t => (
                    <SelectItem key={t} value={t}>
                      {t === 'all' ? 'All Types' : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger className="w-[130px] h-9 border-none bg-transparent hover:bg-white/5">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => (
                    <SelectItem key={c} value={c}>
                      {c === 'all' ? 'All Cities' : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterType !== 'all' || filterCity !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    setFilterType('all');
                    setFilterCity('all');
                  }}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button className="rounded-xl shadow-lg shadow-primary/20 h-11">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredContacts.map((contact, i) => (
              <motion.div
                key={contact.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
              <Card className="premium-card group overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-b border-white/5 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
                        <img 
                          src={`https://picsum.photos/seed/${contact.name}/100/100`} 
                          alt={contact.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <Badge className={`rounded-lg text-[10px] uppercase tracking-widest border-none ${
                        contact.type === 'VIP' ? 'bg-amber-500/20 text-amber-500' : 
                        contact.type === 'Corporate' ? 'bg-blue-500/20 text-blue-500' : 'bg-white/10 text-white'
                      }`}>
                        {contact.type}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">{contact.name}</h3>
                      <p className="text-sm font-medium text-primary">{contact.role}</p>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-1">{contact.company}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{contact.city}</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl h-10 border-white/10 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-bold text-xs"
                      onClick={() => handleShare(contact)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-emerald-500 transition-colors"
                      onClick={() => {
                        const text = `Hi ${contact.name}, I'm reaching out from Divyanshi Capital.`;
                        window.open(`https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      title="Quick WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-blue-500 transition-colors"
                      onClick={() => window.location.href = `tel:${contact.phone.replace(/\D/g, '')}`}
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-primary"
                      onClick={() => copyToClipboard(contact)}
                      title="Copy Info"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredContacts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <Filter className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-semibold">No contacts found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
              <Button 
                variant="link" 
                className="mt-2 text-primary"
                onClick={() => {
                  setFilterType('all');
                  setFilterCity('all');
                }}
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={!!sharingContact} onOpenChange={(open) => !open && setSharingContact(null)}>
        <DialogContent className="sm:max-w-md glass-panel border-white/10">
          <DialogHeader>
            <DialogTitle>Share Contact</DialogTitle>
            <DialogDescription>
              Share {sharingContact?.name}'s professional details.
            </DialogDescription>
          </DialogHeader>
          
          {sharingContact && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs">
                <p><span className="text-primary">Name:</span> {sharingContact.name}</p>
                <p><span className="text-primary">Role:</span> {sharingContact.role}</p>
                <p><span className="text-primary">Company:</span> {sharingContact.company || 'Divyanshi Capital'}</p>
                <p><span className="text-primary">Phone:</span> {sharingContact.phone}</p>
                <p><span className="text-primary">Email:</span> {sharingContact.email}</p>
                <p><span className="text-primary">City:</span> {sharingContact.city || sharingContact.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-xl h-11 border-white/10 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
                  onClick={() => {
                    const text = `Contact Details:\nName: ${sharingContact.name}\nRole: ${sharingContact.role}\nCompany: ${sharingContact.company || 'Divyanshi Capital'}\nPhone: ${sharingContact.phone}\nEmail: ${sharingContact.email}\nCity/Address: ${sharingContact.city || sharingContact.address}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl h-11 border-white/10 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30"
                  onClick={() => {
                    const subject = `Contact Details: ${sharingContact.name}`;
                    const body = `Name: ${sharingContact.name}\nRole: ${sharingContact.role}\nCompany: ${sharingContact.company || 'Divyanshi Capital'}\nPhone: ${sharingContact.phone}\nEmail: ${sharingContact.email}\nCity/Address: ${sharingContact.city || sharingContact.address}`;
                    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>

              <Button 
                onClick={() => copyToClipboard(sharingContact)}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl border-white/5 hover:bg-white/5">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

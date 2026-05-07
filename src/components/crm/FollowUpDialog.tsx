import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Notebook, Loader2 } from 'lucide-react';
import { db, auth, OperationType, handleFirestoreError } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface FollowUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export const FollowUpDialog: React.FC<FollowUpDialogProps> = ({ isOpen, onClose, target }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !auth.currentUser) return;

    setIsSubmitting(true);
    try {
      const scheduledDateTime = new Date(`${date}T${time}`);
      
      const followupData = {
        targetName: target.name,
        targetEmail: target.email,
        targetRole: target.role,
        scheduledAt: Timestamp.fromDate(scheduledDateTime),
        notes,
        createdBy: auth.currentUser.uid,
        creatorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      const path = 'followups';
      await addDoc(collection(db, path), followupData).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, path);
      });

      toast.success("Follow-Up Scheduled", {
        description: `Protocol locked with ${target.name} for ${date} ${time}`
      });
      
      onClose();
      // Reset form
      setDate('');
      setTime('');
      setNotes('');
    } catch (error) {
      console.error("Follow-Up Error:", error);
      toast.error("Handshake Failed", {
        description: "Could not synchronize follow-up with the P1 Master."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-tight flex items-center gap-3">
            <Calendar className="text-orange-500" />
            Neural Follow-Up
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">
            Scheduling protocol for: {target?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold text-slate-500 uppercase">Target Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                <Input 
                  id="date" 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-900 border-slate-800 pl-10 h-11 text-sm rounded-xl focus:border-orange-500/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-xs font-bold text-slate-500 uppercase">Target Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                <Input 
                  id="time" 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-slate-900 border-slate-800 pl-10 h-11 text-sm rounded-xl focus:border-orange-500/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold text-slate-500 uppercase">Intelligence Notes</Label>
            <div className="relative">
              <Notebook className="absolute left-3 top-4 text-slate-600 w-4 h-4" />
              <Textarea 
                id="notes" 
                placeholder="Specific instructions or callback agenda..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-slate-900 border-slate-800 pl-10 min-h-[100px] text-sm rounded-xl focus:border-orange-500/50 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="text-slate-500 hover:text-white"
            >
              Abort
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest px-8 h-11 rounded-xl shadow-lg shadow-orange-900/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                'Secure Protocol'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

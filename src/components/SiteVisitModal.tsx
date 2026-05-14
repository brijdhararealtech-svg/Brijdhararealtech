import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { PROJECTS } from '../constants';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export default function SiteVisitModal({ isOpen, onClose, defaultProjectId }: SiteVisitModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectId: defaultProjectId || PROJECTS[0].id,
    preferredDate: '',
    preferredTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const project = PROJECTS.find(p => p.id === formData.projectId);
      await addDoc(collection(db, 'visits'), {
        ...formData,
        projectTitle: project?.title || 'Unknown Project',
        userId: auth.currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'visits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass rounded-3xl border-white/10 overflow-hidden relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {success ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-400/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Request Seeded</h3>
                <p className="text-white/40 text-sm">We've received your site visit request. Dheeraj Kumar Saini's team will contact you shortly to confirm the appointment.</p>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                    Experience Harmony
                  </span>
                  <h2 className="text-3xl font-light tracking-tight text-white">Book a <span className="font-serif italic text-amber-200">Site Visit</span></h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 block">Name</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400/30 transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 block">Phone</label>
                      <input 
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400/30 transition-all"
                        placeholder="Contact Number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 block">Select Project</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.projectId}
                        onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white text-sm outline-none focus:border-amber-400/30 transition-all appearance-none"
                      >
                        {PROJECTS.map(p => (
                          <option key={p.id} value={p.id} className="bg-zinc-900">{p.title}</option>
                        ))}
                      </select>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 block">Preferred Date</label>
                      <div className="relative">
                        <input 
                          required
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white text-sm outline-none focus:border-amber-400/30 transition-all"
                        />
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 block">Time (Optional)</label>
                      <input 
                        type="text"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400/30 transition-all"
                        placeholder="e.g. 11:00 AM"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-white text-black py-4 font-bold text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    Confirm Booking Request
                  </button>
                  
                  <p className="text-center text-[9px] uppercase tracking-widest text-white/20">
                    Your spiritual journey begins with a single step.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

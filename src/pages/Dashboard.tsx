import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Enquiry, Visit } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  Loader2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  ClipboardCheck,
  User as UserIcon
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'visits'>('enquiries');

  useEffect(() => {
    if (!user) return;

    // Listen to Enquiries
    const qEnquiries = query(
      collection(db, 'enquiries'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeEnquiries = onSnapshot(qEnquiries, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enquiry[];
      setEnquiries(data);
      if (activeTab === 'enquiries') setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'enquiries');
    });

    // Listen to Visits
    const qVisits = query(
      collection(db, 'visits'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeVisits = onSnapshot(qVisits, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Visit[];
      setVisits(data);
      if (activeTab === 'visits') setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'visits');
    });

    // Initial loading state
    Promise.all([unsubscribeEnquiries, unsubscribeVisits]).then(() => {
        setLoading(false);
    });

    return () => {
      unsubscribeEnquiries();
      unsubscribeVisits();
    };
  }, [user, activeTab]);

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="text-amber-400 animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="text-center glass p-12 rounded-3xl border-white/5 max-w-md">
          <ShieldCheck className="text-amber-400 mx-auto mb-6" size={48} />
          <h1 className="text-2xl font-serif text-white mb-4">Please Sign In</h1>
          <p className="text-white/50 text-sm">You need to be signed in to view your enquiry history.</p>
          <a href="/" className="mt-8 inline-block bg-white text-black px-8 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
            Welcome, {user.displayName || 'User'}
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
            Client <span className="font-serif italic text-amber-200">Portal</span>
          </h1>
          <p className="text-white/40 mt-4 font-light">Manage your journey with Brij Dhara Realtech.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-white/5 pb-px overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={`pb-4 px-2 text-[11px] uppercase tracking-[0.2em] font-bold transition-all relative whitespace-nowrap ${
              activeTab === 'enquiries' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            My Enquiries ({enquiries.length})
            {activeTab === 'enquiries' && <motion.div layoutId="user-tab-active" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />}
          </button>
          <button 
            onClick={() => setActiveTab('visits')}
            className={`pb-4 px-2 text-[11px] uppercase tracking-[0.2em] font-bold transition-all relative whitespace-nowrap ${
              activeTab === 'visits' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Site Visits ({visits.length})
            {activeTab === 'visits' && <motion.div layoutId="user-tab-active" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />}
          </button>
        </div>

        <div className="grid gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === 'enquiries' ? (
              enquiries.length === 0 ? (
                <motion.div 
                  key="user-empty-enquiries"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 glass rounded-3xl border-white/5"
                >
                  <MessageSquare className="text-white/10 mx-auto mb-4" size={48} />
                  <p className="text-white/30 lowercase tracking-widest text-[10px] uppercase font-bold mb-8">You haven't made any inquiries yet</p>
                  <a href="/#contact" className="inline-flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-amber-400/20 px-6 py-3 rounded-xl hover:bg-amber-400 hover:text-black transition-all">
                    Contact an Advisor <ArrowRight size={14} />
                  </a>
                </motion.div>
              ) : (
                <motion.div 
                  key="user-enquiries-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {enquiries.map((enquiry) => (
                    <motion.div
                      key={enquiry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass rounded-2xl border-white/5 p-8 flex flex-col h-full relative overflow-hidden group hover:bg-white/[0.03] transition-all"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border flex items-center gap-2 ${
                          enquiry.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          enquiry.status === 'accepted' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          'bg-red-400/10 text-red-400 border-red-400/20'
                        }`}>
                          {enquiry.status === 'pending' && <Clock size={10} />}
                          {enquiry.status === 'accepted' && <CheckCircle2 size={10} />}
                          {enquiry.status === 'declined' && <XCircle size={10} />}
                          {enquiry.status}
                        </div>
                      </div>

                      <h3 className="text-xl font-serif text-white mb-4 line-clamp-1">{enquiry.subject}</h3>
                      <p className="text-white/40 text-xs line-clamp-3 mb-8 leading-relaxed italic">
                        "{enquiry.message}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                        {enquiry.adminResponse && (
                          <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/10">
                            <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block mb-2 px-1">Advisor Response</span>
                            <p className="text-xs text-white/70 leading-relaxed italic font-light">"{enquiry.adminResponse}"</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">
                          <div className="flex items-center gap-2">
                            <Calendar size={10} />
                            {enquiry.createdAt?.toDate().toLocaleDateString()}
                          </div>
                          <span className="font-mono">#{enquiry.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              visits.length === 0 ? (
                <motion.div 
                  key="user-empty-visits"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 glass rounded-3xl border-white/5"
                >
                  <MapPin className="text-white/10 mx-auto mb-4" size={48} />
                  <p className="text-white/30 lowercase tracking-widest text-[10px] uppercase font-bold mb-8">No site visits scheduled</p>
                  <a href="/about" className="inline-flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-amber-400/20 px-6 py-3 rounded-xl hover:bg-amber-400 hover:text-black transition-all">
                    Schedule a Visit <ArrowRight size={14} />
                  </a>
                </motion.div>
              ) : (
                <motion.div 
                  key="user-visits-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {visits.map((visit) => (
                    <motion.div
                      key={visit.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass rounded-2xl border-white/5 p-8 flex flex-col h-full relative overflow-hidden group hover:bg-white/[0.03] transition-all"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border flex items-center gap-2 ${
                          visit.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          visit.status === 'confirmed' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          visit.status === 'completed' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                          'bg-red-400/10 text-red-400 border-red-400/20'
                        }`}>
                          {visit.status === 'pending' && <Clock size={10} />}
                          {visit.status === 'confirmed' && <CheckCircle2 size={10} />}
                          {visit.status === 'completed' && <ClipboardCheck size={10} />}
                          {visit.status === 'cancelled' && <XCircle size={10} />}
                          {visit.status}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">Project</div>
                        <h3 className="text-xl font-serif text-white">{visit.projectTitle}</h3>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-white/60">
                          <Calendar size={14} className="text-amber-400" />
                          <span className="text-xs">{visit.preferredDate}</span>
                        </div>
                        {visit.preferredTime && (
                           <div className="flex items-center gap-3 text-white/60">
                            <Clock size={14} className="text-amber-400" />
                            <span className="text-xs">{visit.preferredTime}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-white/60">
                          <MapPin size={14} className="text-amber-400" />
                          <span className="text-xs">Location to be shared on confirm</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                        {visit.adminNotes && (
                          <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/10">
                            <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block mb-2 px-1">Special Instructions</span>
                            <p className="text-xs text-white/70 leading-relaxed italic font-light">"{visit.adminNotes}"</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">
                          <div className="flex items-center gap-2 text-white/20">
                            <Clock size={10} />
                            Booked: {visit.createdAt?.toDate().toLocaleDateString()}
                          </div>
                          <span className="font-mono">#{visit.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

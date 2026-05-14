import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Enquiry, Visit } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User as UserIcon, 
  Phone, 
  Mail, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  MapPin,
  ClipboardList,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'visits'>('enquiries');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to Enquiries
    const qEnquiries = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
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
    const qVisits = query(collection(db, 'visits'), orderBy('createdAt', 'desc'));
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
  }, [isAdmin, activeTab]);

  const handleEnquiryStatus = async (id: string, status: 'pending' | 'accepted' | 'declined', adminResponse: string) => {
    setProcessingId(id);
    try {
      await updateDoc(doc(db, 'enquiries', id), {
        status,
        adminResponse,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `enquiries/${id}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleVisitStatus = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled', adminNotes: string) => {
    setProcessingId(id);
    try {
      await updateDoc(doc(db, 'visits', id), {
        status,
        adminNotes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `visits/${id}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || (loading && isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="text-amber-400 animate-spin" size={40} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="text-center glass p-12 rounded-3xl border-white/5 max-w-md">
          <XCircle className="text-red-400 mx-auto mb-6" size={48} />
          <h1 className="text-2xl font-serif text-white mb-4">Access Denied</h1>
          <p className="text-white/50 text-sm">You do not have administrative privileges to view this page.</p>
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
        <div className="mb-12">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
            Management
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
            Admin <span className="font-serif italic text-amber-200">Dashboard</span>
          </h1>
          <p className="text-white/40 mt-4 font-light">Oversee and manage all incoming user enquiries and site visit requests.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/5 pb-px">
          <button 
            onClick={() => { setActiveTab('enquiries'); setExpandedId(null); }}
            className={`pb-4 px-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${
              activeTab === 'enquiries' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Enquiries
            {activeTab === 'enquiries' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />}
          </button>
          <button 
            onClick={() => { setActiveTab('visits'); setExpandedId(null); }}
            className={`pb-4 px-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${
              activeTab === 'visits' ? 'text-amber-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Site Visits
            {activeTab === 'visits' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />}
          </button>
        </div>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === 'enquiries' ? (
              enquiries.length === 0 ? (
                <motion.div 
                  key="empty-enquiries"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 glass rounded-3xl border-white/5"
                >
                  <MessageSquare className="text-white/10 mx-auto mb-4" size={48} />
                  <p className="text-white/30 lowercase tracking-widest text-xs">No enquiries found</p>
                </motion.div>
              ) : (
                enquiries.map((enquiry) => (
                  <motion.div
                    key={enquiry.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass rounded-2xl border-white/5 overflow-hidden transition-all ${expandedId === enquiry.id ? 'ring-1 ring-amber-400/30' : ''}`}
                  >
                    <div 
                      className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-6"
                      onClick={() => setExpandedId(expandedId === enquiry.id ? null : enquiry.id)}
                    >
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{enquiry.name}</h3>
                          <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                            <Calendar size={10} />
                            {enquiry.createdAt?.toDate().toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-[150px]">
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-bold mb-1">Subject</div>
                        <div className="text-xs text-white/70 font-medium">{enquiry.subject}</div>
                      </div>

                      <div className="hidden sm:block min-w-[150px]">
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-bold mb-1">Phone</div>
                        <div className="text-xs text-white/70">{enquiry.phone}</div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
                          enquiry.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          enquiry.status === 'accepted' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          'bg-red-400/10 text-red-400 border-red-400/20'
                        }`}>
                          {enquiry.status}
                        </div>
                        <button className="text-white/20 hover:text-white transition-colors">
                          {expandedId === enquiry.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === enquiry.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5"
                        >
                          <div className="p-8 bg-white/[0.02]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3 flex items-center gap-2">
                                    <MessageSquare size={12} />
                                    User Message
                                  </h4>
                                  <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-white/70 text-sm leading-relaxed italic">
                                    "{enquiry.message}"
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4">
                                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all">
                                    <Phone size={14} /> Call User
                                  </a>
                                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
                                    <Mail size={14} /> Email Unavailable
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Action Required</h4>
                                
                                {enquiry.status === 'pending' ? (
                                  <div className="space-y-4">
                                    <textarea 
                                      id={`response-${enquiry.id}`}
                                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-amber-400/30 transition-all"
                                      placeholder="Add an internal note or response message..."
                                      rows={3}
                                    ></textarea>
                                    <div className="flex gap-4">
                                      <button 
                                        onClick={() => {
                                          const note = (document.getElementById(`response-${enquiry.id}`) as HTMLTextAreaElement).value;
                                          handleEnquiryStatus(enquiry.id, 'accepted', note);
                                        }}
                                        disabled={processingId === enquiry.id}
                                        className="flex-1 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                      >
                                        {processingId === enquiry.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                        Accept
                                      </button>
                                      <button 
                                        onClick={() => {
                                          const note = (document.getElementById(`response-${enquiry.id}`) as HTMLTextAreaElement).value;
                                          handleEnquiryStatus(enquiry.id, 'declined', note);
                                        }}
                                        disabled={processingId === enquiry.id}
                                        className="flex-1 bg-red-500 text-white font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg hover:bg-red-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                      >
                                        {processingId === enquiry.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                        Decline
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Decision</span>
                                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${enquiry.status === 'accepted' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {enquiry.status}
                                      </span>
                                    </div>
                                    {enquiry.adminResponse && (
                                      <>
                                        <div className="h-[1px] bg-white/5" />
                                        <div>
                                          <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold block mb-2">Admin Note</span>
                                          <p className="text-xs text-white/50 italic">"{enquiry.adminResponse}"</p>
                                        </div>
                                      </>
                                    )}
                                    <button 
                                       onClick={() => handleEnquiryStatus(enquiry.id, 'pending', '')}
                                       className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                                    >
                                      Reset to Pending
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )
            ) : (
              visits.length === 0 ? (
                <motion.div 
                  key="empty-visits"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 glass rounded-3xl border-white/5"
                >
                  <MapPin className="text-white/10 mx-auto mb-4" size={48} />
                  <p className="text-white/30 lowercase tracking-widest text-xs">No visit requests found</p>
                </motion.div>
              ) : (
                visits.map((visit) => (
                  <motion.div
                    key={visit.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass rounded-2xl border-white/5 overflow-hidden transition-all ${expandedId === visit.id ? 'ring-1 ring-amber-400/30' : ''}`}
                  >
                    <div 
                      className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-6"
                      onClick={() => setExpandedId(expandedId === visit.id ? null : visit.id)}
                    >
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{visit.name}</h3>
                          <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                            <Calendar size={10} />
                            Requested for: {visit.preferredDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-[150px]">
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-bold mb-1">Project</div>
                        <div className="text-xs text-white/70 font-medium">{visit.projectTitle}</div>
                      </div>

                      <div className="hidden sm:block min-w-[150px]">
                        <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-bold mb-1">Phone</div>
                        <div className="text-xs text-white/70">{visit.phone}</div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
                          visit.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          visit.status === 'confirmed' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          visit.status === 'completed' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                          'bg-red-400/10 text-red-400 border-red-400/20'
                        }`}>
                          {visit.status}
                        </div>
                        <button className="text-white/20 hover:text-white transition-colors">
                          {expandedId === visit.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === visit.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5"
                        >
                          <div className="p-8 bg-white/[0.02]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">Preferred Date</div>
                                    <div className="text-sm text-white font-medium">{visit.preferredDate}</div>
                                  </div>
                                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">Preferred Time</div>
                                    <div className="text-sm text-white font-medium">{visit.preferredTime || 'Not specified'}</div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                  <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">User Phone</div>
                                  <div className="text-sm text-white font-medium flex items-center gap-2">
                                    <Phone size={14} className="text-amber-400" />
                                    {visit.phone}
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <a href={`tel:${visit.phone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/60 hover:bg-white/10 transition-all">
                                    <Phone size={14} /> Call Now
                                  </a>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Update Status</h4>
                                
                                <div className="space-y-4">
                                  <textarea 
                                    id={`visit-note-${visit.id}`}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-amber-400/30 transition-all"
                                    placeholder="Add internal notes or customer follow-up..."
                                    rows={3}
                                    defaultValue={visit.adminNotes || ''}
                                  ></textarea>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <button 
                                      onClick={() => {
                                        const note = (document.getElementById(`visit-note-${visit.id}`) as HTMLTextAreaElement).value;
                                        handleVisitStatus(visit.id, 'confirmed', note);
                                      }}
                                      disabled={processingId === visit.id}
                                      className="bg-emerald-500 text-white font-bold text-[9px] uppercase tracking-widest py-3 rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                      {processingId === visit.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                      Confirm
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const note = (document.getElementById(`visit-note-${visit.id}`) as HTMLTextAreaElement).value;
                                        handleVisitStatus(visit.id, 'completed', note);
                                      }}
                                      disabled={processingId === visit.id}
                                      className="bg-blue-500 text-white font-bold text-[9px] uppercase tracking-widest py-3 rounded-lg hover:bg-blue-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                      {processingId === visit.id ? <Loader2 size={12} className="animate-spin" /> : <ClipboardList size={12} />}
                                      Done
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const note = (document.getElementById(`visit-note-${visit.id}`) as HTMLTextAreaElement).value;
                                        handleVisitStatus(visit.id, 'cancelled', note);
                                      }}
                                      disabled={processingId === visit.id}
                                      className="bg-red-500 text-white font-bold text-[9px] uppercase tracking-widest py-3 rounded-lg hover:bg-red-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                      {processingId === visit.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                      Cancel
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const note = (document.getElementById(`visit-note-${visit.id}`) as HTMLTextAreaElement).value;
                                        handleVisitStatus(visit.id, 'pending', note);
                                      }}
                                      disabled={processingId === visit.id}
                                      className="bg-white/5 border border-white/10 text-white font-bold text-[9px] uppercase tracking-widest py-3 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

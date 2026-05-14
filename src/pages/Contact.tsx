import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2,
  Instagram,
  Facebook
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...formData,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || formData.email,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'enquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                Connect With Us
              </span>
              <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-6">
                Let's Start a <span className="font-serif italic text-amber-200">Conversation</span>
              </h1>
              <p className="text-white/40 text-lg font-light leading-relaxed max-w-lg">
                Whether you're looking for your dream plot in the holy land or seeking a strategic commercial investment, our advisors are here to guide you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all duration-500">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Call Us</div>
                  <a href="tel:7055505641" className="text-xl font-medium tracking-tight text-white hover:text-amber-400 transition-colors">7055505641</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all duration-500">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</div>
                  <a href="mailto:brijdhararealtech@gmail.com" className="text-xl font-medium tracking-tight text-white hover:text-amber-400 transition-colors">brijdhararealtech@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all duration-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Our Office</div>
                  <div className="text-xl font-medium tracking-tight text-white leading-tight">Sonkh Road, Opp. Hanuman Temple,<br />Mathura - 281004</div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-6">Follow Our Journey</div>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all text-white/60">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all text-white/60">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border-white/10 p-8 md:p-12 relative"
          >
            {success ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-400/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Message Sent</h3>
                <p className="text-white/40 text-sm">We've received your inquiry. One of our advisors will get back to you shortly.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-amber-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Your Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-amber-400/30 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-amber-400/30 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-amber-400/30 outline-none transition-all appearance-none"
                  >
                    <option value="General Inquiry" className="bg-zinc-900">General Inquiry</option>
                    <option value="Residential Plots" className="bg-zinc-900">Residential Plots</option>
                    <option value="Commercial Land" className="bg-zinc-900">Commercial Land</option>
                    <option value="Investment" className="bg-zinc-900">Investment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Your Message</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-amber-400/30 outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-white text-black py-5 rounded-xl font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-amber-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                  Send Inquiry
                </button>

                <p className="text-center text-[9px] uppercase tracking-widest text-white/20">
                  By submitting, you agree to our privacy policy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

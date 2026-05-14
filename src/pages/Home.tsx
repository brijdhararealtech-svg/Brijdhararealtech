import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Compass,
  Phone,
  Mail,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Project } from '../types';
import { PROJECTS, HERO_VIDEO, HERO_FALLBACK } from '../constants';
import { useAuth } from '../components/AuthContext';
import SiteVisitModal from '../components/SiteVisitModal';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

const ProjectCard = ({ project, index, onBookVisit }: { project: Project; index: number; onBookVisit: (id: string) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      id={`project-${project.id}`}
      className="group relative overflow-hidden glass rounded-2xl aspect-square md:aspect-[4/5] p-2"
    >
      <div className="w-full h-full rounded-xl overflow-hidden relative">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-[9px] uppercase tracking-[0.2em] font-bold">
              <span className="w-6 h-[1px] bg-amber-400"></span>
              {project.type}
            </div>
            <h3 className="text-2xl font-serif text-white">{project.title}</h3>
            <div className="flex items-center gap-1 text-white/50 text-[10px] uppercase tracking-widest">
              <MapPin size={10} />
              {project.location}
            </div>
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              whileHover={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-white/60 text-xs mt-3 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </motion.div>
            <button 
              onClick={() => onBookVisit(project.id)}
              className="flex items-center gap-2 text-amber-100 text-[10px] uppercase tracking-widest mt-4 group/btn font-bold"
            >
              Book Site Visit 
              <ArrowRight size={12} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ContactForm = () => {
  const { user, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Project Enquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      signIn();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'enquiries'), {
        ...formData,
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', subject: 'Project Enquiry', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'enquiries');
      setError("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-200 text-sm font-medium"
          >
            <CheckCircle2 size={18} />
            Your enquiry has been sent successfully!
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Full Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/5 p-5 focus:border-amber-400/50 outline-none transition-all rounded-xl backdrop-blur-sm shadow-inner text-white" 
            placeholder="John Doe" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Phone Number</label>
          <input 
            type="tel" 
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-white/5 border border-white/5 p-5 focus:border-amber-400/50 outline-none transition-all rounded-xl backdrop-blur-sm shadow-inner text-white" 
            placeholder="+91 ..." 
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Subject</label>
        <select 
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full bg-white/5 border border-white/5 p-5 focus:border-amber-400/50 outline-none transition-all rounded-xl backdrop-blur-sm appearance-none shadow-inner text-white"
        >
          <option className="bg-zinc-900" value="Project Enquiry">Project Enquiry</option>
          <option className="bg-zinc-900" value="Site Visit Request">Site Visit Request</option>
          <option className="bg-zinc-900" value="Investment Advice">Investment Advice</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Message</label>
        <textarea 
          rows={4} 
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-white/5 border border-white/5 p-5 focus:border-amber-400/50 outline-none transition-all rounded-xl backdrop-blur-sm shadow-inner text-white" 
          placeholder="How can we help?"
        ></textarea>
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white text-black py-5 uppercase tracking-[0.3em] text-[10px] font-black hover:bg-amber-400 transition-all rounded-xl shadow-2xl shadow-white/5 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Sending...
          </>
        ) : user ? 'Send Message' : 'Sign up to Send Message'}
      </button>
    </form>
  );
};

export default function Home() {
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const handleBookVisit = (projectId?: string) => {
    setSelectedProjectId(projectId);
    setIsVisitModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_FALLBACK} 
            className="w-full h-full object-cover brightness-[0.6] scale-105" 
            alt="Divine Sunrise"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit mx-auto mb-8">
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                Cinematic Architecture
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light leading-[1.1] tracking-tight mb-8 text-white">
              Developing the <br />
              <span className="text-luxury italic text-amber-200">Soul of Brij</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto mb-12 text-lg font-light leading-relaxed">
              Preserving the divine essence of Mathura & Vrindavan through curated land developments and architectural masterpieces.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#projects" className="bg-white text-black px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-amber-400 transition-colors rounded-sm flex items-center justify-center">
                Explore Plots
              </a>
              <a href="#about" className="border border-white/20 hover:bg-white/10 backdrop-blur-sm text-white px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-colors rounded-sm flex items-center justify-center">
                Our Legacy
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-amber-400 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-luxury">
          {[
            { label: 'Total Land Area', value: '140K SQ. FT.' },
            { label: 'Active Plots', value: '48 AVAILABLE' },
            { label: 'Years of Trust', value: '15+ YEARS' },
            { label: 'Status', value: 'CERTIFIED RAW' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-lg font-mono text-white mb-1 uppercase">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-32 px-6 bg-transparent relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                Portfolio
              </span>
              <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white">Our Iconic <span className="font-serif italic text-amber-200">Projects</span></h2>
            </div>
            <a href="#projects" className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 border-b border-amber-400/30 pb-2 hover:text-amber-400 hover:border-amber-400 transition-all">
              Explore All Plots
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PROJECTS.map((project, index) => (
              <div key={project.id}>
                <ProjectCard project={project} index={index} onBookVisit={handleBookVisit} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-32 relative overflow-hidden bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center justify-center text-center lg:text-left">
            <div className="max-w-3xl space-y-12 text-white">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                  Why Brij Dhara
                </span>
                <h2 className="text-4xl md:text-5xl font-light leading-tight tracking-tight">Crafting Spaces for <span className="font-serif italic text-amber-200">Generations</span></h2>
                <p className="text-white/50 mt-6 leading-relaxed font-light text-lg">
                  We don't just sell plots; we provide the canvas for your dreams. 
                  Our expertise in the Mathura-Vrindavan region ensures you get 
                  the most secure and valuable investments in the land of spirituality.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: <ShieldCheck className="text-amber-400" size={20} />, title: 'RERA Approved', desc: 'Compliant and secure documentation.' },
                  { icon: <MapPin className="text-amber-400" size={20} />, title: 'Prime Location', desc: 'Connectivity to main spiritual hubs.' },
                  { icon: <Compass className="text-amber-400" size={20} />, title: 'Smart Planning', desc: 'Modern infrastructure in every project.' },
                  { icon: <Leaf className="text-amber-400" size={20} />, title: 'Eco-Friendly', desc: 'Sustainable land development.' },
                ].map((item) => (
                  <div key={item.title} className="space-y-3 p-6 glass rounded-2xl border-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-amber-400/10 w-fit rounded-xl border border-amber-400/20">{item.icon}</div>
                    <h4 className="font-serif italic text-lg text-amber-50">{item.title}</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-transparent relative">
        <div className="max-w-7xl mx-auto glass p-10 md:p-20 rounded-3xl relative overflow-hidden border-white/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="text-white">
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                Connect
              </span>
              <h2 className="text-4xl md:text-5xl font-light leading-tight tracking-tight mb-8">Start Your Journey in the <br /><span className="font-serif italic text-amber-200">Divine Land</span></h2>
              <p className="text-white/40 mb-12 text-lg font-light leading-relaxed">
                Have questions about our plots or upcoming projects? 
                Our advisors are here to help you make the right choice.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-amber-400 glass group-hover:bg-amber-400 group-hover:text-black transition-all duration-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Call Us</div>
                    <a href="tel:7055505641" className="text-xl font-medium tracking-tight hover:text-amber-400 transition-colors">7055505641</a>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-amber-400 glass group-hover:bg-amber-400 group-hover:text-black transition-all duration-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</div>
                    <a href="mailto:brijdhararealtech@gmail.com" className="text-xl font-medium tracking-tight hover:text-amber-400 transition-colors">brijdhararealtech@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-amber-400 glass group-hover:bg-amber-400 group-hover:text-black transition-all duration-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Our Office</div>
                    <div className="text-xl font-medium tracking-tight text-white leading-tight">Sonkh Road, Opp. Hanuman Temple,<br />Mathura - 281004</div>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <SiteVisitModal 
        isOpen={isVisitModalOpen} 
        onClose={() => setIsVisitModalOpen(false)} 
        defaultProjectId={selectedProjectId}
      />
    </>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import SiteVisitModal from '../components/SiteVisitModal';
import { 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Leaf, 
  History, 
  Users, 
  Award,
  Globe,
  Quote
} from 'lucide-react';

export default function About() {
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  return (
    <div className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="px-6 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                Our Legacy
              </span>
              <h1 className="text-6xl md:text-7xl font-light leading-tight tracking-tight mb-8">
                Preserving the <br />
                <span className="font-serif italic text-amber-200">Divine Essence</span>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
                Brij Dhara Realtech was founded with a singular vision: to honor the sacred land of Mathura and Vrindavan by developing spaces that respect its heritage while providing modern security for families and investors.
              </p>
              <div className="flex gap-12">
                <div>
                  <div className="text-3xl font-serif text-white mb-1">11+</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-white mb-1">500+</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Happy Families</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-white mb-1">20+</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Projects Delivered</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="aspect-square glass p-3 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544013583-4458421bcaba?auto=format&fit=crop&q=80&w=1600" 
                  alt="Ancient Temple Mathura" 
                  className="w-full h-full object-cover rounded-2xl grayscale brightness-75"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-dark p-6 rounded-2xl border-white/5 max-w-[200px]">
                <Quote className="text-amber-400/30 mb-2" size={24} />
                <p className="text-[11px] text-white/70 italic leading-relaxed">"The earth has music for those who listen. In Brij, the earth speaks of the divine."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white/5 border-y border-white/5 backdrop-blur-sm px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
            Principles
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white">The Pillars of <span className="font-serif italic text-amber-200">Trust</span></h2>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck size={28} />, title: 'Integrity', desc: 'Every transaction is built on complete transparency and legal compliance.' },
            { icon: <Compass size={28} />, title: 'Vision', desc: 'We see the potential in land where others only see soil, planning for the future.' },
            { icon: <Leaf size={28} />, title: 'Harmony', desc: 'Our developments blend seamlessly with the natural and spiritual environment.' },
            { icon: <Award size={28} />, title: 'Excellence', desc: 'Superior infrastructure and amenities are the standard for every project.' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 glass rounded-3xl border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif text-white mb-3 tracking-tight">{item.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-wider">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3 flex items-center gap-4">
              <History className="text-amber-400" size={32} />
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-serif text-white mb-6 italic tracking-tight">Our Journey</h3>
              <p className="text-white/50 leading-relaxed font-light mb-6">
                Starting as a small family advisory in the early 2010s, Brij Dhara Realtech recognized the growing need for organized real estate in a region primarily dominated by unverified deals. We took it upon ourselves to map every yard, verify every title, and curate a portfolio that investors could trust blindly.
              </p>
              <p className="text-white/50 leading-relaxed font-light">
                Today, we stand as one of the most respected names in Mathura-Vrindavan real estate, known not just for our land holdings, but for our commitment to the spiritual preservation of the "Brij" culture.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-12 items-start">
            <div className="w-full md:w-1/3 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/10" />
              <Users className="text-amber-400" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-serif text-white mb-6 italic tracking-tight">Community Focused</h3>
              <p className="text-white/50 leading-relaxed font-light mb-6">
                We believe that every development should enrich the community it sits within. A significant portion of our project revenue is reinvested into local amenities, temple restorations, and ecological preservation initiatives in the region.
              </p>
              <p className="text-white/50 leading-relaxed font-light">
                When you invest with us, you are not just buying a plot; you are participating in the sustainable growth of one of the world's most sacred landscapes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                Visionary Leadership
              </span>
              <h2 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-8">
                Dheeraj Kumar <br />
                <span className="font-serif italic text-amber-200">Saini</span>
              </h2>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-8 flex items-center justify-center gap-4">
                <span className="w-12 h-[1px] bg-white/10"></span>
                Head of Company • Visionary Developer
                <span className="w-12 h-[1px] bg-white/10"></span>
              </div>
              <div className="space-y-6 text-white/60 font-light text-lg leading-relaxed">
                <p>
                  With a deep-rooted connection to the Brij region, Dheeraj Kumar Saini has been the driving force behind Brij Dhara Realtech's success. His philosophy centers on the belief that real estate is not just about transactions, but about building lasting legacies.
                </p>
                <p>
                  Under his leadership, the company has pioneered transparent practices in Mathura-Vrindavan, ensuring that every plot owner feels secure and connected to the spiritual heritage of the land.
                </p>
                <div className="pt-8 flex flex-col items-center">
                   <Quote className="text-amber-400 mb-4" size={32} />
                   <p className="text-xl font-serif italic text-amber-100 max-w-2xl">
                     "Our goal is to create spaces where divinity meets modern living, providing a sanctuary for generations to come."
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-amber-400" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8">Ready to witness the <br /><span className="font-serif italic text-amber-200">Tradition</span>?</h2>
            <p className="text-white/40 max-w-xl mx-auto mb-12 text-lg font-light leading-relaxed">
              Schedule a visit to any of our current project sites and experience the harmony of divine land and modern vision firsthand.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setIsVisitModalOpen(true)}
                className="bg-white text-black px-12 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-amber-400 transition-colors rounded-xl"
              >
                Book a Site Visit
              </button>
              <a href="/#projects" className="border border-white/20 hover:bg-white/10 text-white px-12 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-colors rounded-xl backdrop-blur-sm flex items-center justify-center">
                View All Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteVisitModal isOpen={isVisitModalOpen} onClose={() => setIsVisitModalOpen(false)} />
    </div>
  );
}

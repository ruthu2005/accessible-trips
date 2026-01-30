// HPI 1.7-G
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Compass, Shield, Heart, Star, ChevronRight, ArrowRight, MapPin, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TourPackages } from '@/entities';

// --- Utility Components for Layout & Motion ---

const SectionDivider = () => (
  <div className="w-full flex justify-center py-12 opacity-20">
    <div className="h-24 w-px bg-gradient-to-b from-transparent via-foreground to-transparent" />
  </div>
);

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          width={1200}
        />
      </motion.div>
    </div>
  );
};

export default function HomePage() {
  // --- Data Fidelity Protocol: Canonical Data Sources ---
  const [featuredTours, setFeaturedTours] = useState<TourPackages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fidelity Protocol: Preservation of Logic ---
  useEffect(() => {
    loadFeaturedTours();
  }, []);

  const loadFeaturedTours = async () => {
    try {
      const result = await BaseCrudService.getAll<TourPackages>('tourpackages', {}, { limit: 3 });
      setFeaturedTours(result.items);
    } catch (error) {
      console.error('Error loading featured tours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Motion Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const heroRef = useRef(null);
  const heroScroll = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll.scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScroll.scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-clip selection:bg-accent-gold/30">
      <Header />

      {/* --- HERO SECTION: Immersive Split with Parallax --- */}
      <section ref={heroRef} className="relative w-full min-h-[95vh] flex flex-col md:flex-row overflow-hidden">
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-24 z-10 bg-background/90 md:bg-background">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-accent-gold" />
              <span className="font-paragraph text-sm tracking-[0.2em] uppercase text-accent-gold font-medium">
                Travel Without Limits
              </span>
            </div>
            
            <h1 className="font-heading text-6xl md:text-8xl text-foreground leading-[0.95] mb-8 tracking-tight">
              Discover <br />
              <span className="italic text-accent-gold">Accessible</span> <br />
              Adventures
            </h1>
            
            <p className="font-paragraph text-lg md:text-xl text-secondary leading-relaxed mb-12 max-w-lg">
              Experience the world without barriers. We curate exceptional travel experiences designed for elderly travelers and differently-abled explorers.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/tours">
                <Button className="bg-foreground text-background hover:bg-accent-gold hover:text-white transition-all duration-500 text-base px-10 py-7 rounded-full h-auto font-paragraph tracking-wide">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant="outline" className="border-foreground/20 text-foreground hover:border-accent-gold hover:text-accent-gold transition-all duration-500 text-base px-10 py-7 rounded-full h-auto font-paragraph tracking-wide bg-transparent">
                  Read Stories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Image Parallax */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute md:relative w-full md:w-1/2 h-full inset-0 md:inset-auto z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent md:hidden z-10" />
          <Image
            src="https://static.wixstatic.com/media/3082d7_1cfbcff35e7c4090843fb840b8a16966~mv2.png?originWidth=1600&originHeight=896"
            alt="Serene accessible landscape"
            className="w-full h-full object-cover"
            width={1600}
          />
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-8 md:left-20 z-20 flex items-center gap-4"
        >
          <div className="w-px h-16 bg-foreground/20 overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-full h-1/2 bg-accent-gold"
            />
          </div>
          <span className="font-paragraph text-xs uppercase tracking-widest text-secondary/60 rotate-90 origin-left translate-y-2">
            Scroll
          </span>
        </motion.div>
      </section>

      <SectionDivider />

      {/* --- MISSION / FEATURES: Sticky Narrative Flow --- */}
      <section id="features" className="w-full py-24 md:py-32 bg-background relative">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-16 md:gap-32">
            
            {/* Sticky Title */}
            <div className="md:w-1/3">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="font-heading text-5xl md:text-6xl text-foreground mb-8 leading-none">
                    Why Choose <br />
                    <span className="text-accent-gold">ACCESS-TOUR</span>
                  </h2>
                  <p className="font-paragraph text-lg text-secondary leading-relaxed mb-12">
                    We prioritize your comfort and accessibility, ensuring every journey is tailored to your unique needs with precision and care.
                  </p>
                  <div className="hidden md:block w-24 h-1 bg-accent-gold/20" />
                </motion.div>
              </div>
            </div>

            {/* Scrolling Features List */}
            <div className="md:w-2/3 flex flex-col gap-24">
              {[
                {
                  icon: Shield,
                  title: "Verified Accessibility",
                  desc: "Every tour is thoroughly assessed for wheelchair access, mobility requirements, and accessibility features to ensure your safety and comfort.",
                  delay: 0.1
                },
                {
                  icon: Compass,
                  title: "Personalized Recommendations",
                  desc: "Our intelligent system matches tours to your preferences, budget, travel style, and specific accessibility needs for a perfect fit.",
                  delay: 0.2
                },
                {
                  icon: Heart,
                  title: "Trusted by Travelers",
                  desc: "Read authentic reviews from fellow travelers who share their experiences, helping you make informed decisions with confidence.",
                  delay: 0.3
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: feature.delay }}
                  className="group"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start border-t border-foreground/10 pt-12">
                    <div className="shrink-0 p-6 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-all duration-500 group-hover:-translate-y-2">
                      <feature.icon className="w-10 h-10 text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl text-foreground mb-4 group-hover:text-accent-gold transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="font-paragraph text-lg text-secondary leading-relaxed max-w-xl">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- VISUAL BREATHER: Full Bleed Quote --- */}
      <section className="w-full py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage 
            src="https://static.wixstatic.com/media/3082d7_9437d48c910f4309880a976dd5ceb468~mv2.png?originWidth=1600&originHeight=1152"
            alt="Atmospheric travel background"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-[100rem] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Compass className="w-16 h-16 text-white/80 mx-auto mb-8" />
            <h2 className="font-heading text-4xl md:text-6xl text-white leading-tight max-w-4xl mx-auto mb-8">
              "The world is vast, beautiful, and belongs to everyone. We just make sure the path is clear."
            </h2>
            <div className="w-20 h-px bg-white/50 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED TOURS: Alternating Magazine Layout --- */}
      <section id="tours" className="w-full py-32 bg-background">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-paragraph text-sm tracking-[0.2em] uppercase text-accent-gold font-medium block mb-4">
                Curated Destinations
              </span>
              <h2 className="font-heading text-5xl md:text-6xl text-foreground">
                Featured Tours
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 md:mt-0"
            >
              <Link to="/tours">
                <Button variant="ghost" className="text-foreground hover:text-accent-gold font-paragraph text-lg group p-0 hover:bg-transparent">
                  View All Collections
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col gap-24">
            {isLoading ? (
              // Loading Skeleton
              [1, 2].map((i) => (
                <div key={i} className="w-full h-96 bg-secondary/5 animate-pulse rounded-lg" />
              ))
            ) : featuredTours.length > 0 ? (
              featuredTours.map((tour, index) => (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8 }}
                >
                  <Link to={`/tours/${tour._id}`} className="group block">
                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
                      
                      {/* Image Side */}
                      <div className="w-full md:w-3/5 overflow-hidden rounded-lg relative aspect-[16/10]">
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500 z-10" />
                        <Image
                          src={tour.tourImages || 'https://static.wixstatic.com/media/3082d7_5e1e3db6bef64292b8b7a34d9ebd5a29~mv2.png?originWidth=960&originHeight=576'}
                          alt={tour.tourName || 'Tour destination'}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                          width={1000}
                        />
                        <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                          <span className="font-paragraph text-xs font-bold tracking-wider uppercase text-foreground">
                            {tour.budgetCategory || 'Premium'}
                          </span>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="w-full md:w-2/5">
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="w-5 h-5 text-accent-gold fill-accent-gold" />
                          <span className="font-paragraph text-foreground font-medium">
                            {tour.overallAccessibilityScore ? `${tour.overallAccessibilityScore}/10 Accessibility Score` : 'Highly Accessible'}
                          </span>
                        </div>
                        
                        <h3 className="font-heading text-4xl md:text-5xl text-foreground mb-6 group-hover:text-accent-gold transition-colors duration-300">
                          {tour.tourName}
                        </h3>
                        
                        <p className="font-paragraph text-lg text-secondary mb-8 line-clamp-3 leading-relaxed">
                          {tour.tourDescription}
                        </p>

                        <div className="flex items-center gap-6 text-sm font-paragraph text-secondary/80">
                          <div className="flex items-center gap-2">
                            <Accessibility className="w-4 h-4" />
                            <span>Wheelchair Friendly</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Guided Tours</span>
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-foreground/10 flex items-center text-foreground font-medium group-hover:translate-x-2 transition-transform duration-300">
                          View Itinerary <ArrowRight className="ml-2 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 bg-secondary/5 rounded-2xl">
                <p className="font-paragraph text-xl text-secondary">
                  Our curated collection is currently being updated. Please check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION: Minimalist & Bold --- */}
      <section className="w-full py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-gold/5 skew-x-12 translate-x-20" />
        
        <div className="max-w-[100rem] mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-2/3"
            >
              <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-none">
                Ready to Start <br />
                <span className="text-accent-gold">Your Journey?</span>
              </h2>
              <p className="font-paragraph text-xl text-background/80 max-w-2xl leading-relaxed">
                Discover tours tailored to your accessibility needs and travel preferences. Let us handle the details while you make the memories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/3 flex justify-center md:justify-end"
            >
              <Link to="/tours">
                <Button className="bg-accent-gold hover:bg-white hover:text-foreground text-white transition-all duration-500 text-lg px-12 py-8 rounded-full h-auto font-paragraph tracking-wide shadow-2xl shadow-accent-gold/20">
                  Find Your Perfect Tour
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
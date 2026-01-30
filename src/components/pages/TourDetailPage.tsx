import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Accessibility, Volume2, TrendingDown, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TourPackages, TourFeedback } from '@/entities';

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<TourPackages | null>(null);
  const [feedbacks, setFeedbacks] = useState<TourFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTourDetails();
      loadFeedbacks();
    }
  }, [id]);

  const loadTourDetails = async () => {
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<TourPackages>('tourpackages', id!);
      setTour(data);
    } catch (error) {
      console.error('Error loading tour details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const result = await BaseCrudService.getAll<TourFeedback>('tourfeedback', {}, { limit: 50 });
      const tourFeedbacks = result.items.filter(fb => fb.tourTitle === tour?.tourName);
      setFeedbacks(tourFeedbacks);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
  };

  useEffect(() => {
    if (tour) {
      loadFeedbacks();
    }
  }, [tour]);

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbacks.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full bg-background py-12" style={{ minHeight: isLoading ? '600px' : 'auto' }}>
        <div className="max-w-[100rem] mx-auto px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : !tour ? (
            <div className="text-center py-20">
              <h2 className="font-heading text-3xl text-foreground mb-4">Tour Not Found</h2>
              <p className="font-paragraph text-lg text-secondary mb-8">
                The tour you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/tours">
                <Button className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-8 py-6 rounded-md h-auto">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Tours
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <Link to="/tours">
                  <Button variant="ghost" className="text-secondary hover:text-accent-gold font-paragraph text-base">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Tours
                  </Button>
                </Link>
              </motion.div>

              {/* Tour Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="aspect-[21/9] rounded-lg overflow-hidden">
                  <Image
                    src={tour.tourImages || 'https://static.wixstatic.com/media/3082d7_df1151072970450f85fea69825c7e1f9~mv2.png?originWidth=1600&originHeight=640'}
                    alt={tour.tourName || 'Tour destination'}
                    className="w-full h-full object-cover"
                    width={1600}
                  />
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
                      {tour.tourName}
                    </h1>

                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-accent-gold fill-accent-gold" />
                        <span className="font-paragraph text-lg text-foreground font-medium">
                          {averageRating}
                        </span>
                        <span className="font-paragraph text-base text-secondary">
                          ({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-accent-gold fill-accent-gold" />
                        <span className="font-paragraph text-base text-secondary">
                          Accessibility Score: {tour.overallAccessibilityScore || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-8 mb-8">
                      <h2 className="font-heading text-2xl text-foreground mb-4">
                        About This Tour
                      </h2>
                      <p className="font-paragraph text-base text-secondary leading-relaxed">
                        {tour.tourDescription}
                      </p>
                    </div>

                    {/* Accessibility Features */}
                    <div className="bg-white rounded-lg p-8 mb-8">
                      <h2 className="font-heading text-2xl text-foreground mb-6">
                        Accessibility Features
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className={`flex flex-col items-center text-center p-4 rounded-lg ${tour.wheelchairAccessible ? 'bg-accent-gold/10' : 'bg-muted-grey/10'}`}>
                          <Accessibility className={`w-8 h-8 mb-3 ${tour.wheelchairAccessible ? 'text-accent-gold' : 'text-muted-grey'}`} />
                          <span className="font-paragraph text-base text-foreground font-medium mb-1">
                            Wheelchair Access
                          </span>
                          <span className="font-paragraph text-sm text-secondary">
                            {tour.wheelchairAccessible ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                        <div className={`flex flex-col items-center text-center p-4 rounded-lg ${tour.lowWalkingRequired ? 'bg-accent-gold/10' : 'bg-muted-grey/10'}`}>
                          <TrendingDown className={`w-8 h-8 mb-3 ${tour.lowWalkingRequired ? 'text-accent-gold' : 'text-muted-grey'}`} />
                          <span className="font-paragraph text-base text-foreground font-medium mb-1">
                            Low Walking
                          </span>
                          <span className="font-paragraph text-sm text-secondary">
                            {tour.lowWalkingRequired ? 'Minimal Walking' : 'Moderate Walking'}
                          </span>
                        </div>
                        <div className={`flex flex-col items-center text-center p-4 rounded-lg ${tour.audioGuideAvailable ? 'bg-accent-gold/10' : 'bg-muted-grey/10'}`}>
                          <Volume2 className={`w-8 h-8 mb-3 ${tour.audioGuideAvailable ? 'text-accent-gold' : 'text-muted-grey'}`} />
                          <span className="font-paragraph text-base text-foreground font-medium mb-1">
                            Audio Guide
                          </span>
                          <span className="font-paragraph text-sm text-secondary">
                            {tour.audioGuideAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reviews Section */}
                    {feedbacks.length > 0 && (
                      <div className="bg-white rounded-lg p-8">
                        <h2 className="font-heading text-2xl text-foreground mb-6">
                          Traveler Reviews
                        </h2>
                        <div className="space-y-6">
                          {feedbacks.slice(0, 5).map((feedback) => (
                            <div key={feedback._id} className="border-b border-muted-grey/20 pb-6 last:border-0">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-paragraph text-base text-foreground font-medium">
                                  {feedback.userName}
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < (feedback.rating || 0) ? 'text-accent-gold fill-accent-gold' : 'text-muted-grey'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="font-paragraph text-base text-secondary leading-relaxed mb-2">
                                {feedback.feedbackText}
                              </p>
                              {feedback.wouldRecommend && (
                                <span className="inline-block font-paragraph text-sm text-accent-gold">
                                  ✓ Would recommend
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-lg p-8 sticky top-24"
                  >
                    <h3 className="font-heading text-2xl text-foreground mb-6">
                      Tour Details
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-accent-gold mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-paragraph text-sm text-secondary block">Budget</span>
                          <span className="font-paragraph text-base text-foreground font-medium">
                            {tour.budgetCategory}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-accent-gold mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-paragraph text-sm text-secondary block">Travel Type</span>
                          <span className="font-paragraph text-base text-foreground font-medium">
                            {tour.travelType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-accent-gold mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-paragraph text-sm text-secondary block">Best Season</span>
                          <span className="font-paragraph text-base text-foreground font-medium">
                            {tour.recommendedSeason}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link to="/feedback" state={{ tourName: tour.tourName }}>
                      <Button className="w-full bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base py-6 rounded-md h-auto mb-4">
                        Write a Review
                      </Button>
                    </Link>
                    
                    <Link to="/tours">
                      <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base py-6 rounded-md h-auto">
                        Browse More Tours
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

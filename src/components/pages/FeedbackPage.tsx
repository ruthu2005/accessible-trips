import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TourPackages, TourFeedback } from '@/entities';

export default function FeedbackPage() {
  const location = useLocation();
  const { toast } = useToast();
  const [tours, setTours] = useState<TourPackages[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [selectedTour, setSelectedTour] = useState<string>(location.state?.tourName || '');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(false);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const result = await BaseCrudService.getAll<TourPackages>('tourpackages', {}, { limit: 100 });
      setTours(result.items);
    } catch (error) {
      console.error('Error loading tours:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTour || !userName || rating === 0 || !feedbackText) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields and provide a rating.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const newFeedback: TourFeedback = {
        _id: crypto.randomUUID(),
        tourTitle: selectedTour,
        userName,
        rating,
        feedbackText,
        wouldRecommend,
        submissionDate: new Date().toISOString(),
      };

      await BaseCrudService.create('tourfeedback', newFeedback);

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for sharing your experience!',
      });

      // Reset form
      setSelectedTour('');
      setUserName('');
      setRating(0);
      setFeedbackText('');
      setWouldRecommend(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-4">
              Share Your Experience
            </h1>
            <p className="font-paragraph text-lg text-secondary max-w-3xl mx-auto">
              Your feedback helps us improve and assists fellow travelers in making informed decisions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[50rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tour Selection */}
              <div>
                <Label htmlFor="tour" className="font-paragraph text-base text-foreground mb-3 block">
                  Select Tour <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedTour} onValueChange={setSelectedTour}>
                  <SelectTrigger id="tour" className="w-full">
                    <SelectValue placeholder="Choose a tour you experienced" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map((tour) => (
                      <SelectItem key={tour._id} value={tour.tourName || ''}>
                        {tour.tourName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Name */}
              <div>
                <Label htmlFor="userName" className="font-paragraph text-base text-foreground mb-3 block">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <Label className="font-paragraph text-base text-foreground mb-3 block">
                  Rating <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? 'text-accent-gold fill-accent-gold'
                            : 'text-muted-grey'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="font-paragraph text-base text-foreground ml-4">
                      {rating} out of 5 stars
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <Label htmlFor="feedback" className="font-paragraph text-base text-foreground mb-3 block">
                  Your Feedback <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="feedback"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience, accessibility features you appreciated, and any suggestions for improvement..."
                  className="w-full min-h-[200px]"
                  required
                />
              </div>

              {/* Would Recommend */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="recommend"
                  checked={wouldRecommend}
                  onCheckedChange={(checked) => setWouldRecommend(checked as boolean)}
                />
                <Label
                  htmlFor="recommend"
                  className="font-paragraph text-base text-foreground cursor-pointer"
                >
                  I would recommend this tour to others
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base py-6 rounded-md h-auto"
              >
                {isLoading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 bg-accent-gold/10 rounded-lg p-8"
          >
            <h3 className="font-heading text-xl text-foreground mb-3">
              Why Your Feedback Matters
            </h3>
            <p className="font-paragraph text-base text-secondary leading-relaxed">
              Your honest reviews help us maintain high accessibility standards and assist fellow travelers in choosing tours that meet their specific needs. We carefully review all feedback to continuously improve our offerings and ensure every journey is comfortable, safe, and memorable.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

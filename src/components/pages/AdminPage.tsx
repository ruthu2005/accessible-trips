import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TourPackages, TourFeedback } from '@/entities';

function AdminPageContent() {
  const { toast } = useToast();
  const [tours, setTours] = useState<TourPackages[]>([]);
  const [feedbacks, setFeedbacks] = useState<TourFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<TourPackages | null>(null);

  // Form states
  const [tourName, setTourName] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourImages, setTourImages] = useState('');
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [lowWalkingRequired, setLowWalkingRequired] = useState(false);
  const [audioGuideAvailable, setAudioGuideAvailable] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState('');
  const [travelType, setTravelType] = useState('');
  const [recommendedSeason, setRecommendedSeason] = useState('');
  const [overallAccessibilityScore, setOverallAccessibilityScore] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [toursResult, feedbacksResult] = await Promise.all([
        BaseCrudService.getAll<TourPackages>('tourpackages', {}, { limit: 100 }),
        BaseCrudService.getAll<TourFeedback>('tourfeedback', {}, { limit: 100 }),
      ]);
      setTours(toursResult.items);
      setFeedbacks(feedbacksResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTourName('');
    setTourDescription('');
    setTourImages('');
    setWheelchairAccessible(false);
    setLowWalkingRequired(false);
    setAudioGuideAvailable(false);
    setBudgetCategory('');
    setTravelType('');
    setRecommendedSeason('');
    setOverallAccessibilityScore('');
    setEditingTour(null);
  };

  const handleEdit = (tour: TourPackages) => {
    setEditingTour(tour);
    setTourName(tour.tourName || '');
    setTourDescription(tour.tourDescription || '');
    setTourImages(tour.tourImages || '');
    setWheelchairAccessible(tour.wheelchairAccessible || false);
    setLowWalkingRequired(tour.lowWalkingRequired || false);
    setAudioGuideAvailable(tour.audioGuideAvailable || false);
    setBudgetCategory(tour.budgetCategory || '');
    setTravelType(tour.travelType || '');
    setRecommendedSeason(tour.recommendedSeason || '');
    setOverallAccessibilityScore(tour.overallAccessibilityScore?.toString() || '');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tourName || !tourDescription || !budgetCategory || !travelType || !recommendedSeason) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const tourData: TourPackages = {
      _id: editingTour?._id || crypto.randomUUID(),
      tourName,
      tourDescription,
      tourImages: tourImages || 'https://static.wixstatic.com/media/3082d7_97ac72fbbf5e40c9aabc350443d671b7~mv2.png?originWidth=576&originHeight=384',
      wheelchairAccessible,
      lowWalkingRequired,
      audioGuideAvailable,
      budgetCategory,
      travelType,
      recommendedSeason,
      overallAccessibilityScore: overallAccessibilityScore ? parseFloat(overallAccessibilityScore) : undefined,
    };

    // Optimistic update
    if (editingTour) {
      setTours(tours.map(t => t._id === editingTour._id ? tourData : t));
    } else {
      setTours([tourData, ...tours]);
    }

    try {
      if (editingTour) {
        await BaseCrudService.update('tourpackages', tourData);
        toast({
          title: 'Tour Updated',
          description: 'The tour has been successfully updated.',
        });
      } else {
        await BaseCrudService.create('tourpackages', tourData);
        toast({
          title: 'Tour Created',
          description: 'The new tour has been successfully added.',
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving tour:', error);
      loadData();
      toast({
        title: 'Error',
        description: 'There was an error saving the tour. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    // Optimistic update
    setTours(tours.filter(t => t._id !== tourId));

    try {
      await BaseCrudService.delete('tourpackages', tourId);
      toast({
        title: 'Tour Deleted',
        description: 'The tour has been successfully removed.',
      });
    } catch (error) {
      console.error('Error deleting tour:', error);
      loadData();
      toast({
        title: 'Error',
        description: 'There was an error deleting the tour. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    // Optimistic update
    setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));

    try {
      await BaseCrudService.delete('tourfeedback', feedbackId);
      toast({
        title: 'Feedback Deleted',
        description: 'The feedback has been successfully removed.',
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      loadData();
      toast({
        title: 'Error',
        description: 'There was an error deleting the feedback. Please try again.',
        variant: 'destructive',
      });
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
          >
            <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-4">
              Admin Dashboard
            </h1>
            <p className="font-paragraph text-lg text-secondary">
              Manage tour packages and view user feedback.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-8">
          <Tabs defaultValue="tours" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="tours" className="font-paragraph text-base">
                Tour Management
              </TabsTrigger>
              <TabsTrigger value="feedback" className="font-paragraph text-base">
                User Feedback
              </TabsTrigger>
            </TabsList>

            {/* Tours Tab */}
            <TabsContent value="tours">
              <div className="mb-6">
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-8 py-6 rounded-md h-auto">
                      <Plus className="mr-2 h-5 w-5" />
                      Add New Tour
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">
                        {editingTour ? 'Edit Tour' : 'Add New Tour'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                      <div>
                        <Label htmlFor="tourName" className="font-paragraph text-base">
                          Tour Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="tourName"
                          value={tourName}
                          onChange={(e) => setTourName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="tourDescription" className="font-paragraph text-base">
                          Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="tourDescription"
                          value={tourDescription}
                          onChange={(e) => setTourDescription(e.target.value)}
                          className="min-h-[120px]"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="tourImages" className="font-paragraph text-base">
                          Image URL
                        </Label>
                        <Input
                          id="tourImages"
                          value={tourImages}
                          onChange={(e) => setTourImages(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budgetCategory" className="font-paragraph text-base">
                            Budget Category <span className="text-destructive">*</span>
                          </Label>
                          <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                            <SelectTrigger id="budgetCategory">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Budget">Budget</SelectItem>
                              <SelectItem value="Mid-Range">Mid-Range</SelectItem>
                              <SelectItem value="Luxury">Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="travelType" className="font-paragraph text-base">
                            Travel Type <span className="text-destructive">*</span>
                          </Label>
                          <Select value={travelType} onValueChange={setTravelType}>
                            <SelectTrigger id="travelType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Solo">Solo</SelectItem>
                              <SelectItem value="Family">Family</SelectItem>
                              <SelectItem value="Group">Group</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recommendedSeason" className="font-paragraph text-base">
                            Recommended Season <span className="text-destructive">*</span>
                          </Label>
                          <Select value={recommendedSeason} onValueChange={setRecommendedSeason}>
                            <SelectTrigger id="recommendedSeason">
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Spring">Spring</SelectItem>
                              <SelectItem value="Summer">Summer</SelectItem>
                              <SelectItem value="Fall">Fall</SelectItem>
                              <SelectItem value="Winter">Winter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="accessibilityScore" className="font-paragraph text-base">
                            Accessibility Score (0-10)
                          </Label>
                          <Input
                            id="accessibilityScore"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={overallAccessibilityScore}
                            onChange={(e) => setOverallAccessibilityScore(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="font-paragraph text-base mb-3 block">
                          Accessibility Features
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="wheelchair"
                              checked={wheelchairAccessible}
                              onCheckedChange={(checked) => setWheelchairAccessible(checked as boolean)}
                            />
                            <Label htmlFor="wheelchair" className="font-paragraph text-base cursor-pointer">
                              Wheelchair Accessible
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="lowWalking"
                              checked={lowWalkingRequired}
                              onCheckedChange={(checked) => setLowWalkingRequired(checked as boolean)}
                            />
                            <Label htmlFor="lowWalking" className="font-paragraph text-base cursor-pointer">
                              Low Walking Required
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="audioGuide"
                              checked={audioGuideAvailable}
                              onCheckedChange={(checked) => setAudioGuideAvailable(checked as boolean)}
                            />
                            <Label htmlFor="audioGuide" className="font-paragraph text-base cursor-pointer">
                              Audio Guide Available
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base py-6 rounded-md h-auto"
                        >
                          {editingTour ? 'Update Tour' : 'Create Tour'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setDialogOpen(false);
                            resetForm();
                          }}
                          className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base py-6 rounded-md h-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <motion.div
                    key={tour._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg p-6"
                  >
                    <h3 className="font-heading text-xl text-foreground mb-2">
                      {tour.tourName}
                    </h3>
                    <p className="font-paragraph text-sm text-secondary mb-4 line-clamp-2">
                      {tour.tourDescription}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-paragraph text-xs text-accent-gold">
                        {tour.budgetCategory}
                      </span>
                      <span className="font-paragraph text-xs text-secondary">•</span>
                      <span className="font-paragraph text-xs text-secondary">
                        {tour.travelType}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tour)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tour._id)}
                        className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <div className="space-y-6">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <motion.div
                      key={feedback._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading text-xl text-foreground">
                              {feedback.tourTitle}
                            </h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (feedback.rating || 0)
                                      ? 'text-accent-gold fill-accent-gold'
                                      : 'text-muted-grey'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="font-paragraph text-sm text-secondary mb-1">
                            By {feedback.userName}
                          </p>
                          <p className="font-paragraph text-xs text-muted-grey">
                            {feedback.submissionDate ? new Date(feedback.submissionDate).toLocaleDateString() : ''}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFeedback(feedback._id)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="font-paragraph text-base text-foreground mb-3">
                        {feedback.feedbackText}
                      </p>
                      {feedback.wouldRecommend && (
                        <span className="inline-block font-paragraph text-sm text-accent-gold">
                          ✓ Would recommend
                        </span>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-grey mx-auto mb-4" />
                    <p className="font-paragraph text-lg text-secondary">
                      No feedback submitted yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <MemberProtectedRoute messageToSignIn="Please sign in with admin credentials to access the admin dashboard">
      <AdminPageContent />
    </MemberProtectedRoute>
  );
}

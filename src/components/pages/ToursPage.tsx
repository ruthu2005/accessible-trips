import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Star, Accessibility, Volume2, TrendingDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TourPackages } from '@/entities';

export default function ToursPage() {
  const [tours, setTours] = useState<TourPackages[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourPackages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [travelTypeFilter, setTravelTypeFilter] = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [lowWalking, setLowWalking] = useState(false);
  const [audioGuide, setAudioGuide] = useState(false);

  useEffect(() => {
    loadTours();
  }, [skip]);

  useEffect(() => {
    applyFilters();
  }, [tours, budgetFilter, travelTypeFilter, seasonFilter, wheelchairAccessible, lowWalking, audioGuide]);

  const loadTours = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<TourPackages>('tourpackages', {}, { limit: 50, skip });
      setTours(result.items);
      setHasNext(result.hasNext);
    } catch (error) {
      console.error('Error loading tours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tours];

    if (budgetFilter !== 'all') {
      filtered = filtered.filter(tour => tour.budgetCategory === budgetFilter);
    }

    if (travelTypeFilter !== 'all') {
      filtered = filtered.filter(tour => tour.travelType === travelTypeFilter);
    }

    if (seasonFilter !== 'all') {
      filtered = filtered.filter(tour => tour.recommendedSeason === seasonFilter);
    }

    if (wheelchairAccessible) {
      filtered = filtered.filter(tour => tour.wheelchairAccessible === true);
    }

    if (lowWalking) {
      filtered = filtered.filter(tour => tour.lowWalkingRequired === true);
    }

    if (audioGuide) {
      filtered = filtered.filter(tour => tour.audioGuideAvailable === true);
    }

    // Sort by accessibility score
    filtered.sort((a, b) => (b.overallAccessibilityScore || 0) - (a.overallAccessibilityScore || 0));

    setFilteredTours(filtered);
  };

  const resetFilters = () => {
    setBudgetFilter('all');
    setTravelTypeFilter('all');
    setSeasonFilter('all');
    setWheelchairAccessible(false);
    setLowWalking(false);
    setAudioGuide(false);
  };

  const loadMore = () => {
    setSkip(skip + 50);
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
              Explore Accessible Tours
            </h1>
            <p className="font-paragraph text-lg text-secondary max-w-3xl mx-auto">
              Discover curated travel experiences tailored to your accessibility needs and preferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Tours */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-foreground flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Budget Filter */}
                  <div>
                    <Label className="font-paragraph text-base text-foreground mb-3 block">
                      Budget Category
                    </Label>
                    <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Budgets</SelectItem>
                        <SelectItem value="Budget">Budget</SelectItem>
                        <SelectItem value="Mid-Range">Mid-Range</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Type Filter */}
                  <div>
                    <Label className="font-paragraph text-base text-foreground mb-3 block">
                      Travel Type
                    </Label>
                    <Select value={travelTypeFilter} onValueChange={setTravelTypeFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Solo">Solo</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Season Filter */}
                  <div>
                    <Label className="font-paragraph text-base text-foreground mb-3 block">
                      Recommended Season
                    </Label>
                    <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Seasons</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Accessibility Features */}
                  <div>
                    <Label className="font-paragraph text-base text-foreground mb-3 block">
                      Accessibility Features
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="wheelchair"
                          checked={wheelchairAccessible}
                          onCheckedChange={(checked) => setWheelchairAccessible(checked as boolean)}
                        />
                        <Label
                          htmlFor="wheelchair"
                          className="font-paragraph text-base text-secondary cursor-pointer flex items-center gap-2"
                        >
                          <Accessibility className="w-4 h-4" />
                          Wheelchair Accessible
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="lowWalking"
                          checked={lowWalking}
                          onCheckedChange={(checked) => setLowWalking(checked as boolean)}
                        />
                        <Label
                          htmlFor="lowWalking"
                          className="font-paragraph text-base text-secondary cursor-pointer flex items-center gap-2"
                        >
                          <TrendingDown className="w-4 h-4" />
                          Low Walking Required
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="audioGuide"
                          checked={audioGuide}
                          onCheckedChange={(checked) => setAudioGuide(checked as boolean)}
                        />
                        <Label
                          htmlFor="audioGuide"
                          className="font-paragraph text-base text-secondary cursor-pointer flex items-center gap-2"
                        >
                          <Volume2 className="w-4 h-4" />
                          Audio Guide Available
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base py-5 rounded-md h-auto"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="lg:col-span-3" style={{ minHeight: isLoading ? '600px' : 'auto' }}>
              {isLoading ? null : filteredTours.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {filteredTours.map((tour, index) => (
                      <motion.div
                        key={tour._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                      >
                        <Link to={`/tours/${tour._id}`}>
                          <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                            <div className="aspect-[16/10] overflow-hidden">
                              <Image
                                src={tour.tourImages || 'https://static.wixstatic.com/media/3082d7_553119a9aa7d49ceb8f3850d523cb46c~mv2.png?originWidth=640&originHeight=384'}
                                alt={tour.tourName || 'Tour destination'}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                width={700}
                              />
                            </div>
                            <div className="p-6">
                              <h3 className="font-heading text-2xl text-foreground mb-3">
                                {tour.tourName}
                              </h3>
                              <p className="font-paragraph text-base text-secondary mb-4 line-clamp-2">
                                {tour.tourDescription}
                              </p>
                              
                              {/* Accessibility Icons */}
                              <div className="flex items-center gap-3 mb-4">
                                {tour.wheelchairAccessible && (
                                  <div className="flex items-center gap-1 text-accent-gold" title="Wheelchair Accessible">
                                    <Accessibility className="w-4 h-4" />
                                  </div>
                                )}
                                {tour.lowWalkingRequired && (
                                  <div className="flex items-center gap-1 text-accent-gold" title="Low Walking Required">
                                    <TrendingDown className="w-4 h-4" />
                                  </div>
                                )}
                                {tour.audioGuideAvailable && (
                                  <div className="flex items-center gap-1 text-accent-gold" title="Audio Guide Available">
                                    <Volume2 className="w-4 h-4" />
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Star className="w-5 h-5 text-accent-gold fill-accent-gold" />
                                  <span className="font-paragraph text-base text-foreground font-medium">
                                    {tour.overallAccessibilityScore || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-paragraph text-sm text-accent-gold font-medium">
                                    {tour.budgetCategory}
                                  </span>
                                  <span className="font-paragraph text-xs text-secondary">
                                    {tour.travelType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {hasNext && (
                    <div className="text-center">
                      <Button
                        onClick={loadMore}
                        className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-8 py-6 rounded-md h-auto"
                      >
                        Load More Tours
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="font-paragraph text-lg text-secondary mb-4">
                    No tours match your current filters.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-8 py-6 rounded-md h-auto"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

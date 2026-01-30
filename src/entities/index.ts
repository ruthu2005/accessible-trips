/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: tourfeedback
 * Interface for TourFeedback
 */
export interface TourFeedback {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  tourTitle?: string;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType text */
  feedbackText?: string;
  /** @wixFieldType text */
  userName?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType boolean */
  wouldRecommend?: boolean;
}


/**
 * Collection ID: tourpackages
 * Interface for TourPackages
 */
export interface TourPackages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  tourName?: string;
  /** @wixFieldType text */
  tourDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  tourImages?: string;
  /** @wixFieldType boolean */
  wheelchairAccessible?: boolean;
  /** @wixFieldType boolean */
  lowWalkingRequired?: boolean;
  /** @wixFieldType boolean */
  audioGuideAvailable?: boolean;
  /** @wixFieldType text */
  budgetCategory?: string;
  /** @wixFieldType text */
  travelType?: string;
  /** @wixFieldType text */
  recommendedSeason?: string;
  /** @wixFieldType number */
  overallAccessibilityScore?: number;
}

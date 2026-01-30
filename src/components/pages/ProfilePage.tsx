import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

function ProfilePageContent() {
  const { member, actions } = useMember();

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
              My Profile
            </h1>
            <p className="font-paragraph text-lg text-secondary">
              Manage your account information and preferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[50rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg p-8 md:p-12"
          >
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              {member?.profile?.photo?.url ? (
                <Image src={member.profile.photo.url} alt={member.profile.nickname || 'Profile'} className="w-24 h-24 rounded-full object-cover mb-4" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent-gold/10 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-accent-gold" />
                </div>
              )}
              <h2 className="font-heading text-3xl text-foreground mb-2">
                {member?.profile?.nickname || member?.contact?.firstName || 'User'}
              </h2>
              {member?.profile?.title && (
                <p className="font-paragraph text-base text-secondary">
                  {member.profile.title}
                </p>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                <Mail className="w-6 h-6 text-accent-gold mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-paragraph text-sm text-secondary block mb-1">
                    Email Address
                  </span>
                  <span className="font-paragraph text-base text-foreground">
                    {member?.loginEmail || 'Not provided'}
                  </span>
                  {member?.loginEmailVerified && (
                    <span className="inline-block ml-2 font-paragraph text-xs text-accent-gold">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Full Name */}
              {(member?.contact?.firstName || member?.contact?.lastName) && (
                <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                  <User className="w-6 h-6 text-accent-gold mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-paragraph text-sm text-secondary block mb-1">
                      Full Name
                    </span>
                    <span className="font-paragraph text-base text-foreground">
                      {[member.contact.firstName, member.contact.lastName].filter(Boolean).join(' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Member Since */}
              {member?._createdDate && (
                <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                  <Calendar className="w-6 h-6 text-accent-gold mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-paragraph text-sm text-secondary block mb-1">
                      Member Since
                    </span>
                    <span className="font-paragraph text-base text-foreground">
                      {new Date(member._createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                <Shield className="w-6 h-6 text-accent-gold mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-paragraph text-sm text-secondary block mb-1">
                    Account Status
                  </span>
                  <span className="font-paragraph text-base text-foreground">
                    {member?.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Admin Badge */}
              {member?.loginEmail === 'admin@accesstour.com' && (
                <div className="p-4 bg-accent-gold/10 rounded-lg border-2 border-accent-gold">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-gold" />
                    <span className="font-paragraph text-base text-foreground font-medium">
                      Administrator Account
                    </span>
                  </div>
                  <p className="font-paragraph text-sm text-secondary mt-2">
                    You have full access to manage tours and view user feedback.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-muted-grey/20">
              <Button
                onClick={actions.logout}
                variant="outline"
                className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base py-6 rounded-md h-auto"
              >
                Sign Out
              </Button>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 bg-accent-gold/10 rounded-lg p-8"
          >
            <h3 className="font-heading text-xl text-foreground mb-3">
              Your Privacy Matters
            </h3>
            <p className="font-paragraph text-base text-secondary leading-relaxed">
              We are committed to protecting your personal information. Your data is securely stored and will never be shared with third parties without your explicit consent. For more information, please review our Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MemberProtectedRoute>
      <ProfilePageContent />
    </MemberProtectedRoute>
  );
}

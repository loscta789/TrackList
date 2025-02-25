"use client";
import React, { useState, ReactNode } from "react";
import { FaUsers, FaUserPlus, FaComments, FaCrown, FaSyncAlt, FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CreateGroupModal from "./components/CreateGroupModal";
import JoinGroupModal from "./components/JoinGroupModal";

interface CardProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

const CardHeader: React.FC<CardSectionProps> = ({ children, className }) => <div className={className}>{children}</div>;
const CardContent: React.FC<CardSectionProps> = ({ children, className }) => <div className={className}>{children}</div>;
const CardFooter: React.FC<CardSectionProps> = ({ children, className }) => <div className={className}>{children}</div>;
const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => <button className={className} {...props}>{children}</button>;

export default function App() {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary text-foreground">
      <motion.div 
        className="container mx-auto px-4 py-12 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight"
            variants={cardVariants}
          >
            Create shared lists, track purchases, and simplify your group shopping experience!
          </motion.h1>
          <motion.p 
            className="text-lg text-secondary/80 max-w-2xl mx-auto"
            variants={cardVariants}
          >
            Join our community and make shopping together easier than ever.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Create Group Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="h-full bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300 cursor-pointer"
              onClick={() => setIsGroupModalOpen(true)}
            >
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-success/10">
                  <FaUsers className="text-6xl text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Create a Group</h2>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p className="mb-4">Start your own group and invite friends to join you!</p>
                <ul className="text-sm space-y-2">
                  <li>✓ Create shopping lists</li>
                  <li>✓ Invite unlimited members</li>
                  <li>✓ Track group expenses</li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button className="w-full bg-success hover:bg-success/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1">
                  Create New Group
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Join Group Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="h-full bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300 cursor-pointer"
              onClick={() => setIsJoinGroupModalOpen(true)}
            >
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <FaUserPlus className="text-6xl text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Join a Group</h2>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p className="mb-4">Find a group and join an active community.</p>
                <ul className="text-sm space-y-2">
                  <li>✓ Access shared lists</li>
                  <li>✓ Contribute to group activities</li>
                  <li>✓ Share expenses easily</li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1">
                  Join Existing Group
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <FaComments className="text-6xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Live Chat</h3>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p>Communicate with your group members in real-time.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <FaSyncAlt className="text-6xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Real-time Collaborative Lists</h3>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p>Work together on shopping lists in real-time.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <FaCrown className="text-6xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Premium</h3>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p>Unlock exclusive features with our Premium plan.</p>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardHeader className="text-center">
                <h3 className="text-xl font-bold text-foreground">Free</h3>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p className="mb-4">Access basic features for free.</p>
                <ul className="text-sm space-y-2">
                  <li>✓ Create and join groups</li>
                  <li>✓ Access shared lists</li>
                  <li>✓ Track group expenses</li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6 text-center">
                <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardHeader className="text-center">
                <h3 className="text-xl font-bold text-foreground">Premium</h3>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p className="mb-4">Unlock exclusive features with our Premium plan.</p>
                <ul className="text-sm space-y-2">
                  <li>✓ All Free features</li>
                  <li>✓ Live Chat</li>
                  <li>✓ Priority support</li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6 text-center">
                <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1">
                  Upgrade to Premium
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardHeader className="text-center">
                <h3 className="text-xl font-bold text-foreground">Premium ++</h3>
              </CardHeader>
              <CardContent className="py-6 text-center text-secondary">
                <p className="mb-4">Get even more with our Premium ++ plan.</p>
                <ul className="text-sm space-y-2">
                  <li>✓ All Premium features</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Custom integrations</li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6 text-center">
                <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1">
                  Upgrade to Premium ++
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardContent className="text-center text-secondary">
                <p className="mb-4">"This app has completely changed the way we shop as a group. It's so easy to use and has saved us so much time!"</p>
                <p className="font-bold text-foreground">- User A</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300">
              <CardContent className="text-center text-secondary">
                <p className="mb-4">"I love the live chat feature. It makes coordinating with my group so much easier."</p>
                <p className="font-bold text-foreground">- User B</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-5xl mx-auto">
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300 mb-4">
              <CardHeader className="text-xl font-bold text-foreground">What is Grocery Store Web?</CardHeader>
              <CardContent className="text-secondary">
                <p>Grocery Store Web is a platform that allows you to create and manage shared shopping lists with your group. You can track purchases, communicate in real-time, and simplify your group shopping experience.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300 mb-4">
              <CardHeader className="text-xl font-bold text-foreground">How do I create a group?</CardHeader>
              <CardContent className="text-secondary">
                <p>To create a group, click on the "Create a Group" button on the homepage. Fill in the required details and invite your friends to join your group.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300 mb-4">
              <CardHeader className="text-xl font-bold text-foreground">What features are available in the Premium plan?</CardHeader>
              <CardContent className="text-secondary">
                <p>The Premium plan includes all the features of the Free plan, plus live chat, priority support, and more.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl border border-secondary/20 rounded-2xl p-8 transition-all duration-300 mb-4">
              <CardHeader className="text-xl font-bold text-foreground">How do I upgrade to Premium?</CardHeader>
              <CardContent className="text-secondary">
                <p>To upgrade to Premium, go to the Pricing section and click on the "Upgrade to Premium" button. Follow the instructions to complete your purchase.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">Ready to simplify your group shopping experience?</h2>
          <Button className="bg-success hover:bg-success/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1">
            Get Started Now
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-background py-8">
          <div className="container mx-auto text-center text-secondary">
            <p>&copy; 2023 Grocery Store Web. All rights reserved.</p>
          </div>
        </footer>
      </motion.div>

      {/* Modals */}
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
      <JoinGroupModal isOpen={isJoinGroupModalOpen} onClose={() => setIsJoinGroupModalOpen(false)} />
    </div>
  );
}
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import HomePage from "@/pages/home";
import PatternsPage from "@/pages/patterns";
import PatternDetailPage from "@/pages/pattern-detail";
import BlocksPage from "@/pages/blocks";
import BlockDetailPage from "@/pages/block-detail";
import ProjectsPage from "@/pages/projects";
import ProjectDetailPage from "@/pages/project-detail";
import NotebookPage from "@/pages/notebook";
import NewProjectPage from "@/pages/new-project";
import SupportPage from "@/pages/support";
import CommunityPage from "@/pages/community";
import ForumsPage from "@/pages/community/forums";
import BlogPage from "@/pages/community/blog";
import ForumCategoryPage from "@/pages/community/forum-category";
import ThreadPage from "@/pages/community/thread";
import PeoplePage from "@/pages/community/people";
import FriendsPage from "@/pages/community/friends";
import GroupsPage from "@/pages/community/groups";
import MessagesPage from "@/pages/community/messages";
import EventsPage from "@/pages/community/events";
import QuiltShopsPage from "@/pages/community/shops";
import AddQuiltShopPage from "@/pages/community/add-shop";
import PatternListFormPage from "@/pages/pattern-list-form";
import PublishingRulesPage from "@/pages/publishing-rules";
import BlockListFormPage from "@/pages/block-list-form";
import ProfilePage from "@/pages/profile";
import GettingStartedPage from "@/pages/getting-started";
import CreateAccountPage from "@/pages/getting-started/create-account";
import ExplorePatternsPage from "@/pages/getting-started/explore-patterns";
import BuildQueuePage from "@/pages/getting-started/build-queue";
import StartProjectPage from "@/pages/getting-started/start-project";
import ManageLibraryPage from "@/pages/getting-started/manage-library";
import JoinCommunityPage from "@/pages/getting-started/join-community";
import ContactPage from "@/pages/contact";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";
import CommunityGuidelinesPage from "@/pages/community-guidelines";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AboutPage from "@/pages/about";
import SubscriptionPage from "@/pages/subscription";
import SubscriptionSuccessPage from "@/pages/subscription/success";
import SubscriptionCancelPage from "@/pages/subscription/cancel";

function HomeOrLanding() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return isAuthenticated ? <HomePage /> : <LandingPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <HomeOrLanding />}</Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/patterns" component={PatternsPage} />
      <Route path="/patterns/new" component={PatternListFormPage} />
      <Route path="/patterns/publishing-rules" component={PublishingRulesPage} />
      <Route path="/patterns/:id" component={PatternDetailPage} />
      <Route path="/blocks" component={BlocksPage} />
      <Route path="/blocks/new" component={BlockListFormPage} />
      <Route path="/blocks/:id" component={BlockDetailPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:id" component={ProjectDetailPage} />
      <Route path="/notebook" component={NotebookPage} />
      <Route path="/notebook/projects" component={NotebookPage} />
      <Route path="/notebook/projects/new" component={NewProjectPage} />
      <Route path="/notebook/queue" component={NotebookPage} />
      <Route path="/notebook/favorites" component={NotebookPage} />
      <Route path="/notebook/library" component={NotebookPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/getting-started" component={GettingStartedPage} />
      <Route path="/getting-started/create-account" component={CreateAccountPage} />
      <Route path="/getting-started/explore-patterns" component={ExplorePatternsPage} />
      <Route path="/getting-started/build-queue" component={BuildQueuePage} />
      <Route path="/getting-started/start-project" component={StartProjectPage} />
      <Route path="/getting-started/manage-library" component={ManageLibraryPage} />
      <Route path="/getting-started/join-community" component={JoinCommunityPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/community-guidelines" component={CommunityGuidelinesPage} />
      <Route path="/community/blog" component={BlogPage} />
      <Route path="/community/forums" component={ForumsPage} />
      <Route path="/community/forums/:id" component={ForumCategoryPage} />
      <Route path="/community/threads/:id" component={ThreadPage} />
      <Route path="/community/people" component={PeoplePage} />
      <Route path="/community/friends" component={FriendsPage} />
      <Route path="/community/groups" component={GroupsPage} />
      <Route path="/community/messages" component={MessagesPage} />
      <Route path="/community/events" component={EventsPage} />
      <Route path="/community/shops" component={QuiltShopsPage} />
      <Route path="/community/shops/new" component={AddQuiltShopPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/subscription" component={SubscriptionPage} />
      <Route path="/subscription/success" component={SubscriptionSuccessPage} />
      <Route path="/subscription/cancel" component={SubscriptionCancelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="default" storageKey="quilthub-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Users, Clock, Search, Plus, Globe, DollarSign, Check, Building } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { Event } from "@shared/schema";
import { SEO } from "@/components/seo";

const regions = [
  { value: "all", label: "All Regions" },
  { value: "north_america", label: "North America" },
  { value: "south_america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "asia_pacific", label: "Asia Pacific" },
  { value: "middle_east", label: "Middle East" },
  { value: "india", label: "India" },
  { value: "africa", label: "Africa" },
];

const dateRanges = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "next_3_months", label: "Next 3 Months" },
  { value: "next_6_months", label: "Next 6 Months" },
  { value: "next_year", label: "Next Year" },
];

const typeColors: Record<string, string> = {
  quilt_show: "bg-primary/10 text-primary",
  workshop: "bg-accent/10 text-accent",
  retreat: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  virtual: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  quilt_a_long: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

function LoadingSkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}

export default function EventsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interestedEvents, setInterestedEvents] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const eventTypes = [
    { value: "all", label: t('events.allTypes') },
    { value: "quilt_show", label: t('events.quiltShow') },
    { value: "workshop", label: t('events.workshop') },
    { value: "retreat", label: t('events.retreat') },
    { value: "virtual", label: t('events.virtual') },
    { value: "quilt_a_long", label: "Quilt-A-Long" },
  ];

  const typeLabels: Record<string, string> = {
    quilt_show: t('events.quiltShow'),
    workshop: t('events.workshop'),
    retreat: t('events.retreat'),
    virtual: t('events.virtual'),
    quilt_a_long: "Quilt-A-Long",
  };
  
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    eventType: "workshop",
    region: "north_america",
    location: "",
    eventDate: "",
    eventTime: "",
    organizer: "",
    website: "",
    cost: "",
  });

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", selectedType, selectedRegion, searchQuery, selectedDateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedType !== "all") params.set("eventType", selectedType);
      if (selectedRegion !== "all") params.set("region", selectedRegion);
      if (selectedDateRange !== "all") params.set("dateRange", selectedDateRange);
      const url = `/api/events${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const createEvent = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/events", {
        ...newEvent,
        eventDate: selectedDate ? format(selectedDate, "MMMM d, yyyy") : newEvent.eventDate,
      });
    },
    onSuccess: () => {
      toast({ title: "Event created!" });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setNewEvent({
        name: "",
        description: "",
        eventType: "workshop",
        region: "north_america",
        location: "",
        eventDate: "",
        eventTime: "",
        organizer: "",
        website: "",
        cost: "",
      });
      setSelectedDate(undefined);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create event", variant: "destructive" });
    },
  });

  const markInterested = useMutation({
    mutationFn: async (eventId: string) => {
      return apiRequest("POST", `/api/events/${eventId}/interested`, {});
    },
    onSuccess: (_, eventId) => {
      toast({ title: "Marked as interested!" });
      setInterestedEvents(prev => {
        const newSet = new Set(prev);
        newSet.add(eventId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: () => {
      toast({ title: "Failed to mark interest", variant: "destructive" });
    },
  });

  const handleInterested = (eventId: string) => {
    if (!isAuthenticated) {
      toast({ 
        title: "Sign in required", 
        description: "Please sign in to mark your interest in events.",
        variant: "destructive" 
      });
      return;
    }
    markInterested.mutate(eventId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Events" description="Find quilting events, retreats, shows, and meetups near you." path="/community/events" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2" data-testid="heading-events">
                {t('events.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('events.description')}
              </p>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" data-testid="button-add-event">
                      <Plus className="h-4 w-4" />
                      {t('events.createEvent')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add a New Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Event Name</Label>
                        <Input
                          id="name"
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                          placeholder="e.g., Spring Quilt Show 2026"
                          data-testid="input-event-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organizer">Event Organizer/Sponsor</Label>
                        <Input
                          id="organizer"
                          value={newEvent.organizer}
                          onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                          placeholder="e.g., Portland Quilters Guild"
                          data-testid="input-event-organizer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="What's this event about?"
                          rows={3}
                          data-testid="input-event-description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Event Type</Label>
                          <Select
                            value={newEvent.eventType}
                            onValueChange={(value) => setNewEvent({ ...newEvent, eventType: value })}
                          >
                            <SelectTrigger data-testid="select-event-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {eventTypes.filter(t => t.value !== "all").map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Region</Label>
                          <Select
                            value={newEvent.region}
                            onValueChange={(value) => setNewEvent({ ...newEvent, region: value })}
                          >
                            <SelectTrigger data-testid="select-event-region">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.filter(r => r.value !== "all").map((region) => (
                                <SelectItem key={region.value} value={region.value}>
                                  {region.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="e.g., Portland Convention Center, OR"
                          data-testid="input-event-location"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Event Date</Label>
                          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !selectedDate && "text-muted-foreground"
                                )}
                                data-testid="input-event-date"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  setSelectedDate(date);
                                  setCalendarOpen(false);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventTime">Time</Label>
                          <Input
                            id="eventTime"
                            value={newEvent.eventTime}
                            onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
                            placeholder="e.g., 10:00 AM - 5:00 PM"
                            data-testid="input-event-time"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Event Website</Label>
                          <Input
                            id="website"
                            value={newEvent.website}
                            onChange={(e) => setNewEvent({ ...newEvent, website: e.target.value })}
                            placeholder="https://example.com"
                            data-testid="input-event-website"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cost">Event Cost</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id="cost"
                              value={newEvent.cost}
                              onChange={(e) => setNewEvent({ ...newEvent, cost: e.target.value })}
                              placeholder="0.00 or Free"
                              className="pl-7"
                              data-testid="input-event-cost"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => createEvent.mutate()}
                        disabled={!newEvent.name.trim() || createEvent.isPending}
                        className="w-full"
                        data-testid="button-submit-event"
                      >
                        {createEvent.isPending ? "Creating..." : t('events.createEvent')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Link href="/community">
                <Button data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Community
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-events"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]" data-testid="filter-type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-[150px]" data-testid="filter-date">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[150px]" data-testid="filter-region">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : events && events.length > 0 ? (
            <div className="grid gap-6">
              {events.map((event) => {
                const isInterested = interestedEvents.has(event.id);
                return (
                  <Card key={event.id} className="hover-elevate" data-testid={`card-event-${event.id}`}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className={typeColors[event.eventType] || "bg-muted"}>
                              {typeLabels[event.eventType] || event.eventType}
                            </Badge>
                            <Badge variant="outline">
                              {regions.find(r => r.value === event.region)?.label || event.region}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
                          {(event as any).organizer && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Building className="h-4 w-4" />
                              <span>Organized by {(event as any).organizer}</span>
                            </div>
                          )}
                          <CardDescription className="text-base">
                            {event.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {event.eventDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{event.eventDate}</span>
                          </div>
                        )}
                        {event.eventTime && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{event.eventTime}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {(event as any).cost && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{(event as any).cost === "0" || (event as any).cost.toLowerCase() === "free" ? "Free" : `$${(event as any).cost}`}</span>
                          </div>
                        )}
                      </div>
                      {(event as any).website && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={(event as any).website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Event Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.interestedCount || 0} {t('events.interested').toLowerCase()}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant={isInterested ? "outline" : "default"}
                          onClick={() => handleInterested(event.id)}
                          disabled={isInterested || markInterested.isPending}
                          data-testid={`button-interested-${event.id}`}
                        >
                          {isInterested ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              {t('events.interested')}
                            </>
                          ) : (
                            "I'm Interested"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{t('events.noEvents')}</p>
                {isAuthenticated && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    {t('events.createEvent')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

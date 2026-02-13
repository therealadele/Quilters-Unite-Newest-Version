import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Send, ArrowLeft, MessageCircle, Circle, Plus, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Conversation, ConversationParticipant, Message, User } from "@shared/schema";
import { SEO } from "@/components/seo";

function formatDate(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  if (diff < 86400000) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type ConversationWithParticipants = {
  conversation: Conversation;
  participants: ConversationParticipant[];
};

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [initialMessage, setInitialMessage] = useState("");

  const { data: conversations, isLoading: conversationsLoading } = useQuery<ConversationWithParticipants[]>({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    queryFn: async () => {
      const res = await fetch(`/api/conversations/${selectedConversation}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!selectedConversation,
    refetchInterval: 5000,
  });

  const { data: searchResults, isLoading: searchingUsers } = useQuery<User[]>({
    queryKey: ["/api/users/search", searchUsername],
    queryFn: async () => {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchUsername)}`);
      if (!res.ok) throw new Error("Failed to search users");
      return res.json();
    },
    enabled: searchUsername.length >= 2,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/conversations/${selectedConversation}/messages`, {
        content: messageContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedConversation, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setMessageContent("");
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  const createConversation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/conversations", {
        participantId: selectedUser?.id,
        initialMessage: initialMessage,
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setShowNewConversation(false);
      setSearchUsername("");
      setSelectedUser(null);
      setInitialMessage("");
      if (data?.id) {
        setSelectedConversation(data.id);
      }
      toast({ title: "Conversation started!" });
    },
    onError: () => {
      toast({ title: "Failed to start conversation", variant: "destructive" });
    },
  });

  const selectedConvo = conversations?.find(c => c.conversation.id === selectedConversation);
  const otherParticipant = selectedConvo?.participants.find(p => p.userId !== user?.id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Messages" description="Your private messages with other quilters. You can change your privacy settings in your profile." path="/community/messages" noindex />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Sign in to view your messages</p>
              <Button asChild>
                <a href="/login">{t('common.signIn')}</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold" data-testid="heading-messages">{t('messages.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('messages.description')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowNewConversation(true)} data-testid="button-new-conversation">
                <Plus className="h-4 w-4 mr-2" />
                {t('messages.newConversation')}
              </Button>
              <Link href="/community">
                <Button data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Community
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {conversationsLoading ? (
                    <div className="space-y-2 p-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : conversations && conversations.length > 0 ? (
                    <div className="divide-y">
                      {conversations.map(({ conversation, participants }) => {
                        const other = participants.find(p => p.userId !== user?.id);
                        const hasUnread = participants.find(p => p.userId === user?.id)?.hasUnread;
                        const isSelected = selectedConversation === conversation.id;
                        
                        return (
                          <button
                            key={conversation.id}
                            className={`w-full p-4 text-left hover-elevate transition-all flex items-center gap-3 ${
                              isSelected ? "bg-muted" : ""
                            }`}
                            onClick={() => setSelectedConversation(conversation.id)}
                            data-testid={`conversation-${conversation.id}`}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={other?.userImage || undefined} />
                              <AvatarFallback>{other?.userName?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{other?.userName || "Quilter"}</span>
                                {hasUnread && (
                                  <Circle className="h-2 w-2 fill-primary text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessagePreview || "No messages yet"}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDate(conversation.lastMessageAt)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">{t('messages.noConversations')}</p>
                      <Button size="sm" onClick={() => setShowNewConversation(true)}>
                        {t('messages.startConversation')}
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant?.userImage || undefined} />
                        <AvatarFallback>{otherParticipant?.userName?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{otherParticipant?.userName || "Quilter"}</CardTitle>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-16" />
                        ))}
                      </div>
                    ) : messages && messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwn = message.senderId === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isOwn
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p>{message.content}</p>
                                <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {formatDate(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet. Say hello!</p>
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder={t('messages.typeMessage')}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && messageContent.trim()) {
                            e.preventDefault();
                            sendMessage.mutate();
                          }
                        }}
                        data-testid="input-message"
                      />
                      <Button
                        size="icon"
                        onClick={() => sendMessage.mutate()}
                        disabled={!messageContent.trim() || sendMessage.isPending}
                        data-testid="button-send-message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">{t('messages.selectConversation')}</p>
                    <Button onClick={() => setShowNewConversation(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('messages.startConversation')}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showNewConversation} onOpenChange={setShowNewConversation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('messages.newConversation')}</DialogTitle>
            <DialogDescription>
              Search for a quilter to start a conversation with
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Find a quilter</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('messages.searchUser')}
                  className="pl-10"
                  value={searchUsername}
                  onChange={(e) => {
                    setSearchUsername(e.target.value);
                    setSelectedUser(null);
                  }}
                  data-testid="input-search-users"
                />
              </div>
            </div>

            {searchUsername.length >= 2 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {searchingUsers ? (
                  <div className="p-4 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.filter(u => u.id !== user?.id).map((u) => (
                      <button
                        key={u.id}
                        className={`w-full p-3 text-left hover:bg-muted flex items-center gap-3 transition-colors ${
                          selectedUser?.id === u.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedUser(u)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.profileImageUrl || undefined} />
                          <AvatarFallback>{u.firstName?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{u.firstName} {u.lastName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No quilters found
                  </div>
                )}
              </div>
            )}

            {selectedUser && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedUser.profileImageUrl || undefined} />
                    <AvatarFallback>{selectedUser.firstName?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setSelectedUser(null)}
                  >
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Your message</Label>
                  <Textarea
                    placeholder={t('messages.initialMessage')}
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                    rows={3}
                    data-testid="input-initial-message"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewConversation(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => createConversation.mutate()}
              disabled={!selectedUser || !initialMessage.trim() || createConversation.isPending}
              data-testid="button-start-conversation"
            >
              {createConversation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {t('messages.startConversation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

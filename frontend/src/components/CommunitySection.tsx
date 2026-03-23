import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  Clock,
  MapPin,
  X,
  Send,
  Search,
  UserCircle
} from "lucide-react";

export const CommunitySection = () => {
  // --- STATE ---
  const [chats, setChats] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  // New Post Form
  const [newPostText, setNewPostText] = useState("");
  const [selectedPostResource, setSelectedPostResource] = useState<number | "">("");

  // // Hardcoded current user ID for testing (replace with actual logged-in user context)
  // const currentUserId = 1; 
  // const currentUserName = "Test User";

  // 1. Get the user data from local storage (make sure the key matches what you used, e.g., "user", "authUser")
  // Read the string directly
  const currentUserName = localStorage.getItem("userName") || "Anonymous";
  const currentUserId = localStorage.getItem("userId") || null;

  // --- FETCH DATA ON MOUNT ---
  useEffect(() => {
    fetchResources();
    fetchAllChats();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resources');
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Failed to fetch resources", error);
    }
  };

  const fetchAllChats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/comments');
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };

  // --- HANDLERS ---
  const handleShareUpdate = async () => {
    if (!selectedPostResource || !newPostText.trim()) {
      alert("Please select a resource and write a message.");
      return;
    }

    // 👇 ADD THIS CONSOLE LOG 👇
    console.log("PAYLOAD BEING SENT:", {
      user_id: currentUserId,
      resource_id: selectedPostResource,
      text: newPostText
    });

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId, // Make sure this is a real ID!
          resource_id: selectedPostResource,
          text: newPostText
        })
      });

      if (response.ok) {
        await fetchAllChats();
        setNewPostText("");
        setSelectedPostResource("");
        setIsShareModalOpen(false);
      } else {
        console.error("Failed to post comment. Server returned:", response.status);
      }
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  const filteredResources = resources.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="community" className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Community Hub
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See real-time updates from people on the ground or find a specific resource to see its status.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE: Live Chat Feed & Share Button */}
          <div className="lg:col-span-2 flex flex-col h-[600px]">
            <h3 className="text-xl font-semibold mb-4">Live Updates</h3>

            {/* Live Chat Feed */}
            <div className="flex-1 overflow-y-auto bg-muted/20 rounded-xl p-4 border space-y-4 mb-4">
              {chats.length === 0 ? (
                <p className="text-center text-muted-foreground mt-10">Loading chats...</p>
              ) : (
                chats.map((chat) => (
                  <div key={chat.id} className="flex gap-4 p-4 bg-background rounded-2xl shadow-sm border border-border/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{chat.user_name}</span>
                          <Badge variant="outline" className="text-[10px]">
                            <MapPin className="h-3 w-3 mr-1 inline" />
                            {chat.resource_name || "Resource"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1 bg-muted/30 p-3 rounded-lg rounded-tl-none inline-block">
                        {chat.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Share Button (Moved to bottom) */}
            <Button size="lg" className="w-full shadow-md" onClick={() => setIsShareModalOpen(true)}>
              <MessageSquare className="h-5 w-5 mr-2" />
              Share Your Update
            </Button>
          </div>

          {/* RIGHT SIDE: Resource Search & List */}
          <div className="lg:col-span-1 flex flex-col h-[600px]">
            <h3 className="text-xl font-semibold mb-4">Search Resources</h3>
            <Card className="flex-1 flex flex-col shadow-card border-border/50 overflow-hidden">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Find a shelter, hospital..."
                    className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Resource List */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredResources.map(resource => (
                  <button
                    key={resource.id}
                    onClick={() => setSelectedResource(resource)}
                    className="w-full text-left p-3 hover:bg-muted rounded-md transition-colors border-b last:border-0 flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium">{resource.name}</span>
                    <MessageSquare className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                {filteredResources.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">No resources found.</p>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: SHARE AN UPDATE                                  */}
      {/* ========================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsShareModalOpen(false)}></div>

          <div className="relative bg-card w-full max-w-lg mx-4 rounded-xl shadow-2xl border flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Share Update</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsShareModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Live messages context area */}
            <div className="p-4 bg-muted/20 overflow-y-auto max-h-48 border-b space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Recent Activity</p>
              {chats.slice(0, 3).map(chat => (
                <div key={`modal-${chat.id}`} className="text-xs p-2 bg-background rounded border opacity-80">
                  <span className="font-semibold">{chat.user_name}:</span> {chat.text}
                </div>
              ))}
            </div>

            {/* Input Area (Profile Style) */}
            <div className="p-4 bg-background rounded-b-xl space-y-4">

              <div className="flex items-center gap-3 mb-2">
                <UserCircle className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">{currentUserName}</p>
                  <p className="text-xs text-muted-foreground">Posting publicly</p>
                </div>
              </div>

              <div>
                <select
                  className="w-full p-2 border rounded-md text-sm bg-background focus:ring-primary mb-3"
                  value={selectedPostResource}
                  onChange={(e) => setSelectedPostResource(Number(e.target.value))}
                >
                  <option value="" disabled>Select the resource you are updating...</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>

                <textarea
                  placeholder="What's the current situation here?"
                  className="w-full p-3 rounded-md border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleShareUpdate}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SPECIFIC RESOURCE CHAT                           */}
      {/* ========================================================= */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedResource(null)}></div>

          <div className="relative bg-card w-full max-w-2xl mx-4 rounded-xl shadow-2xl border flex flex-col h-[70vh]">
            <div className="p-4 border-b flex justify-between items-center bg-primary/5 rounded-t-xl">
              <div>
                <h3 className="font-bold text-lg">Resource Logs</h3>
                <p className="text-sm font-medium text-primary flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedResource.name}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedResource(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              {chats.filter(c => c.resource_id === selectedResource.id).length > 0 ? (
                chats.filter(c => c.resource_id === selectedResource.id).map(chat => (
                  <div key={`res-chat-${chat.id}`} className="p-4 bg-background rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm">{chat.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(chat.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{chat.text}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-3 opacity-20" />
                  <p>No community updates for this resource yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
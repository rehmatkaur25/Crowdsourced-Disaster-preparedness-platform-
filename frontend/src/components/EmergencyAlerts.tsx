import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Phone,
  Radio,
  Bell,
  Clock,
  MapPin,
  X
} from "lucide-react";

const alerts = [
  {
    id: 1,
    level: "high",
    type: "Weather Alert",
    title: "Severe Thunderstorm Warning",
    message: "Heavy rain and strong winds expected in downtown area. Seek shelter immediately.",
    location: "Downtown District",
    time: "2 mins ago",
    active: true,
    icon: AlertTriangle,
    bgColor: "bg-warning/10",
    borderColor: "border-warning",
    textColor: "text-warning"
  },
  {
    id: 2,
    level: "medium",
    type: "Traffic Update",
    title: "Road Closure - Main Street",
    message: "Main Street closed due to flooding. Use alternate routes via Oak Avenue.",
    location: "Main Street Corridor",
    time: "15 mins ago",
    active: true,
    icon: Info,
    bgColor: "bg-info-blue/10",
    borderColor: "border-info-blue",
    textColor: "text-info-blue"
  },
  {
    id: 3,
    level: "low",
    type: "All Clear",
    title: "Shelter Capacity Available",
    message: "Community Center has space available for 50 additional people.",
    location: "Community Center",
    time: "1 hour ago",
    active: false,
    icon: CheckCircle,
    bgColor: "bg-safety-green/10",
    borderColor: "border-safety-green",
    textColor: "text-safety-green"
  }
];

const emergencyContacts = [
  { name: "Emergency Services", number: "112", type: "Emergency" },
  { name: "District Disaster Control", number: "1077", type: "Disaster" },
  { name: "Ambulance", number: "108", type: "Medical" }
];

export const EmergencyAlerts = () => {
  return (
    <section id="alerts" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Emergency Alerts & Contacts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with real-time emergency alerts and access critical 
            contact information when you need it most.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Alerts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Active Alerts</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-safety-green animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live Updates</span>
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <Card key={alert.id} className={`p-4 ${alert.bgColor} border-l-4 ${alert.borderColor} shadow-card`}>
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 ${alert.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${alert.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={alert.level === 'high' ? 'destructive' : alert.level === 'medium' ? 'secondary' : 'outline'}>
                              {alert.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {alert.time}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <h4 className={`font-semibold mb-1 ${alert.textColor}`}>{alert.title}</h4>
                        <p className="text-sm text-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="emergency" className="flex-1">
                <Radio className="h-4 w-4" />
                Subscribe to Alerts
              </Button>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4" />
                Report Emergency
              </Button>
            </div>
          </div>

          {/* Emergency Contacts Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-emergency-red" />
                Emergency Contacts
              </h4>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-foreground text-sm">{contact.name}</span>
                      <Badge variant="outline" className="text-xs">{contact.type}</Badge>
                    </div>
                    <a 
                      href={`tel:${contact.number}`} 
                      className="text-primary hover:text-primary/80 font-mono text-sm"
                    >
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
              <Button variant="emergency" size="sm" className="w-full mt-4">
                <Phone className="h-4 w-4" />
                Call Emergency Services
              </Button>
            </Card>


            {/* Quick Response */}
            <Card className="p-6 shadow-card bg-emergency-red/5 border-emergency-red/20">
              <h4 className="font-semibold text-foreground mb-2">In an Emergency</h4>
              <p className="text-sm text-muted-foreground mb-4">
                If this is a life-threatening emergency, call 911 immediately.
              </p>
              <Button variant="emergency" size="sm" className="w-full">
                <Phone className="h-4 w-4" />
                Call 112 Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
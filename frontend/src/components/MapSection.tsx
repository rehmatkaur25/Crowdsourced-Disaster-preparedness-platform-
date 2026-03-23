import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddResource from "./AddResource";
import {
  Search,
  Navigation,
  Zap,
  ScanLine
} from "lucide-react";

// 1. Import useMap here
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

// Fix leaflet default icon bug in vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

interface Resource {
  id: number;
  name: string;
  type: string;
  status: string;
  description: string;
  contact_number: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

// 2. Helper Component to update map view programmatically
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

export const MapSection = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // 3. State for user location (Default: Delhi)
  const [userLocation, setUserLocation] = useState<[number, number]>([28.6139, 77.209]);

  // 4. Get User Location on Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]); // Set to Bhopal/Current location
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Optional: Handle permission denied (stays at default Delhi)
        }
      );
    }
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleResourceSubmit = async (resourceData: any) => {
    await fetch("http://localhost:5000/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resourceData)
    });

    fetchResources();
    setShowModal(false);
  };

  return (
    <>
      <section id="map" className="pt-6 pb-16 lg:pt-8 lg:pb-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Interactive Resource Map
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore resources near you with our real-time mapping system.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="p-1">
                <div className="rounded-lg overflow-hidden h-96 lg:h-[600px]">
                  <MapContainer
                    center={userLocation} // Initial center
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    {/* 5. Add the Recenter Component here */}
                    <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />

                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Optional: Add a special marker for "You are Here" */}
                    <Marker position={userLocation}>
                       <Popup>You are here</Popup>
                    </Marker>

                    {resources.map((res) => {
                      if (!res.location || !res.location.coordinates) return null;
                      const [lng, lat] = res.location.coordinates;
                      return (
                        <Marker key={res.id} position={[lat, lng]}>
                          <Popup>
                            <strong>{res.name}</strong>
                            <br />
                            {res.type}
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Search Resources</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Find nearby shelters
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get directions
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowModal(true)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Report Resource
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ScanLine className="h-4 w-4 mr-2" />
                    Verify Location
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AddResource
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleResourceSubmit}
      />
    </>
  );
};
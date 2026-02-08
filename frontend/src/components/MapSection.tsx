import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Filter,
  Search,
  Navigation,
  Zap,
  Globe,
  ScanLine
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";


// fix default marker issue in vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export const MapSection = () => {
  // fake frontend pins (later comes from backend API)
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/resources")
    .then(res => res.json())
    .then(data => {
      setResources(data);
    })
    .catch(err => console.error("Map fetch error:", err));
}, []);


  return (
    <section id="map" className="pt-6 pb-16 lg:pt-8 lg:pb-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Interactive Resource Map
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore resources near you with our real-time mapping system.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* REAL MAP */}
          <div className="lg:col-span-3">
            <Card className="p-1 shadow-card">
              <div className="rounded-lg overflow-hidden h-96 lg:h-[600px]">
                
                <MapContainer
                  center={[28.6139, 77.2090]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {resources.map((res) => (
                    <Marker key={res.id} position={[
                                                  res.location.coordinates[1],
                                                  res.location.coordinates[0]
                                                ]}
>
                      <Popup>{res.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>

              </div>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Card className="p-4 shadow-card">
              <h4 className="font-semibold mb-3">Search Resources</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4" />
                  Find nearby shelters
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Navigation className="h-4 w-4" />
                  Get directions
                </Button>
              </div>
            </Card>

            <Card className="p-4 shadow-card">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="safety" size="sm" className="w-full justify-start">
                  <Zap className="h-4 w-4" />
                  Report Resource
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ScanLine className="h-4 w-4" />
                  Verify Location
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

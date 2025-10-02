
"use client";

import { useState, useEffect } from 'react';
import StarrySpotHeader from '@/components/starryspot-header';
import LocationFinder from '@/components/location-finder';
import MapView from '@/components/map-view';
import type { RecommendOptimalViewingLocationsOutput } from '@/ai/flows/recommend-optimal-viewing-locations';

// Define a combined type for recommendation that might include coordinates
type RecommendationWithCoords = RecommendOptimalViewingLocationsOutput & {
  latitude?: number;
  longitude?: number;
};


export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [recommendedSpot, setRecommendedSpot] = useState<RecommendationWithCoords | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Ensure this runs only on the client
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <StarrySpotHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <LocationFinder
              onLocationUpdate={setUserLocation}
              onRecommendation={setRecommendedSpot}
              currentRecommendation={recommendedSpot}
            />
          </div>
          <div className="md:col-span-3">
            <MapView
              userLocation={userLocation}
              recommendedSpot={recommendedSpot}
              apiKey={googleMapsApiKey}
            />
             {!googleMapsApiKey && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Map functionality requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to be set.
              </p>
            )}
          </div>
        </div>
      </main>
      <footer className="py-4 px-4 md:px-6 text-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} StarrySpot. Happy star-gazing!
        </p>
      </footer>
    </div>
  );
}

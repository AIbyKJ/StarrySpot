
"use client";

import type { FC } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import type { RecommendOptimalViewingLocationsOutput } from '@/ai/flows/recommend-optimal-viewing-locations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface MapViewProps {
  userLocation: { latitude: number; longitude: number } | null;
  recommendedSpot: (RecommendOptimalViewingLocationsOutput & {latitude?: number, longitude?: number}) | null; // Assuming AI might return coordinates or we derive them
  apiKey: string | undefined;
}

const MapView: FC<MapViewProps> = ({ userLocation, recommendedSpot, apiKey }) => {
  const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of US
  const zoomLevel = userLocation || recommendedSpot ? 8 : 4;
  
  let mapCenter = defaultCenter;
  if (recommendedSpot && recommendedSpot.latitude && recommendedSpot.longitude) {
    mapCenter = { lat: recommendedSpot.latitude, lng: recommendedSpot.longitude };
  } else if (userLocation) {
    mapCenter = { lat: userLocation.latitude, lng: userLocation.longitude };
  }


  if (!apiKey) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle>Map Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Google Maps API key is not configured. Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.</p>
        </CardContent>
      </Card>
    );
  }

  // For demonstration, if recommendedSpot doesn't have lat/lng, we might place it near user or a default.
  // In a real scenario, the AI response or a geocoding step should provide coordinates for the locationName.
  // Let's assume for now `recommendedSpot` might get `latitude` and `longitude` properties if resolved.
  // For this example, if a recommendation exists but has no explicit coords, we'll use user's location as a fallback for its marker.
  const recommendationMarkerPosition = recommendedSpot?.latitude && recommendedSpot?.longitude 
    ? { lat: recommendedSpot.latitude, lng: recommendedSpot.longitude }
    : userLocation; // Fallback, not ideal.


  return (
    <div className="h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg my-4 border border-border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={zoomLevel}
          center={mapCenter}
          zoom={zoomLevel}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="starrySpotMap"
          className="w-full h-full"
        >
          {userLocation && (
            <Marker
              position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
              title="Your Location"
            />
          )}
          {recommendedSpot && recommendationMarkerPosition && (
            <Marker
              position={{ lat: recommendationMarkerPosition.lat, lng: recommendationMarkerPosition.lng }}
              title={`Recommended: ${recommendedSpot.locationName}`}
              icon={{
                path: google.maps.SymbolPath.CIRCLE, // Placeholder, ideally a star or custom icon
                fillColor: 'hsl(var(--primary))', // Yellow
                fillOpacity: 1,
                strokeColor: 'hsl(var(--primary-foreground))', // Dark Blue
                strokeWeight: 1,
                scale: 8,
              }}
            >
               {/* InfoWindow is typically opened on click, not by default. 
                   This is just an example of how it could be structured.
                   For persistent display, consider a custom overlay.
               <InfoWindow position={{ lat: recommendationMarkerPosition.lat, lng: recommendationMarkerPosition.lng }}>
                <div className="p-2">
                  <h3 className="font-semibold text-sm text-popover-foreground">{recommendedSpot.locationName}</h3>
                  <p className="text-xs text-muted-foreground">{recommendedSpot.reason}</p>
                </div>
              </InfoWindow> */}
            </Marker>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapView;

// Note on mapId: You may need to enable "Advanced Markers" in your Google Cloud Console for custom styling if using `glyph` or `background`.
// For simpler markers, standard Marker props are fine.
// The mapId prop is for Cloud-based Maps Styling if you have one set up.
// For this example, a simple marker or an icon prop on the Marker is used.
// For Star icon with Lucide: SVG icons can be used with Markers, often by converting to data URI or using Advanced Markers.
// google.maps.SymbolPath.CIRCLE is a built-in shape. A proper star icon would need more setup.
// Using a colored circle as a visual distinction for the recommended spot.

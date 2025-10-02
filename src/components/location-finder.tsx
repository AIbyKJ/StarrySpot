
"use client";

import {FC, useEffect} from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useToast } from '@/hooks/use-toast';
import { recommendOptimalViewingLocations, type RecommendOptimalViewingLocationsInput, type RecommendOptimalViewingLocationsOutput } from '@/ai/flows/recommend-optimal-viewing-locations';
import { LocateFixed, Wand2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationFinderProps {
  onLocationUpdate: (location: { latitude: number; longitude: number } | null) => void;
  onRecommendation: (recommendation: (RecommendOptimalViewingLocationsOutput & {latitude?: number, longitude?: number}) | null) => void;
  currentRecommendation: (RecommendOptimalViewingLocationsOutput & {latitude?: number, longitude?: number}) | null;
}

const LocationFinder: FC<LocationFinderProps> = ({ onLocationUpdate, onRecommendation, currentRecommendation }) => {
  const { position, error: geoError, loading: geoLoading, getPosition } = useGeolocation();
  const { toast } = useToast();
  const [aiLoading, setAiLoading] = useState(false);

  const handleFindLocation = () => {
    getPosition();
  };

  // Effect to update parent when geolocation position changes
  useEffect(() => {
    if (position) {
      onLocationUpdate(position);
    }
    if (geoError) {
      toast({
        title: "Geolocation Error",
        description: geoError.message,
        variant: "destructive",
      });
      onLocationUpdate(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, geoError, onLocationUpdate]);


  const handleRecommendSpot = async () => {
    if (!position) {
      toast({
        title: "Location Needed",
        description: "Please find your location first to get a recommendation.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    onRecommendation(null); // Clear previous recommendation
    try {
      const input: RecommendOptimalViewingLocationsInput = {
        latitude: position.latitude,
        longitude: position.longitude,
      };
      const result = await recommendOptimalViewingLocations(input);
      // For map plotting, we might need to geocode locationName or the AI could return coordinates.
      // For now, let's assume the recommendation itself might contain lat/lng or we derive it.
      // We'll pass user's current location for now as a placeholder if AI doesn't provide exact coords for the recommended spot.
      onRecommendation({...result, latitude: position.latitude, longitude: position.longitude + 0.1}); // Example offset for map
    } catch (err) {
      console.error("AI Recommendation Error:", err);
      toast({
        title: "Recommendation Failed",
        description: "Could not fetch a recommendation at this time.",
        variant: "destructive",
      });
      onRecommendation(null);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
      <Card className="shadow-lg md:flex-col">
        <CardHeader>
          <CardTitle>Find Your Spot</CardTitle>
          <CardDescription>Use your current location to find the best nearby star-gazing spot.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleFindLocation} disabled={geoLoading} className="w-full">
            {geoLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="mr-2 h-4 w-4" />
            )}
            Find My Location
          </Button>
          {position && (
            <div className="text-sm text-muted-foreground">
              <p>Latitude: {position.latitude.toFixed(4)}</p>
              <p>Longitude: {position.longitude.toFixed(4)}</p>
            </div>
          )}
          {geoError && <p className="text-sm text-destructive">{geoError.message}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleRecommendSpot} disabled={!position || aiLoading} className="w-full" variant="outline">
            {aiLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Recommend Best Spot
          </Button>
        </CardFooter>
      </Card>

      {aiLoading && !currentRecommendation && (
        <Card className="shadow-lg w-full">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-3/4" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-1/2" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      )}

      {currentRecommendation && !aiLoading && (
         <Card className="flex-grow shadow-lg animate-in fade-in-50 duration-500 w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="text-primary h-16 w-16" />
              Optimal Spot: {currentRecommendation.locationName}
            </CardTitle>
            <CardDescription>AI-powered recommendation based on current conditions.</CardDescription>
          </CardHeader>
          <CardContent>
            Coordinates:  <br />
            Latitude: {currentRecommendation.latitude}, <br />
            Longitude: {currentRecommendation.longitude}
            <p className="text-sm text-foreground">{currentRecommendation.reason}</p>
            {/* Placeholder for actual weather/light pollution details if available */}
            {/* <div className="mt-3 text-xs text-muted-foreground">
              <p>Cloud Cover: {currentRecommendation.cloudCover}% (example)</p>
              <p>Visibility: {currentRecommendation.visibility} miles (example)</p>
              <p>Light Pollution: {currentRecommendation.lightPollutionLevel} (example)</p>
            </div> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationFinder;

// src/ai/flows/recommend-optimal-viewing-locations.ts
'use server';

/**
 * @fileOverview Recommends optimal star-gazing locations based on weather and light pollution data.
 *
 * - recommendOptimalViewingLocations - A function that recommends locations.
 * - RecommendOptimalViewingLocationsInput - The input type for the recommendOptimalViewingLocations function.
 * - RecommendOptimalViewingLocationsOutput - The return type for the recommendOptimalViewingLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getWeather} from '@/services/weather';
import {getLightPollutionData} from '@/services/nasa-light-pollution';

const RecommendOptimalViewingLocationsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user location.'),
  longitude: z.number().describe('The longitude of the user location.'),
});
export type RecommendOptimalViewingLocationsInput = z.infer<typeof RecommendOptimalViewingLocationsInputSchema>;

const RecommendOptimalViewingLocationsOutputSchema = z.object({
  locationName: z.string().describe('The name of the recommended location.'),
  locationLong: z.number().describe('The location longitude.'),
  locationLat: z.number().describe('The location latitude.'),
  reason: z.string().describe('The detailed reason why this location is recommended for star-gazing, based on weather and light pollution.'),
});
export type RecommendOptimalViewingLocationsOutput = z.infer<typeof RecommendOptimalViewingLocationsOutputSchema>;

export async function recommendOptimalViewingLocations(
  input: RecommendOptimalViewingLocationsInput
): Promise<RecommendOptimalViewingLocationsOutput> {
  return recommendOptimalViewingLocationsFlow(input);
}

const recommendOptimalViewingLocationsPrompt = ai.definePrompt({
  name: 'recommendOptimalViewingLocationsPrompt',
  input: {schema: RecommendOptimalViewingLocationsInputSchema},
  output: {schema: RecommendOptimalViewingLocationsOutputSchema},
  prompt: `Based on the user's current location and real-time weather conditions and light pollution data, recommend an optimal star-gazing location near the user.

User's Location: Latitude: {{latitude}}, Longitude: {{longitude}}

Weather Conditions: Cloud cover: {{cloudCover}}%, Visibility: {{visibility}} miles

Light Pollution Level: {{lightPollutionLevel}}

Consider these factors when recommending a location: minimal cloud cover, good visibility, and low light pollution. Provide a detailed reason for your recommendation.
`,
});

const recommendOptimalViewingLocationsFlow = ai.defineFlow(
  {
    name: 'recommendOptimalViewingLocationsFlow',
    inputSchema: RecommendOptimalViewingLocationsInputSchema,
    outputSchema: RecommendOptimalViewingLocationsOutputSchema,
  },
  async input => {
    const weather = await getWeather(input.latitude, input.longitude);
    const lightPollutionData = await getLightPollutionData(input.latitude, input.longitude);

    const promptInput = {
      ...input,
      cloudCover: weather.cloudCover,
      visibility: weather.visibility,
      lightPollutionLevel: lightPollutionData.lightPollutionLevel,
    };

    const {output} = await recommendOptimalViewingLocationsPrompt(promptInput);
    return output!;
  }
);

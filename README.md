# 🌟 StarrySpot

**Find the best spots for star-gazing with AI-powered recommendations**

StarrySpot is a modern web application that helps astronomy enthusiasts and stargazers discover optimal viewing locations based on real-time weather conditions, light pollution data, and GPS location. Using AI-powered analysis, it provides personalized recommendations for the best stargazing experiences.

## ✨ Features

- **🗺️ Interactive Map**: Visual map interface with Google Maps integration showing your location and recommended spots
- **📍 GPS Location Finder**: Automatically detect your current location for personalized recommendations
- **🤖 AI-Powered Recommendations**: Smart suggestions based on:
  - Real-time weather conditions (cloud cover, visibility)
  - NASA light pollution data
  - Your current location
- **🌙 Dark Theme**: Beautiful dark UI optimized for night-time usage
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Radix UI primitives with shadcn/ui
- **Maps**: Google Maps API via @vis.gl/react-google-maps
- **AI**: Google Genkit for AI-powered recommendations
- **TypeScript**: Full type safety throughout the application
- **Icons**: Lucide React icons

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StarrySpot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🎯 Usage

1. **Find Your Location**: Click the "Find My Location" button to get your current GPS coordinates
2. **Get AI Recommendations**: The app will automatically analyze weather conditions and light pollution data to suggest optimal stargazing spots
3. **View on Map**: See your location and recommended spots visualized on an interactive map
4. **Explore Details**: Review the AI's reasoning for each recommendation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching

### Project Structure

```
src/
├── ai/                 # AI flows and Genkit configuration
│   └── flows/         # AI recommendation logic
├── app/               # Next.js app router pages
├── components/        # React components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── services/         # External API integrations
    ├── weather.ts    # Weather API service
    └── nasa-light-pollution.ts # NASA data service
```

## 🎨 Design System

StarrySpot uses a carefully crafted dark theme optimized for stargazing:

- **Primary Color**: Dark Blue (#001F3F) - Evokes the night sky
- **Secondary Color**: Light Grey (#D3D3D3) - Ensures readability
- **Accent Color**: Yellow (#FFD700) - Highlights important elements
- **Typography**: Geist Sans and Geist Mono fonts

## 🔮 Future Enhancements

- [ ] Integration with real NASA light pollution APIs
- [ ] Real-time weather API integration
- [ ] User accounts and favorite locations
- [ ] Community reviews and ratings for spots
- [ ] Astronomical event notifications
- [ ] Offline map support
- [ ] Social sharing features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- NASA for light pollution data
- Google Maps for mapping services
- The astronomy community for inspiration

---

**Happy Stargazing! 🌟**

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Search, MapPin, X, AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";

type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  delayProbability: number | null;
  source: "LANDLYTICS" | "MAP";
}

/*
 * ============================================================
 * LANDLYTICS DEMO RISK DATA
 * ============================================================
 *
 * These are the locations for which our application currently
 * has acquisition-risk information.
 *
 * Searching other places will still navigate the map there,
 * but we won't invent a risk score when no data exists.
 */

const KNOWN_RISKS: Record<string, LocationData> = {
  mangaluru: {
    name: "Mangaluru, Karnataka",
    lat: 12.9141,
    lng: 74.8560,
    riskScore: 70,
    riskLevel: "HIGH",
    delayProbability: 70,
    source: "LANDLYTICS",
  },

  madurai: {
    name: "Madurai, Tamil Nadu",
    lat: 9.9252,
    lng: 78.1198,
    riskScore: 85,
    riskLevel: "CRITICAL",
    delayProbability: 85,
    source: "LANDLYTICS",
  },

  pune: {
    name: "Pune, Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    riskScore: 79,
    riskLevel: "HIGH",
    delayProbability: 79,
    source: "LANDLYTICS",
  },

  varanasi: {
    name: "Varanasi, Uttar Pradesh",
    lat: 25.3176,
    lng: 82.9739,
    riskScore: 86,
    riskLevel: "CRITICAL",
    delayProbability: 86,
    source: "LANDLYTICS",
  },

  dholera: {
    name: "Dholera, Gujarat",
    lat: 22.2500,
    lng: 72.1900,
    riskScore: 36,
    riskLevel: "LOW",
    delayProbability: 36,
    source: "LANDLYTICS",
  },

  belagavi: {
    name: "Belagavi, Karnataka",
    lat: 15.8497,
    lng: 74.4977,
    riskScore: 70,
    riskLevel: "HIGH",
    delayProbability: 70,
    source: "LANDLYTICS",
  },
};


/*
 * ============================================================
 * MAP FLY CONTROLLER
 * ============================================================
 */

const MapController: React.FC<{
  center: [number, number];
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
    });
  }, [center, zoom, map]);

  return null;
};


/*
 * ============================================================
 * RISK HELPERS
 * ============================================================
 */

const getRiskClass = (risk: RiskLevel | null) => {
  switch (risk) {
    case "CRITICAL":
      return "bg-red-100 text-red-700 border-red-200";

    case "HIGH":
      return "bg-orange-100 text-orange-700 border-orange-200";

    case "MODERATE":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "LOW":
      return "bg-green-100 text-green-700 border-green-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};


/*
 * ============================================================
 * GIS RISK MAP
 * ============================================================
 */

export const GISRiskMapPage: React.FC = () => {

  /*
   * Start at Mangaluru.
   */
  const [center, setCenter] = useState<[number, number]>([
    12.9141,
    74.8560,
  ]);

  const [zoom, setZoom] = useState(12);

  const [location, setLocation] = useState<LocationData>(
    KNOWN_RISKS.mangaluru
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<
    LocationData[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [showResults, setShowResults] = useState(false);


  /*
   * ==========================================================
   * LOCAL SEARCH
   * ==========================================================
   */

  const searchKnownLocations = (query: string) => {

    const q = query.toLowerCase().trim();

    if (!q) {
      setSearchResults([]);
      return;
    }

    const results = Object.values(KNOWN_RISKS).filter((item) =>
      item.name.toLowerCase().includes(q)
    );

    setSearchResults(results);
  };


  /*
   * ==========================================================
   * OPENSTREETMAP SEARCH
   * ==========================================================
   *
   * No API key is required.
   */

  const searchLocation = async () => {

    const query = searchQuery.trim();

    if (!query) return;

    /*
     * First check our LANDLYTICS locations.
     */
    const known = Object.values(KNOWN_RISKS).find((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    if (known) {
      selectLocation(known);
      return;
    }

    /*
     * Otherwise search the actual place using
     * OpenStreetMap Nominatim.
     */

    try {

      setLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=in`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!data || data.length === 0) {

        setSearchResults([]);

        setLocation({
          name: query,
          lat: center[0],
          lng: center[1],
          riskScore: null,
          riskLevel: null,
          delayProbability: null,
          source: "MAP",
        });

        return;
      }

      const results: LocationData[] = data.map((item: any) => {

        const lat = Number(item.lat);
        const lng = Number(item.lon);

        return {
          name: item.display_name
            .split(",")
            .slice(0, 3)
            .join(","),
          lat,
          lng,
          riskScore: null,
          riskLevel: null,
          delayProbability: null,
          source: "MAP",
        };
      });

      setSearchResults(results);
      setShowResults(true);

    } catch (error) {

      console.error("Location search failed:", error);

    } finally {

      setLoading(false);

    }
  };


  /*
   * ==========================================================
   * SELECT LOCATION
   * ==========================================================
   */

  const selectLocation = (item: LocationData) => {

    setCenter([item.lat, item.lng]);

    /*
     * City-level zoom.
     */
    setZoom(13);

    setLocation(item);

    setSearchQuery(item.name);

    setSearchResults([]);

    setShowResults(false);
  };


  /*
   * ==========================================================
   * SEARCH INPUT
   * ==========================================================
   */

  const handleSearchChange = (value: string) => {

    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    /*
     * Show known LANDLYTICS locations immediately.
     */
    searchKnownLocations(value);

    setShowResults(true);
  };


  /*
   * ==========================================================
   * ENTER KEY
   * ==========================================================
   */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (e.key === "Enter") {
      searchLocation();
    }
  };


  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className="relative w-full h-[calc(100vh-76px)] bg-[#F7F3EA] overflow-hidden">

      {/* =====================================================
          MAP
      ===================================================== */}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        <MapController
          center={center}
          zoom={zoom}
        />

        {/* OpenStreetMap
            NO API KEY
            NO CARTO
            NO API KEY REQUIRED MESSAGE
        */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </MapContainer>


      {/* =====================================================
          SEARCH BOX
      ===================================================== */}

      <div className="absolute top-5 left-5 z-[1000] w-[430px]">

        <div className="relative">

          <div className="flex items-center bg-white/95 backdrop-blur-xl border border-[#D8C8B5] rounded-2xl shadow-xl px-4 py-3">

            <Search className="w-5 h-5 text-[#6B4F3A] mr-3" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Search any place..."
              className="flex-1 bg-transparent outline-none text-sm text-[#2F211A] placeholder-[#9A8879]"
            />

            {loading && (
              <span className="text-xs text-[#8A6A50]">
                Searching...
              </span>
            )}

            {searchQuery && !loading && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowResults(false);
                }}
              >
                <X className="w-4 h-4 text-[#806B5A]" />
              </button>
            )}

          </div>


          {/* =================================================
              SEARCH RESULTS
          ================================================= */}

          {showResults && searchResults.length > 0 && (

            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#D8C8B5] shadow-2xl overflow-hidden">

              {searchResults.map((item, index) => (

                <button
                  key={`${item.name}-${index}`}
                  onClick={() => selectLocation(item)}
                  className="w-full text-left px-4 py-3 hover:bg-[#F5EEE4] border-b last:border-b-0 border-[#EEE4D8] flex items-center gap-3"
                >

                  <div className="w-9 h-9 rounded-xl bg-[#EFE2D2] flex items-center justify-center">

                    <MapPin className="w-4 h-4 text-[#8C4A2F]" />

                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-[#2F211A]">
                      {item.name}
                    </p>

                    {item.riskLevel && (
                      <p className="text-xs text-[#7D6B5D]">
                        Risk: {item.riskScore}/100
                      </p>
                    )}

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>


        {/* ===================================================
            QUICK LOCATIONS
        =================================================== */}

        <div className="flex gap-2 mt-2 flex-wrap">

          {[
            "Mangaluru",
            "Madurai",
            "Pune",
            "Varanasi",
            "Belagavi",
          ].map((city) => (

            <button
              key={city}
              onClick={() => {

                const item =
                  KNOWN_RISKS[city.toLowerCase()];

                if (item) {
                  selectLocation(item);
                }

              }}
              className="px-3 py-1.5 bg-white/95 border border-[#D8C8B5] rounded-xl text-xs font-semibold text-[#4A3426] shadow-md hover:bg-[#F1E7DA]"
            >

              📍 {city}

            </button>

          ))}

        </div>

      </div>


      {/* =====================================================
          RIGHT RISK PANEL
      ===================================================== */}

      <div className="absolute top-5 right-5 bottom-5 z-[1000] w-[370px]">

        <div className="h-full bg-[#F9F5EE]/95 backdrop-blur-xl border border-[#D8C8B5] rounded-3xl shadow-2xl p-6 overflow-y-auto">

          {/* Header */}

          <div className="pb-4 border-b border-[#E2D5C5]">

            <p className="text-[11px] uppercase tracking-widest font-bold text-[#9A5738]">
              GIS Risk Analysis
            </p>

            <h2 className="text-xl font-bold text-[#2F211A] mt-1">
              {location.name}
            </h2>

            <p className="text-xs text-[#887466] mt-1">
              Location-based land acquisition assessment
            </p>

          </div>


          {/* =================================================
              RISK AVAILABLE
          ================================================= */}

          {location.riskLevel ? (

            <>

              {/* Risk Score */}

              <div className="mt-5 p-5 rounded-2xl bg-white border border-[#E1D4C4]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[11px] uppercase tracking-wide font-bold text-[#806B5A]">
                      Predicted Delay Risk
                    </p>

                    <div className="flex items-baseline gap-1 mt-1">

                      <span className="text-5xl font-black text-[#9B3D32]">
                        {location.riskScore}
                      </span>

                      <span className="text-sm font-bold text-[#806B5A]">
                        /100
                      </span>

                    </div>

                  </div>


                  <div
                    className={`px-4 py-2 rounded-full border text-xs font-black ${getRiskClass(
                      location.riskLevel
                    )}`}
                  >

                    {location.riskLevel}

                  </div>

                </div>

              </div>


              {/* Delay Probability */}

              <div className="mt-3 grid grid-cols-2 gap-3">

                <div className="bg-white border border-[#E1D4C4] rounded-2xl p-4">

                  <p className="text-[10px] uppercase font-bold text-[#806B5A]">
                    Delay Probability
                  </p>

                  <p className="text-2xl font-black text-[#3B291F] mt-1">
                    {location.delayProbability}%
                  </p>

                </div>


                <div className="bg-white border border-[#E1D4C4] rounded-2xl p-4">

                  <p className="text-[10px] uppercase font-bold text-[#806B5A]">
                    Risk Status
                  </p>

                  <p className="text-sm font-black text-[#3B291F] mt-2">
                    {location.riskLevel === "CRITICAL"
                      ? "Immediate Attention"
                      : location.riskLevel === "HIGH"
                      ? "High Priority"
                      : location.riskLevel === "MODERATE"
                      ? "Monitor Closely"
                      : "Low Concern"}
                  </p>

                </div>

              </div>


              {/* Risk Explanation */}

              <div className="mt-5">

                <div className="flex items-center gap-2 mb-3">

                  <AlertTriangle className="w-4 h-4 text-[#9A5738]" />

                  <h3 className="font-bold text-sm text-[#3B291F]">
                    Acquisition Risk Assessment
                  </h3>

                </div>

                <div className="bg-[#EFE4D5] rounded-2xl p-4">

                  <p className="text-xs leading-relaxed text-[#5C4638]">

                    Land acquisition activities in this
                    location indicate a{" "}
                    <strong>
                      {location.riskLevel.toLowerCase()}
                    </strong>{" "}
                    level of potential delay risk.

                    <br />
                    <br />

                    The LANDLYTICS risk engine can use
                    ownership conflicts, legal issues,
                    compensation progress, documentation,
                    rehabilitation and possession status
                    to assess acquisition bottlenecks.

                  </p>

                </div>

              </div>


              {/* Source */}

              <div className="mt-4 text-[10px] text-[#8B7767]">

                Risk information:
                <strong className="ml-1">
                  {location.source === "LANDLYTICS"
                    ? "LANDLYTICS acquisition data"
                    : "Location database"}
                </strong>

              </div>

            </>

          ) : (

            /* =================================================
               LOCATION FOUND BUT NO RISK DATA
            ================================================= */

            <div className="mt-5">

              <div className="p-5 rounded-2xl bg-white border border-[#E1D4C4]">

                <div className="w-12 h-12 rounded-2xl bg-[#EFE4D5] flex items-center justify-center mb-4">

                  <MapPin className="w-5 h-5 text-[#8C4A2F]" />

                </div>

                <h3 className="font-bold text-base text-[#3B291F]">
                  Location Found
                </h3>

                <p className="text-xs text-[#806B5A] mt-2 leading-relaxed">

                  The map has successfully navigated to
                  this location.

                  <br />
                  <br />

                  However, LANDLYTICS currently has no
                  acquisition-risk dataset for this
                  location, so a risk score is not
                  displayed.

                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};
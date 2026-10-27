"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  CloudSun,
  Droplets,
  Flame,
  Gauge,
  Globe2,
  HeartPulse,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  Navigation,
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  Siren,
  ThermometerSun,
  Trees,
  Users,
  Wind,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Live Disaster Map", icon: Map, path: "/map" },
  { label: "Weather Forecast", icon: CloudSun, path: "/weather" },
  { label: "AI Risk Predictions", icon: Activity, path: "/predictions" },
  { label: "Alerts & Notifications", icon: Bell, path: "/alerts" },
  { label: "AI Disaster Assistant", icon: MessageSquare, path: "/assistant" },
  { label: "Emergency & SOS", icon: Siren, path: "/emergency" },
  { label: "Shelters & Safe Zones", icon: Home, path: "/shelters" },
  { label: "Community Reports", icon: Users, path: "/reports" },
  { label: "Preparedness Center", icon: BookOpen, path: "/preparedness" },
  { label: "My Locations", icon: Navigation, path: "/locations" },
  { label: "Settings", icon: Settings, path: "/settings" },
];
const risks = [
  {
    label: "Flood risk",
    value: "Moderate",
    score: 58,
    icon: Droplets,
    tone: "amber",
    note: "Rainfall expected to increase",
  },
  {
    label: "Heavy rainfall",
    value: "Elevated",
    score: 72,
    icon: CloudRain,
    tone: "red",
    note: "Peak intensity around 3 PM",
  },
  {
    label: "Cyclone risk",
    value: "Low",
    score: 18,
    icon: Wind,
    tone: "teal",
    note: "No active systems detected",
  },
  {
    label: "Heatwave risk",
    value: "Low",
    score: 24,
    icon: ThermometerSun,
    tone: "blue",
    note: "Temperatures within seasonal range",
  },
];
function RiskBadge({
  tone,
  children,
}: {
  tone: string;
  children: React.ReactNode;
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
function Header({
  onMenu,
  onNavigate,
  path,
  userName,
}: {
  onMenu: () => void;
  onNavigate: (path: string) => void;
  path: string;
  userName: string;
}) {
  const title = navItems.find((item) => item.path === path)?.label ?? "Overview";
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <header className="topbar">
      <button
        className="icon-btn mobile-only"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </button>
      <div className="crumb">
        <span className="muted">Workspace</span>
        <span>/</span>
        <strong>{title}</strong>
      </div>
      <div className="top-actions">
        <button
          className="icon-btn"
          onClick={() => onNavigate("/alerts")}
          aria-label="View notifications"
        >
          <Bell />
        </button>
        <button className="profile" onClick={() => onNavigate("/settings")}>
          <span className="avatar">{initials || "DS"}</span>
          <span className="profile-name">{userName}</span>
          <ChevronDown />
        </button>
      </div>
    </header>
  );
}
function Sidebar({
  path,
  onNavigate,
  open,
  onClose,
  locationLabel,
}: {
  path: string;
  onNavigate: (path: string) => void;
  open: boolean;
  onClose: () => void;
  locationLabel: string;
}) {
  return (
    <>
      {open && (
        <button
          className="scrim"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Shield />
          </div>
          <div>
            <strong>DisasterShield</strong>
            <span>AI OPERATIONS</span>
          </div>
          <button
            className="icon-btn sidebar-close mobile-only"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <div className="location-select">
          <div className="location-icon">
            <Navigation />
          </div>
          <div>
            <span>MONITORING LOCATION</span>
            <strong>{locationLabel}</strong>
          </div>
          <ChevronDown />
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${path === item.path ? "active" : ""}`}
                onClick={() => {
                  onNavigate(item.path);
                  onClose();
                }}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <button className="help-card" onClick={() => onNavigate("/emergency")}>
            <LifeBuoy />
            <div>
              <strong>Need help?</strong>
              <span>Open emergency center</span>
            </div>
            <ArrowUpRight />
          </button>
          <button className="nav-item" onClick={() => onNavigate("/login")}>
            <LogOut />
            <span>Sign out</span>
          </button>
          <p className="sidebar-footer">Weather and official alert sources shown by status</p>
        </div>
      </aside>
    </>
  );
}
function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon />
      </div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
      <ArrowUpRight className="stat-arrow" />
    </div>
  );
}
function MapPreview({
  location,
  onNavigate,
}: {
  location: { name: string; admin: string; latitude: number; longitude: number };
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="map-preview">
      <iframe
        title={`OpenStreetMap: ${location.name}, ${location.admin}`}
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.22}%2C${location.latitude - 0.16}%2C${location.longitude + 0.22}%2C${location.latitude + 0.16}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
      />
      <button className="map-open" onClick={() => onNavigate("/map")}>
        Explore {location.name} <ArrowUpRight size={15} />
      </button>
    </div>
  );
}
function Dashboard({
  onNavigate,
  location,
  setLocation,
  userName,
}: {
  onNavigate: (path: string) => void;
  location: {
    name: string;
    admin: string;
    latitude: number;
    longitude: number;
  };
  setLocation: (location: {
    name: string;
    admin: string;
    latitude: number;
    longitude: number;
  }) => void;
  userName: string;
}) {
  const [cityQuery, setCityQuery] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [weather, setWeather] = useState<{
    temperature: number;
    wind: number;
    rain24: number;
    humidity: number;
    description: string;
  } | null>(null);
  const [forecastData, setForecastData] = useState<
    { time: string; rain: number; temp: number }[]
  >([]);
  const [weatherState, setWeatherState] = useState<
    "loading" | "live" | "error"
  >("loading");
  const [officialAlerts, setOfficialAlerts] = useState<
    {
      id: string;
      title: string;
      titleEnglish?: string;
      descriptionEnglish?: string;
      link: string;
      pubDate: string;
      source: string;
      areaMatch?: boolean;
      areaMatchNote?: string;
    }[]
  >([]);
  const [alertsFeedState, setAlertsFeedState] = useState<
    "loading" | "live" | "error"
  >("loading");
  useEffect(() => {
    let cancelled = false;
    setAlertsFeedState("loading");
    fetch(
      `/api/alerts?city=${encodeURIComponent(location.name)}&region=${encodeURIComponent(location.admin)}`,
      { cache: "no-store" },
    )
      .then((response) => response.json())
      .then((result) => {
        if (!cancelled) {
          setOfficialAlerts(
            result.ok && Array.isArray(result.alerts) ? result.alerts : [],
          );
          setAlertsFeedState(result.ok ? "live" : "error");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOfficialAlerts([]);
          setAlertsFeedState("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [location.name, location.admin]);
  useEffect(() => {
    let cancelled = false;
    setWeatherState("loading");
    setWeather(null);
    setForecastData([]);
    async function loadWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,wind_speed_10m,weather_code&hourly=precipitation,temperature_2m&daily=wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=2`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather service unavailable");
        const data = await response.json();
        const times: string[] = data.hourly?.time ?? [];
        const precipitation: number[] = data.hourly?.precipitation ?? [];
        const currentTime = data.current?.time ?? "";
        let start = times.findIndex((time) => time >= currentTime.slice(0, 13));
        if (start < 0) start = 0;
        const rain24 = precipitation
          .slice(start, start + 24)
          .reduce((sum, value) => sum + (Number(value) || 0), 0);
        const hourlyTemps: number[] = data.hourly?.temperature_2m ?? [];
        const points = times.slice(start, start + 24).map((time, index) => ({
          time: time.slice(11, 16),
          rain: Number(precipitation[start + index] ?? 0),
          temp: Number(
            hourlyTemps[start + index] ?? data.current?.temperature_2m ?? 0,
          ),
        }));
        const code = Number(data.current?.weather_code ?? 0);
        const description =
          code === 0
            ? "Clear"
            : code <= 3
              ? "Partly cloudy"
              : code <= 48
                ? "Foggy"
                : code <= 67
                  ? "Rain conditions"
                  : code <= 77
                    ? "Snow conditions"
                    : code <= 82
                      ? "Rain showers"
                      : "Thunderstorm conditions";
        if (!cancelled) {
          setWeather({
            temperature: Number(data.current?.temperature_2m ?? 0),
            wind: Number(
              data.daily?.wind_speed_10m_max?.[0] ??
                data.current?.wind_speed_10m ??
                0,
            ),
            rain24,
            humidity: Number(data.current?.relative_humidity_2m ?? 0),
            description,
          });
          setForecastData(points);
          setWeatherState("live");
        }
      } catch {
        if (!cancelled) {
          setWeather(null);
          setForecastData([]);
          setWeatherState("error");
        }
      }
    }
    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [location.latitude, location.longitude]);
  async function changeLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = cityQuery.trim();
    if (!query) return;
    setSearchingLocation(true);
    setLocationMessage("");
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
      );
      if (!response.ok) throw new Error("Location search failed");
      const data = await response.json();
      const result = data.results?.[0];
      if (!result) {
        setLocationMessage("City not found. Try another city name.");
        return;
      }
      setLocation({
        name: result.name,
        admin: result.admin1 || result.country || "Selected area",
        latitude: result.latitude,
        longitude: result.longitude,
      });
      setCityQuery("");
      setLocationMessage(`Monitoring location changed to ${result.name}.`);
    } catch {
      setLocationMessage(
        "Could not search right now. Check your internet and try again.",
      );
    } finally {
      setSearchingLocation(false);
    }
  }
  const rainText = weather
    ? `${Math.round(weather.rain24 * 10) / 10} mm`
    : weatherState === "loading"
      ? "Loading…"
      : "Unavailable";
  const windText = weather
    ? `${Math.round(weather.wind)} km/h`
    : weatherState === "loading"
      ? "Loading…"
      : "Unavailable";
  // Transparent heuristic indicators based on forecast weather only; not a validated disaster-prediction model.
  const rainScore = weather
    ? Math.min(100, Math.round(weather.rain24 * 2.5))
    : 0;
  const windScore = weather ? Math.min(100, Math.round(weather.wind * 1.5)) : 0;
  const floodScore = weather
    ? Math.min(
        100,
        Math.round(rainScore * 0.8 + Math.max(0, weather.rain24 - 20) * 0.5),
      )
    : 0;
  const heatScore = weather
    ? Math.min(100, Math.max(0, Math.round((weather.temperature - 28) * 5)))
    : 0;
  const level = (score: number) =>
    score >= 70
      ? "High"
      : score >= 40
        ? "Moderate"
        : score >= 20
          ? "Low"
          : "Very low";
  const dynamicRisks = weather
    ? [
        {
          label: "Flood risk indicator",
          value: level(floodScore),
          score: floodScore,
          icon: Droplets,
          tone: floodScore >= 70 ? "red" : floodScore >= 40 ? "amber" : "teal",
          note: `Based on next 24h forecast rainfall (${Math.round(weather.rain24 * 10) / 10} mm)`,
        },
        {
          label: "Heavy rainfall indicator",
          value: level(rainScore),
          score: rainScore,
          icon: CloudRain,
          tone: rainScore >= 70 ? "red" : rainScore >= 40 ? "amber" : "teal",
          note: "Heuristic based on forecast rainfall total",
        },
        {
          label: "High wind indicator",
          value: level(windScore),
          score: windScore,
          icon: Wind,
          tone: windScore >= 70 ? "red" : windScore >= 40 ? "amber" : "teal",
          note: `Forecast maximum wind: ${Math.round(weather.wind)} km/h`,
        },
        {
          label: "Heat indicator",
          value: level(heatScore),
          score: heatScore,
          icon: ThermometerSun,
          tone: heatScore >= 70 ? "red" : heatScore >= 40 ? "amber" : "blue",
          note: `Current temperature: ${Math.round(weather.temperature * 10) / 10}°C`,
        },
      ]
    : [];
  const overallScore = weather
    ? Math.max(floodScore, rainScore, windScore, heatScore)
    : null;
  const overallLevel =
    overallScore === null
      ? "Unavailable"
      : overallScore >= 70
        ? "High"
        : overallScore >= 40
          ? "Moderate"
          : overallScore >= 20
            ? "Low"
            : "Very low";
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">LIVE WEATHER MONITORING</p>
          <h1>Good morning, {userName.split(/\s+/)[0] || "there"}.</h1>
          <p className="heading-sub">
            Here&apos;s the current safety picture for{" "}
            <strong>
              {location.name}, {location.admin}.
            </strong>
          </p>
          <form className="location-search" onSubmit={changeLocation}>
            <input
              aria-label="Search city"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder="Search city (e.g. Mumbai)"
            />
            <button
              className="outline-btn"
              type="submit"
              disabled={searchingLocation}
            >
              {searchingLocation ? "Searching…" : "Monitor city"}
            </button>
          </form>
          {locationMessage && (
            <p className="location-message" role="status">
              {locationMessage}
            </p>
          )}
        </div>
        <button
          className="outline-btn"
          onClick={() => onNavigate("/locations")}
        >
          <Navigation /> Saved locations
        </button>
      </div>
      <div className="connection-banner">
        <div className="banner-icon">
          <Activity />
        </div>
        <div>
          <strong>
            {weatherState === "live"
              ? `Live weather connected · ${location.name}, ${location.admin}`
              : weatherState === "loading"
                ? "Connecting to live weather…"
                : "Live weather temporarily unavailable"}
          </strong>
          <p>
            {weatherState === "live"
              ? `Current temperature ${weather?.temperature}°C, humidity ${weather?.humidity}%, conditions: ${weather?.description}. Weather risk indicators are simple estimates, not a validated prediction model. Official warnings are shown separately when the NDMA SACHET feed is reachable.`
              : "Weather is fetched from Open-Meteo. Risk indicators are estimates; official alerts require a reachable government feed."}
          </p>
        </div>
        <button onClick={() => onNavigate("/settings")}>
          View integrations <ArrowUpRight />
        </button>
      </div>
      <section className="stat-grid">
        <StatCard
          icon={Gauge}
          label="Weather risk indicator"
          value={overallLevel}
          detail={
            weather ? "Heuristic · forecast based" : "Waiting for live weather"
          }
          tone={
            overallScore !== null && overallScore >= 70
              ? "red"
              : overallScore !== null && overallScore >= 40
                ? "amber"
                : "teal"
          }
        />
        <StatCard
          icon={Bell}
          label="Official alerts"
          value={
            alertsFeedState === "loading" ? "…" : String(officialAlerts.length)
          }
          detail={
            alertsFeedState === "live"
              ? "NDMA SACHET feed"
              : alertsFeedState === "error"
                ? "Feed unavailable"
                : "Loading official feed"
          }
          tone={alertsFeedState === "error" ? "amber" : "red"}
        />
        <StatCard
          icon={CloudRain}
          label="Forecast rainfall"
          value={rainText}
          detail={weather ? "Next 24 hours · live forecast" : "Next 24 hours"}
          tone="blue"
        />
        <StatCard
          icon={Wind}
          label="Max wind speed"
          value={windText}
          detail={weather ? "Today · live forecast" : "Live forecast"}
          tone="teal"
        />
      </section>
      <div className="content-grid">
        <section className="panel risk-panel">
          <div className="panel-header">
            <div>
              <h2>Risk overview</h2>
              <p>
                {weather
                  ? "Weather-based heuristic indicators · not an official warning"
                  : "Waiting for weather data"}
              </p>
            </div>
            <button
              className="text-btn"
              onClick={() => onNavigate("/predictions")}
            >
              View analysis <ArrowUpRight />
            </button>
          </div>
          <div className="risk-list">
            {dynamicRisks.length ? (
              dynamicRisks.map((risk) => {
                const Icon = risk.icon;
                return (
                  <div className="risk-row" key={risk.label}>
                    <div className={`risk-symbol ${risk.tone}`}>
                      <Icon />
                    </div>
                    <div className="risk-name">
                      <strong>{risk.label}</strong>
                      <span>{risk.note}</span>
                    </div>
                    <div className="risk-meter">
                      <div>
                        <span
                          style={{ width: `${risk.score}%` }}
                          className={risk.tone}
                        />
                      </div>
                      <small>{risk.score}/100</small>
                    </div>
                    <RiskBadge tone={risk.tone}>{risk.value}</RiskBadge>
                  </div>
                );
              })
            ) : (
              <p className="location-message">
                Risk estimates will appear when live weather data is available.
              </p>
            )}
          </div>
        </section>
        <section className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <h2>
                Official alerts{" "}
                <span className="count-badge">{officialAlerts.length}</span>
              </h2>
              <p>
                {alertsFeedState === "live"
                  ? "NDMA SACHET · India CAP RSS"
                  : alertsFeedState === "loading"
                    ? "Connecting to official feed…"
                    : "Official feed unavailable · check source directly"}
              </p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("/alerts")}>
              View all <ArrowUpRight />
            </button>
          </div>
          {officialAlerts.length ? (
            <div className="alert-list">
              {officialAlerts.slice(0, 3).map((alert) => (
                <a
                  className="alert-row"
                  key={alert.id}
                  href={alert.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div className="alert-severity amber">
                    <AlertTriangle />
                  </div>
                  <div className="alert-copy">
                    <strong>
                      {alert.titleEnglish ||
                        "English translation unavailable — open the official alert."}
                    </strong>
                    {}
                    <small>
                      {alert.areaMatch
                        ? "Selected area mentioned · "
                        : "Area not confirmed · "}
                      {alert.source}
                      {alert.pubDate ? ` · ${alert.pubDate}` : ""}
                    </small>
                  </div>
                  <RiskBadge tone="amber">Official feed</RiskBadge>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ padding: 14 }}>
              <p>
                {alertsFeedState === "loading"
                  ? "Loading current government warnings…"
                  : alertsFeedState === "error"
                    ? "Could not load official alerts right now. This does not mean there is no danger."
                    : "The official feed returned no current alert items."}
              </p>
              <a
                href="https://sachet.ndma.gov.in/"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent,#62c5b4)" }}
              >
                Check NDMA SACHET directly ↗
              </a>
            </div>
          )}
        </section>
      </div>
      <div className="content-grid lower-grid">
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>Forecast outlook</h2>
              <p>
                Next 24 hours · {location.name}, {location.admin}
              </p>
            </div>
            <div className="chart-legend">
              <span>
                <i className="blue-line" /> Rainfall
              </span>
              <span>
                <i className="teal-line" /> Temperature
              </span>
            </div>
          </div>
          <div className="chart-wrap">
            {forecastData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3984F5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3984F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#20344a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8292a7", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8292a7", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#15263a",
                      border: "1px solid #28415c",
                      borderRadius: 10,
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rain"
                    name="Rainfall (mm)"
                    stroke="#3984F5"
                    fill="url(#rainFill)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name="Temperature (°C)"
                    stroke="#14b8a6"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="location-message">
                Live hourly forecast unavailable. Check your internet
                connection.
              </p>
            )}
          </div>
        </section>
        <section className="panel map-panel">
          <div className="panel-header">
            <div>
              <h2>Risk map</h2>
              <p>Selected area overview</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("/map")}>
              Open map <ArrowUpRight />
            </button>
          </div>
          <MapPreview location={location} onNavigate={onNavigate} />
        </section>
      </div>
      <section className="panel actions-panel">
        <div className="panel-header">
          <div>
            <h2>Recommended next steps</h2>
            <p>Simple actions to stay prepared</p>
          </div>
        </div>
        <div className="action-cards">
          <button onClick={() => onNavigate("/preparedness")}>
            <div className="action-icon blue">
              <BookOpen />
            </div>
            <div>
              <strong>Review your emergency kit</strong>
              <span>Check essentials before rainfall peaks.</span>
            </div>
            <ArrowUpRight />
          </button>
          <button onClick={() => onNavigate("/locations")}>
            <div className="action-icon teal">
              <Home />
            </div>
            <div>
              <strong>Verify your safe location</strong>
              <span>Save a nearby shelter or meeting point.</span>
            </div>
            <ArrowUpRight />
          </button>
          <button onClick={() => onNavigate("/alerts")}>
            <div className="action-icon amber">
              <Bell />
            </div>
            <div>
              <strong>Update alert preferences</strong>
              <span>Choose how you receive critical updates.</span>
            </div>
            <ArrowUpRight />
          </button>
        </div>
      </section>
    </>
  );
}

function OfficialAlertsPage({
  location,
}: {
  location: { name: string; admin: string };
}) {
  const [data, setData] = useState<{
    ok: boolean;
    source: string;
    sourceUrl: string;
    fetchedAt?: string;
    error?: string;
    language?: string;
    alerts: {
      id: string;
      title: string;
      description: string;
      titleEnglish?: string;
      descriptionEnglish?: string;
      link: string;
      pubDate: string;
      source: string;
      areaMatch?: boolean;
      areaMatchNote?: string;
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/alerts?city=${encodeURIComponent(location.name)}&region=${encodeURIComponent(location.admin)}`,
        { cache: "no-store" },
      );
      const result = await response.json();
      setData(result);
    } catch {
      setData({
        ok: false,
        source: "NDMA SACHET · India CAP RSS",
        sourceUrl:
          "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml",
        error:
          "Could not connect to the alert service. Check your internet connection and try again.",
        alerts: [],
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void loadAlerts();
  }, [location.name, location.admin]);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OFFICIAL WARNING FEED</p>
          <h1>Alerts &amp; Notifications</h1>
          <p className="heading-sub">
            Government disaster alerts <span className="separator">·</span>{" "}
            {location.name}, {location.admin}
          </p>
        </div>
        <a
          className="outline-btn"
          href="https://sachet.ndma.gov.in/"
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Open SACHET <ArrowUpRight size={16} />
        </a>
      </div>
      <section className="panel route-panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 6px" }}>
              Official alerts from NDMA SACHET
            </h2>
            <p style={{ margin: 0, color: "var(--muted,#9aa6b2)" }}>
              English only · India-wide feed; region matching is not
              geospatially verified
            </p>
          </div>
          <button
            className="primary-btn"
            onClick={() => void loadAlerts()}
            disabled={loading}
          >
            {loading ? "Checking…" : "Refresh alerts"} <Activity size={16} />
          </button>
        </div>
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: "rgba(30, 160, 120, 0.08)",
            border: "1px solid rgba(30,160,120,.25)",
            marginBottom: 18,
          }}
        >
          <strong style={{ display: "block", marginBottom: 4 }}>
            {loading
              ? "Connecting to official alert feed…"
              : data?.ok
                ? `Feed connected · ${data.alerts.length} alert${data.alerts.length === 1 ? "" : "s"} received`
                : "Official feed currently unavailable"}
          </strong>
          <span style={{ fontSize: 13, opacity: 0.85 }}>
            {data?.fetchedAt
              ? `Last checked: ${new Date(data.fetchedAt).toLocaleString()}`
              : data?.error || "Checking NDMA SACHET RSS feed."}
          </span>
        </div>
        {!loading && data?.ok && data.alerts.length === 0 && (
          <div className="empty-workspace" style={{ padding: "24px 12px" }}>
            <div className="empty-icon">
              <CheckCircle2 />
            </div>
            <h2>No alerts returned by the feed</h2>
            <p>
              The official feed responded but contained no alert items at this
              time. Open SACHET to verify current warnings.
            </p>
          </div>
        )}
        {!loading && (!data?.ok || !data?.alerts.length) && (
          <div
            style={{
              padding: 16,
              border: "1px solid var(--border,rgba(255,255,255,.12))",
              borderRadius: 12,
              marginBottom: 14,
            }}
          >
            <p style={{ marginTop: 0 }}>
              {data?.error || "No current alert items were returned."}
            </p>
            <p style={{ fontSize: 13, opacity: 0.8 }}>
              This does not mean there is no danger. Use the official portal for
              the latest warnings.
            </p>
            <a
              href="https://sachet.ndma.gov.in/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent,#62c5b4)" }}
            >
              View official NDMA SACHET alerts ↗
            </a>
          </div>
        )}
        {data?.ok && data.alerts.length > 0 && (
          <div className="alert-list">
            {data.alerts.map((alert) => (
              <article
                key={alert.id}
                className="alert-row"
                style={{
                  cursor: "default",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div className="alert-severity amber">
                  <AlertTriangle />
                </div>
                <div className="alert-copy" style={{ flex: 1, minWidth: 0 }}>
                  <strong>
                    {alert.titleEnglish ||
                      "English translation unavailable — open the official alert."}
                  </strong>
                  {alert.description && (
                    <span
                      style={{
                        whiteSpace: "normal",
                        display: "block",
                        marginTop: 6,
                      }}
                    >
                      {alert.descriptionEnglish ||
                        "English translation unavailable — open the official alert."}
                    </span>
                  )}
                  <small>
                    {alert.areaMatch
                      ? "Selected region mentioned in alert text"
                      : "Selected region not confirmed"}{" "}
                    · {alert.source}
                    {alert.pubDate ? ` · ${alert.pubDate}` : ""}
                  </small>
                  <a
                    href={alert.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      color: "var(--accent,#62c5b4)",
                    }}
                  >
                    Read official alert ↗
                  </a>
                </div>
                <RiskBadge tone="amber">Official feed</RiskBadge>
              </article>
            ))}
          </div>
        )}
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 18 }}>
          Source:{" "}
          <a
            href={data?.sourceUrl || "https://sachet.ndma.gov.in/"}
            target="_blank"
            rel="noreferrer"
          >
            NDMA SACHET India CAP RSS
          </a>
          . DisasterShield does not independently verify the feed or guarantee
          delivery of emergency notifications.
        </p>
      </section>
    </>
  );
}

function GenericPage({
  path,
  onNavigate,
  location,
  setLocation,
}: {
  path: string;
  onNavigate: (path: string) => void;
  location: {
    name: string;
    admin: string;
    latitude: number;
    longitude: number;
  };
  setLocation: (location: {
    name: string;
    admin: string;
    latitude: number;
    longitude: number;
  }) => void;
}) {
  const item = navItems.find((n) => n.path === path);
  const title = item?.label || "Workspace";
  const Icon = item?.icon || Shield;
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [reportType, setReportType] = useState("Flooding / waterlogging");
  const [reportDetails, setReportDetails] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    units: "metric",
    refresh: "15",
    notifications: true,
  });
  useEffect(() => {
    try {
      setReports(
        JSON.parse(localStorage.getItem("ds-community-reports") || "[]"),
      );
      setSavedLocations(
        JSON.parse(localStorage.getItem("ds-saved-locations") || "[]"),
      );
      setChecklist(
        JSON.parse(localStorage.getItem("ds-preparedness-checklist") || "[]"),
      );
      setSettings(
        JSON.parse(
          localStorage.getItem("ds-settings") ||
            '{"units":"metric","refresh":"15","notifications":true}',
        ),
      );
    } catch {}
  }, []);
  async function loadWeather() {
    setWeatherLoading(true);
    setNotice("");
    try {
      const r = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=precipitation,temperature_2m&daily=precipitation_sum,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=3`,
      );
      if (!r.ok) throw new Error();
      const d = await r.json();
      setWeather(d);
      setNotice("Live forecast loaded from Open-Meteo.");
    } catch {
      setNotice(
        "Weather service unavailable. Check your internet connection and retry.",
      );
    } finally {
      setWeatherLoading(false);
    }
  }
  useEffect(() => {
    if (path === "/weather" || path === "/predictions") void loadWeather();
  }, [path, location.latitude, location.longitude]);
  function submitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportDetails.trim()) {
      setNotice("Please describe the issue first.");
      return;
    }
    const next = [
      {
        id: Date.now(),
        type: reportType,
        details: reportDetails.trim(),
        location: `${location.name}, ${location.admin}`,
        createdAt: new Date().toISOString(),
        status: "Saved on this device",
      },
      ...reports,
    ];
    setReports(next);
    localStorage.setItem("ds-community-reports", JSON.stringify(next));
    setReportDetails("");
    setNotice(
      "Report saved on this browser. It has NOT been sent to authorities.",
    );
  }
  function saveLocation(e: React.FormEvent) {
    e.preventDefault();
    const next = [
      {
        name: location.name,
        admin: location.admin,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      ...savedLocations.filter(
        (x: any) => x.name !== location.name || x.admin !== location.admin,
      ),
    ];
    setSavedLocations(next);
    localStorage.setItem("ds-saved-locations", JSON.stringify(next));
    setNotice("Location saved on this browser.");
  }
  function updateSettings(next: any) {
    setSettings(next);
    localStorage.setItem("ds-settings", JSON.stringify(next));
    setNotice("Preferences saved on this browser.");
  }
  const card: React.CSSProperties = {
    border: "1px solid var(--border,rgba(255,255,255,.12))",
    borderRadius: 14,
    padding: 18,
    background: "rgba(255,255,255,.025)",
    minWidth: 0,
  };
  const action: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid var(--border,rgba(255,255,255,.15))",
    borderRadius: 10,
    padding: "10px 13px",
    background: "rgba(50,130,230,.14)",
    color: "inherit",
    cursor: "pointer",
    textDecoration: "none",
  };
  const field: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 9,
    border: "1px solid var(--border,rgba(255,255,255,.16))",
    background: "rgba(0,0,0,.12)",
    color: "inherit",
  };
  const sectionTitle = (t: string, d: string) => (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: "0 0 6px" }}>{t}</h2>
      <p style={{ margin: 0, opacity: 0.72, fontSize: 14 }}>{d}</p>
    </div>
  );
  let content: React.ReactNode;
  if (path === "/map")
    content = (
      <>
        <div style={card}>
          {sectionTitle(
            "Live area map",
            "Map view centered on your selected location. Risk overlays are not supplied by this base map.",
          )}
          <iframe
            title="OpenStreetMap selected area"
            width="100%"
            height="430"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.22}%2C${location.latitude - 0.16}%2C${location.longitude + 0.22}%2C${location.latitude + 0.16}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
          />
          <p style={{ fontSize: 12, opacity: 0.7 }}>
            Base map © OpenStreetMap contributors. This is not a live
            hazard/radar layer.
          </p>
          <a
            style={action}
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=11/${location.latitude}/${location.longitude}`}
          >
            Open full map <ArrowUpRight size={16} />
          </a>
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          <strong>Official warnings</strong>
          <p style={{ opacity: 0.75 }}>
            Use the government feed for verified warnings; location relevance
            must be checked against each alert.
          </p>
          <button style={action} onClick={() => onNavigate("/alerts")}>
            Open alerts <Bell size={16} />
          </button>
        </div>
      </>
    );
  else if (path === "/weather")
    content = (
      <>
        <div style={card}>
          {sectionTitle(
            "Live weather forecast",
            `Open-Meteo forecast for ${location.name}, ${location.admin}.`,
          )}
          <button
            style={action}
            onClick={() => void loadWeather()}
            disabled={weatherLoading}
          >
            {weatherLoading ? "Refreshing…" : "Refresh forecast"}{" "}
            <Activity size={16} />
          </button>
          {weather?.current ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                gap: 12,
                marginTop: 18,
              }}
            >
              {[
                ["Temperature", `${weather.current.temperature_2m} °C`],
                ["Humidity", `${weather.current.relative_humidity_2m}%`],
                ["Precipitation", `${weather.current.precipitation} mm`],
                ["Wind", `${weather.current.wind_speed_10m} km/h`],
              ].map(([a, b]) => (
                <div key={a} style={card}>
                  <span style={{ opacity: 0.7 }}>{a}</span>
                  <h2 style={{ margin: "8px 0 0" }}>{b}</h2>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 18, opacity: 0.75 }}>
              {weatherLoading
                ? "Loading current conditions…"
                : "No weather data loaded yet."}
            </p>
          )}
          {weather?.daily?.time && (
            <div style={{ overflowX: "auto", marginTop: 18 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Date", "Rain total", "Max wind"].map((x) => (
                      <th
                        key={x}
                        style={{
                          textAlign: "left",
                          padding: 10,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weather.daily.time.map((day: string, i: number) => (
                    <tr key={day}>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {day}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {weather.daily.precipitation_sum?.[i] ?? "—"} mm
                      </td>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {weather.daily.wind_speed_10m_max?.[i] ?? "—"} km/h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  else if (path === "/predictions")
    content = (
      <>
        <div style={card}>
          {sectionTitle(
            "Weather-based risk indicators",
            "Transparent heuristic indicators from current forecast data, not a trained or validated disaster prediction model.",
          )}
          {weather?.current ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  name: "Rainfall indicator",
                  score: Math.min(
                    100,
                    Math.round(
                      (weather.daily?.precipitation_sum?.[0] || 0) * 3,
                    ),
                  ),
                  desc: `Today's forecast rain: ${weather.daily?.precipitation_sum?.[0] ?? 0} mm`,
                },
                {
                  name: "Wind indicator",
                  score: Math.min(
                    100,
                    Math.round((weather.current.wind_speed_10m || 0) * 1.5),
                  ),
                  desc: `Current wind: ${weather.current.wind_speed_10m} km/h`,
                },
                {
                  name: "Heat indicator",
                  score: Math.min(
                    100,
                    Math.max(
                      0,
                      Math.round(
                        ((weather.current.temperature_2m || 0) - 28) * 5,
                      ),
                    ),
                  ),
                  desc: `Current temperature: ${weather.current.temperature_2m} °C`,
                },
              ].map((x) => (
                <div key={x.name} style={card}>
                  <strong>{x.name}</strong>
                  <h2>{x.score}/100</h2>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 8,
                      background: "rgba(255,255,255,.1)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${x.score}%`,
                        background:
                          x.score >= 70
                            ? "#ef6262"
                            : x.score >= 40
                              ? "#e6b35c"
                              : "#3dbba0",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 13, opacity: 0.7 }}>{x.desc}</p>
                  <small>
                    {x.score >= 70
                      ? "High indicator"
                      : x.score >= 40
                        ? "Moderate indicator"
                        : "Lower indicator"}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading weather data for risk indicators…</p>
          )}
          <p style={{ marginTop: 18, fontSize: 13, opacity: 0.75 }}>
            Do not use these scores alone to make evacuation or emergency
            decisions. Check official warnings.
          </p>
          <button style={action} onClick={() => onNavigate("/alerts")}>
            Check official warnings <Bell size={16} />
          </button>
        </div>
      </>
    );
  else if (path === "/assistant")
    content = (
      <div style={{ ...card, maxWidth: 900, margin: "auto" }}>
        {sectionTitle(
          "Disaster preparedness assistant",
          "Rule-based guidance for common preparedness questions. It is not an emergency dispatcher or medical service.",
        )}
        <div className="suggestions" style={{ marginBottom: 16 }}>
          {[
            "What should I do during heavy rainfall?",
            "How can I prepare an emergency kit?",
            "What should I do if flooding starts?",
            "How do I find an official shelter?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuestion(q);
                setAnswer(
                  q.toLowerCase().includes("rain") ||
                    q.toLowerCase().includes("flood")
                    ? "Move away from flooded roads and drains. Go to higher ground if water is rising, switch off electricity only if safe, and follow official local instructions. Never walk or drive through floodwater."
                    : q.toLowerCase().includes("kit")
                      ? "Keep drinking water, essential medicines, first-aid supplies, torch, batteries/power bank, radio, copies of important documents, cash, masks and basic food in a waterproof bag."
                      : "Check local government/NDMA instructions and contact your district disaster management authority. Do not rely on unverified shelter listings.",
                );
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = question.toLowerCase();
            setAnswer(
              q.includes("rain") || q.includes("flood")
                ? "During heavy rain or flooding, stay indoors away from windows if safe, avoid flooded roads, move to higher ground if water rises, and follow official warnings. Call local emergency services if in immediate danger."
                : q.includes("kit")
                  ? "Prepare water, non-perishable food, medicines, first-aid kit, flashlight, power bank, radio, documents, cash and hygiene supplies."
                  : q.includes("shelter")
                    ? "Use verified local government or district disaster management sources to confirm a shelter is open and accessible. This workspace does not maintain a verified shelter directory."
                    : "I can provide general preparedness guidance. For immediate danger, contact local emergency services and follow official instructions.",
            );
          }}
        >
          <label htmlFor="assistant-question">Ask a question</label>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              id="assistant-question"
              style={field}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about flood safety, emergency kits…"
            />
            <button className="primary-btn" type="submit">
              <ArrowUpRight />
            </button>
          </div>
        </form>
        {answer && (
          <div className="chat-bubble assistant" style={{ marginTop: 16 }}>
            {answer}
          </div>
        )}
      </div>
    );
  else if (path === "/emergency")
    content = (
      <>
        <div style={{ ...card, borderColor: "rgba(239,98,98,.4)" }}>
          {sectionTitle(
            "Emergency & SOS",
            "If you are in immediate danger in India, call 112. This page does not send your GPS location or dispatch responders automatically.",
          )}
          <a
            style={{
              ...action,
              background: "#a62d3b",
              color: "#fff",
              border: 0,
              fontSize: 18,
            }}
            href="tel:112"
          >
            <Phone size={20} /> Call India emergency number 112
          </a>
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 14 }}>
            If calling is unsafe, contact a trusted person and move to a safer
            location if possible.
          </p>
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          {sectionTitle(
            "Share your location",
            "Copy the selected monitoring location into a message to a trusted contact.",
          )}
          <button
            style={action}
            onClick={() => {
              void navigator.clipboard?.writeText(
                `I may need help. My selected location is ${location.name}, ${location.admin}. Please contact me.`,
              );
              setNotice(
                "Location message copied if clipboard permission is available.",
              );
            }}
          >
            <Navigation size={16} /> Copy location message
          </button>
        </div>
      </>
    );
  else if (path === "/shelters")
    content = (
      <>
        <div style={card}>
          {sectionTitle(
            "Shelters & safe zones",
            `Search for shelters near ${location.name}. Results below are map searches, not a verified shelter database.`,
          )}
          <a
            style={action}
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/emergency+shelter+near+${encodeURIComponent(location.name + ", " + location.admin)}`}
          >
            Search nearby shelters <ArrowUpRight size={16} />
          </a>
          <a
            style={{ ...action, marginLeft: 8 }}
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=12/${location.latitude}/${location.longitude}`}
          >
            Open local map <Map size={16} />
          </a>
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 16 }}>
            Before travelling, call the facility or local authorities to verify
            it is open, accessible, and designated as a shelter.
          </p>
        </div>
      </>
    );
  else if (path === "/reports")
    content = (
      <>
        <div style={card}>
          {sectionTitle(
            "Community reports",
            "Create a community report. Reports are saved in this browser only; they are not transmitted to government agencies.",
          )}
          <form onSubmit={submitReport} style={{ display: "grid", gap: 12 }}>
            <label>
              Report type
              <select
                style={field}
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                {[
                  "Flooding / waterlogging",
                  "Road blocked",
                  "Landslide",
                  "Fallen tree",
                  "Damaged infrastructure",
                  "Other hazard",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Details
              <textarea
                style={{ ...field, minHeight: 100 }}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe what you observed. Avoid sharing private information."
              />
            </label>
            <button className="primary-btn" type="submit">
              Save report <Plus size={16} />
            </button>
          </form>
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          {sectionTitle(
            `Saved reports (${reports.length})`,
            "Reports stored on this device",
          )}{" "}
          {reports.length === 0 ? (
            <p>No reports submitted yet.</p>
          ) : (
            reports.map((r: any) => (
              <div
                key={r.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <strong>{r.type}</strong>
                <p style={{ margin: "6px 0" }}>{r.details}</p>
                <small>
                  {r.location} · {new Date(r.createdAt).toLocaleString()} ·{" "}
                  {r.status}
                </small>
              </div>
            ))
          )}
        </div>
      </>
    );
  else if (path === "/preparedness")
    content = (
      <div style={card}>
        {sectionTitle(
          "Preparedness center",
          "Tick off these general preparedness tasks. Progress is saved in this browser.",
        )}
        <div style={{ display: "grid", gap: 12 }}>
          {[
            "Store drinking water and ready-to-eat food",
            "Pack first-aid kit and essential medicines",
            "Charge phones and power banks",
            "Keep torch, batteries and radio ready",
            "Save emergency contacts and documents",
            "Know higher ground and evacuation routes",
            "Check official weather and disaster alerts",
          ].map((x) => (
            <label
              key={x}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}
            >
              <input
                type="checkbox"
                checked={checklist.includes(x)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...checklist, x]
                    : checklist.filter((y) => y !== x);
                  setChecklist(next);
                  localStorage.setItem(
                    "ds-preparedness-checklist",
                    JSON.stringify(next),
                  );
                }}
              />
              {x}
            </label>
          ))}
        </div>
        <p style={{ marginTop: 14, opacity: 0.7 }}>
          {checklist.length} of 7 tasks complete
        </p>
      </div>
    );
  else if (path === "/locations")
    content = (
      <>
        <div style={card}>
          {sectionTitle(
            "My locations",
            "Save the currently selected monitoring location on this browser.",
          )}
          <p>
            <strong>Current:</strong> {location.name}, {location.admin}
          </p>
          <button style={action} onClick={saveLocation}>
            <Plus size={16} /> Save current location
          </button>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!query.trim()) return;
              try {
                const r = await fetch(
                  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
                );
                const d = await r.json();
                const x = d.results?.[0];
                if (!x) {
                  setNotice("Location not found.");
                  return;
                }
                setLocation({
                  name: x.name,
                  admin: x.admin1 || x.country || "Selected area",
                  latitude: x.latitude,
                  longitude: x.longitude,
                });
                setQuery("");
                setNotice(`Monitoring location changed to ${x.name}.`);
              } catch {
                setNotice("Location search failed. Check internet and retry.");
              }
            }}
            style={{ display: "flex", gap: 8, marginTop: 16 }}
          >
            <input
              style={field}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, e.g. Mumbai"
            />
            <button className="primary-btn" type="submit">
              <Search size={16} /> Search
            </button>
          </form>
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          {sectionTitle(
            `Saved locations (${savedLocations.length})`,
            "Select a saved location to monitor it.",
          )}{" "}
          {savedLocations.length === 0 ? (
            <p>No saved locations yet.</p>
          ) : (
            savedLocations.map((x: any) => (
              <div
                key={`${x.name}-${x.admin}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <strong>{x.name}</strong>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>{x.admin}</div>
                </div>
                <button
                  style={action}
                  onClick={() => {
                    setLocation(x);
                    setNotice(`Monitoring ${x.name}.`);
                  }}
                >
                  Monitor
                </button>
              </div>
            ))
          )}
        </div>
      </>
    );
  else if (path === "/settings")
    content = (
      <div style={card}>
        {sectionTitle(
          "Settings",
          "Preferences are saved in this browser. Account access is local to this device; push delivery is not configured.",
        )}
        <div style={{ display: "grid", gap: 16, maxWidth: 560 }}>
          <label>
            Measurement units
            <select
              style={field}
              value={settings.units}
              onChange={(e) =>
                updateSettings({ ...settings, units: e.target.value })
              }
            >
              <option value="metric">Metric (°C, km/h, mm)</option>
              <option value="imperial">Imperial (°F, mph, inches)</option>
            </select>
          </label>
          <label>
            Refresh interval
            <select
              style={field}
              value={settings.refresh}
              onChange={(e) =>
                updateSettings({ ...settings, refresh: e.target.value })
              }
            >
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
            </select>
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                updateSettings({ ...settings, notifications: e.target.checked })
              }
            />{" "}
            Enable in-app notification preference
          </label>
          <button style={action} onClick={() => onNavigate("/alerts")}>
            Open official alerts <Bell size={16} />
          </button>
        </div>
      </div>
    );
  else
    content = (
      <div style={card}>
        {sectionTitle(title, "Workspace overview")}
        <p>Use the navigation to open the working modules.</p>
        <button style={action} onClick={() => onNavigate("/dashboard")}>
          Back to overview
        </button>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DISASTERSHIELD WORKSPACE</p>
          <h1>{title}</h1>
          <p className="heading-sub">
            {location.name}, {location.admin}{" "}
            <span className="separator">·</span>{" "}
            <span>
              Live data where connected · Personal settings saved on this device
            </span>
          </p>
        </div>
      </div>
      {notice && (
        <div
          style={{
            padding: 12,
            marginBottom: 14,
            borderRadius: 10,
            border: "1px solid rgba(80,160,130,.4)",
            background: "rgba(30,160,120,.08)",
          }}
        >
          {notice}
        </div>
      )}
      <section className="panel route-panel">{content}</section>
    </>
  );
}
type BrowserAccount = {
  email: string;
  name: string;
  salt: string;
  passwordHash: string;
};

function loadBrowserAccounts(): BrowserAccount[] {
  try {
    const stored = JSON.parse(localStorage.getItem("ds-accounts") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(salt.match(/.{2}/g) || [], (byte) =>
        Number.parseInt(byte, 16),
      ),
      iterations: 120_000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function Login({
  initialMode,
  onLogin,
  onModeChange,
}: {
  initialMode: "login" | "register";
  onLogin: (name: string) => void;
  onModeChange: (mode: "login" | "register") => void;
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const accounts = loadBrowserAccounts();
      if (mode === "register") {
        if (password !== confirmPassword) {
          setMessage("Your passwords do not match.");
          return;
        }
        if (accounts.some((account) => account.email === normalizedEmail)) {
          setMessage("An account with this email already exists. Sign in instead.");
          return;
        }
        const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join("");
        const account = {
          email: normalizedEmail,
          name: name.trim(),
          salt,
          passwordHash: await hashPassword(password, salt),
        };
        localStorage.setItem("ds-accounts", JSON.stringify([...accounts, account]));
        localStorage.setItem("ds-session", normalizedEmail);
        onLogin(account.name);
        return;
      }

      const account = accounts.find((item) => item.email === normalizedEmail);
      if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
        setMessage("Email or password is incorrect.");
        return;
      }
      localStorage.setItem("ds-session", account.email);
      onLogin(account.name);
    } catch {
      setMessage("Could not save your account in this browser. Check storage permissions and try again.");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setMessage("");
    onModeChange(nextMode);
  }

  return (
    <main className="login-page">
      <div className="login-visual">
        <div className="login-brand">
          <div className="brand-mark">
            <Shield />
          </div>
          <strong>
            DisasterShield <span>AI</span>
          </strong>
        </div>
        <div className="radar-art">
          <div className="radar-globe">
            <div className="globe-grid" />
            <div className="globe-continent continent-a" />
            <div className="globe-continent continent-b" />
          </div>
          <div className="radar-ring ring-a" />
          <div className="radar-ring ring-b" />
          <div className="radar-ring ring-c" />
          <div className="radar-sweep" />
          <div className="radar-point point-a" />
          <div className="radar-point point-b" />
          <div className="radar-caption caption-a">WEATHER NETWORK <span>CONNECTED</span></div>
          <div className="radar-caption caption-b">EARLY WARNING <span>24 HOUR OUTLOOK</span></div>
        </div>
        <div className="login-quote">
          <p>Know sooner. Act with confidence.</p>
          <span>WEATHER · OFFICIAL ALERTS · PREPAREDNESS</span>
        </div>
      </div>
      <div className="login-card">
        <div className="mobile-login-logo">
          <div className="brand-mark">
            <Shield />
          </div>
          <strong>
            DisasterShield <span>AI</span>
          </strong>
        </div>
        <div className="login-copy">
          <span className="eyebrow">{mode === "register" ? "CREATE YOUR ACCOUNT" : "DISASTERSHIELD WORKSPACE"}</span>
          <h1>{mode === "register" ? "Build your safety network." : "Stay ahead of risk."}</h1>
          <p>
            {mode === "register"
              ? "Create a personal workspace for local weather, official alerts, and preparedness."
              : "Sign in to monitor your locations and access preparedness guidance."}
          </p>
        </div>
        <form className="login-form" onSubmit={submit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          {mode === "register" && (
            <label>
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
              />
            </label>
          )}
          {message && <p className="auth-message" role="alert">{message}</p>}
          <button className="primary-btn full" type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
            <ArrowUpRight />
          </button>
          <p className="auth-storage-note">
            Accounts and sessions are stored in this browser only. This workspace is not connected to a secure account server.
          </p>
          <p className="auth-switch">
            {mode === "register" ? "Already have an account?" : "New to DisasterShield?"}{" "}
            <button
              className="text-btn"
              type="button"
              onClick={() => switchMode(mode === "register" ? "login" : "register")}
            >
              {mode === "register" ? "Sign in" : "Create account"}
            </button>
          </p>
        </form>
        <p className="login-legal">
          Your saved locations, reports, and preferences stay on this device.
        </p>
      </div>
    </main>
  );
}

export default function Page() {
  const [path, setPath] = useState("/login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState({
    name: "Mumbai",
    admin: "Maharashtra",
    latitude: 19.076,
    longitude: 72.8777,
  });
  useEffect(() => {
    const sessionEmail = localStorage.getItem("ds-session");
    const account = loadBrowserAccounts().find(
      (item) => item.email === sessionEmail,
    );
    const requestedPath = window.location.pathname;
    if (account) {
      setLoggedIn(true);
      setUserName(account.name);
      const restoredPath = navItems.some((item) => item.path === requestedPath)
        ? requestedPath
        : "/dashboard";
      setPath(restoredPath);
      if (restoredPath !== requestedPath) {
        window.history.replaceState(null, "", restoredPath);
      }
    } else {
      setLoggedIn(false);
      const authPath = requestedPath === "/register" ? "/register" : "/login";
      setPath(authPath);
      if (authPath !== requestedPath) {
        window.history.replaceState(null, "", authPath);
      }
    }
    setAuthReady(true);

    function restoreFromHistory() {
      const currentEmail = localStorage.getItem("ds-session");
      const currentAccount = loadBrowserAccounts().find(
        (item) => item.email === currentEmail,
      );
      const currentPath = window.location.pathname;
      if (!currentAccount) {
        setLoggedIn(false);
        setPath(currentPath === "/register" ? "/register" : "/login");
        return;
      }
      setLoggedIn(true);
      setUserName(currentAccount.name);
      setPath(
        navItems.some((item) => item.path === currentPath)
          ? currentPath
          : "/dashboard",
      );
    }
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ds-current-location") || "null");
      if (saved?.name && Number.isFinite(saved.latitude) && Number.isFinite(saved.longitude)) {
        setLocation(saved);
      }
    } catch {
      localStorage.removeItem("ds-current-location");
    }
  }, []);

  function updateLocation(next: typeof location) {
    setLocation(next);
    localStorage.setItem("ds-current-location", JSON.stringify(next));
  }

  const navigate = (next: string) => {
    if (next === "/login") {
      localStorage.removeItem("ds-session");
      setLoggedIn(false);
      setUserName("");
      setPath("/login");
      window.history.pushState(null, "", "/login");
    } else {
      setPath(next);
      setLoggedIn(true);
      window.history.pushState(null, "", next);
    }
  };
  if (!authReady) {
    return <main className="auth-loading"><div className="brand-mark"><Shield /></div></main>;
  }
  if (!loggedIn || path === "/login" || path === "/register")
    return (
      <Login
        key={path}
        initialMode={path === "/register" ? "register" : "login"}
        onModeChange={(mode) => {
          const authPath = mode === "register" ? "/register" : "/login";
          setPath(authPath);
          window.history.replaceState(null, "", authPath);
        }}
        onLogin={() => {
          setLoggedIn(true);
          const account = loadBrowserAccounts().find(
            (item) => item.email === localStorage.getItem("ds-session"),
          );
          setUserName(account?.name || "Community member");
          setPath("/dashboard");
          window.history.pushState(null, "", "/dashboard");
        }}
      />
    );
  return (
    <div className="app-shell">
      <Sidebar
        path={path}
        onNavigate={navigate}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locationLabel={`${location.name}, ${location.admin}`}
      />
      <div className="main-area">
        <Header
          onMenu={() => setMenuOpen(true)}
          onNavigate={navigate}
          path={path}
          userName={userName}
        />
        <main className="workspace">
          {path === "/dashboard" ? (
            <Dashboard
              onNavigate={navigate}
              location={location}
              setLocation={updateLocation}
              userName={userName}
            />
          ) : path === "/alerts" ? (
            <OfficialAlertsPage location={location} />
          ) : (
            <GenericPage
              path={path}
              onNavigate={navigate}
              location={location}
              setLocation={updateLocation}
            />
          )}
        </main>
      </div>
    </div>
  );
}

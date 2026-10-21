import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameIt: string;
  color: string;
  radius: number; // display radius in px
  orbitRadius: number; // display orbit radius in px
  distanceFromSun: string; // actual distance
  diameter: string; // actual diameter
  orbitalPeriod: string; // actual orbital period
  speed: number; // orbital speed factor
  angle: number; // current angle
  description: string;
}

const planetsData: PlanetData[] = [
  {
    name: 'Mercury',
    nameIt: 'Mercurio',
    color: '#b5b5b5',
    radius: 4,
    orbitRadius: 60,
    distanceFromSun: '57.9 milioni km',
    diameter: '4.879 km',
    orbitalPeriod: '88 giorni',
    speed: 4.15,
    angle: 0,
    description: 'Il pianeta più piccolo e più vicino al Sole.',
  },
  {
    name: 'Venus',
    nameIt: 'Venere',
    color: '#e8cda0',
    radius: 7,
    orbitRadius: 95,
    distanceFromSun: '108.2 milioni km',
    diameter: '12.104 km',
    orbitalPeriod: '225 giorni',
    speed: 1.62,
    angle: Math.PI / 4,
    description: 'Il pianeta più caldo del sistema solare.',
  },
  {
    name: 'Earth',
    nameIt: 'Terra',
    color: '#4da6ff',
    radius: 7,
    orbitRadius: 130,
    distanceFromSun: '149.6 milioni km',
    diameter: '12.756 km',
    orbitalPeriod: '365.25 giorni',
    speed: 1.0,
    angle: Math.PI / 2,
    description: 'Il nostro pianeta, l\'unico con vita conosciuta.',
  },
  {
    name: 'Mars',
    nameIt: 'Marte',
    color: '#e05a3a',
    radius: 5,
    orbitRadius: 170,
    distanceFromSun: '227.9 milioni km',
    diameter: '6.792 km',
    orbitalPeriod: '687 giorni',
    speed: 0.53,
    angle: Math.PI,
    description: 'Il pianeta rosso, obiettivo di esplorazione umana.',
  },
  {
    name: 'Jupiter',
    nameIt: 'Giove',
    color: '#e8a954',
    radius: 16,
    orbitRadius: 230,
    distanceFromSun: '778.5 milioni km',
    diameter: '142.984 km',
    orbitalPeriod: '11.86 anni',
    speed: 0.084,
    angle: (3 * Math.PI) / 2,
    description: 'Il pianeta più grande del sistema solare.',
  },
  {
    name: 'Saturn',
    nameIt: 'Saturno',
    color: '#f0d68a',
    radius: 14,
    orbitRadius: 290,
    distanceFromSun: '1.434 miliardi km',
    diameter: '120.536 km',
    orbitalPeriod: '29.46 anni',
    speed: 0.034,
    angle: Math.PI / 6,
    description: 'Famoso per i suoi magnifici anelli.',
  },
  {
    name: 'Uranus',
    nameIt: 'Urano',
    color: '#7de8e8',
    radius: 10,
    orbitRadius: 345,
    distanceFromSun: '2.871 miliardi km',
    diameter: '51.118 km',
    orbitalPeriod: '84.01 anni',
    speed: 0.012,
    angle: (5 * Math.PI) / 4,
    description: 'Un gigante di ghiaccio che ruota su un fianco.',
  },
  {
    name: 'Neptune',
    nameIt: 'Nettuno',
    color: '#4466ff',
    radius: 9,
    orbitRadius: 395,
    distanceFromSun: '4.495 miliardi km',
    diameter: '49.528 km',
    orbitalPeriod: '164.8 anni',
    speed: 0.006,
    angle: (7 * Math.PI) / 6,
    description: 'Il pianeta più lontano dal Sole.',
  },
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<PlanetData[]>(planetsData.map(p => ({ ...p })));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const drawSolarSystem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    drawStars(ctx, width, height);

    // Draw orbit paths
    planetsRef.current.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffdd00');
    sunGradient.addColorStop(0.7, '#ff8800');
    sunGradient.addColorStop(1, '#ff4400');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 25, centerX, centerY, 55);
    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planetsRef.current.forEach((planet) => {
      const x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const y = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Planet glow
      const planetGlow = ctx.createRadialGradient(x, y, planet.radius * 0.5, x, y, planet.radius * 2);
      planetGlow.addColorStop(0, planet.color + '40');
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Planet body
      const planetGradient = ctx.createRadialGradient(x - planet.radius * 0.3, y - planet.radius * 0.3, 0, x, y, planet.radius);
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(1, planet.color);
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn rings
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius * 2, planet.radius * 0.5, Math.PI / 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#f0d68a88';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Planet name label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planet.nameIt, x, y + planet.radius + 14);
    });
  }, []);

  const starsRef = useRef<{x: number, y: number, size: number, opacity: number}[]>([]);

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
    }
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  };

  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  };

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlayingRef.current) {
      planetsRef.current.forEach((planet) => {
        planet.angle += planet.speed * speedRef.current * deltaTime * 0.001;
      });
    }

    drawSolarSystem(ctx, canvas.width, canvas.height);
    animationRef.current = requestAnimationFrame(animate);
  }, [drawSolarSystem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = []; // regenerate stars on resize
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let clicked: PlanetData | null = null;

    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 5) {
        clicked = { ...planet };
        break;
      }
    }

    setSelectedPlanet(clicked);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let hovered: string | null = null;

    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 5) {
        hovered = planet.name;
        break;
      }
    }

    setHoveredPlanet(hovered);
    if (canvas) {
      canvas.style.cursor = hovered ? 'pointer' : 'default';
    }
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☀️</span>
            <div>
              <h1 className="text-white text-xl font-bold tracking-wide">Sistema Solare Interattivo</h1>
              <p className="text-white/50 text-xs">Clicca su un pianeta per scoprire i suoi segreti</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs hidden sm:inline">Esplora il nostro sistema solare</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />

          {/* Hover tooltip */}
          {hoveredPlanet && !selectedPlanet && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="text-white text-sm">
                Clicca su <strong>{planetsData.find(p => p.name === hoveredPlanet)?.nameIt}</strong> per i dettagli
              </span>
            </div>
          )}
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900/95 to-indigo-950/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto animate-slide-in" style={{ color: 'white' }}>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-8">
              {/* Planet visual */}
              <div className="flex justify-center mb-6">
                <div
                  className="rounded-full shadow-lg animate-pulse-slow"
                  style={{
                    width: Math.max(60, selectedPlanet.radius * 5),
                    height: Math.max(60, selectedPlanet.radius * 5),
                    background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color})`,
                    boxShadow: `0 0 30px ${selectedPlanet.color}40, 0 0 60px ${selectedPlanet.color}20`,
                  }}
                />
              </div>

              {/* Planet name */}
              <h2 className="text-white text-2xl font-bold text-center mb-1">{selectedPlanet.nameIt}</h2>
              <p className="text-white/40 text-sm text-center mb-4">{selectedPlanet.name}</p>

              {/* Description */}
              <p className="text-white/70 text-sm text-center mb-6 italic">"{selectedPlanet.description}"</p>

              {/* Stats */}
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📏</span>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">Diametro</p>
                      <p className="text-white font-semibold">{selectedPlanet.diameter}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌞</span>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">Distanza dal Sole</p>
                      <p className="text-white font-semibold">{selectedPlanet.distanceFromSun}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">Periodo Orbitale</p>
                      <p className="text-white font-semibold">{selectedPlanet.orbitalPeriod}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-slate-900/90 to-indigo-950/90 backdrop-blur-sm border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition-all duration-200 border border-white/10 hover:border-white/30"
          >
            {isPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                <span className="text-sm font-medium">Pausa</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-sm font-medium">Riproduci</span>
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">Velocità:</span>
            <div className="flex gap-1">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    speed === s
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              planetsRef.current = planetsData.map(p => ({ ...p }));
              setSelectedPlanet(null);
            }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full transition-all duration-200 border border-white/10 hover:border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

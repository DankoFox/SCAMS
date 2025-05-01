import "./index.css";

interface HeroBannerProps {
  title: string;
}

export function HeroBanner({ title }: HeroBannerProps) {
  return (
    <div className="hero-banner" style={{ backgroundImage: `url('/chôm 1.png')` }}>
      <div className="hero-overlay">
        <h2 className="hero-subtitle">Welcome {title} to</h2>
        <h1 className="hero-title">SMART CAMPUS SYSTEM</h1>
      </div>
    </div>
  );
}
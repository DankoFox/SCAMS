import "./index.css";

interface FeatureSectionProps {
  description: string;
  subDescription?: string;
  buttons: { text: string; link: string }[];
}

export function FeatureSection({ description, subDescription, buttons }: FeatureSectionProps) {
  return (
    <section className="feature-section">
      <div className="feature-container">
        <img src="/schoolroom 1.png" alt="schoolroom" className="feature-image" />
        <div className="feature-content">
            <p className="feature-description">
                {description}
            </p>
            <p className="feature-subdescription">
                {subDescription}
            </p>
            <div className="feature-buttons">
                {buttons.map((btn, idx) => (
                <a key={idx} href={btn.link} className={`feature-button ${idx === 1 ? 'feature-button-secondary' : ''}`}>
                    {btn.text}
                </a>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
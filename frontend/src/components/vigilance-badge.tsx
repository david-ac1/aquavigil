type VigilanceBadgeProps = {
  score: number;
};

export function VigilanceBadge({ score }: VigilanceBadgeProps) {
  const tone = score >= 85 ? "ok" : score >= 60 ? "warn" : "alert";

  return (
    <div className={`vigilance-badge vigilance-badge--${tone}`}>
      <span>Vigilance Badge</span>
      <strong>{score}% Confidence</strong>
    </div>
  );
}

type ThresholdGaugeProps = {
  value: number;
  label: string;
};

export function ThresholdGauge({ value, label }: ThresholdGaugeProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="threshold-gauge">
      <div className="threshold-gauge__label-row">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="threshold-gauge__track">
        <div className="threshold-gauge__fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

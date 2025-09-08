interface ProgressBarChartProps {
  checked: number;
  unchecked: number;
  mismatch: number;
}

export default function ProgressBarChart({ 
  checked, 
  mismatch, 
  unchecked
}: ProgressBarChartProps) {
  const total = checked + mismatch + unchecked;
  
  const checkedWidth = total > 0 ? (checked / total) * 100 : 0;
  const mismatchWidth = total > 0 ? (mismatch / total) * 100 : 0;
  const uncheckedWidth = total > 0 ? (unchecked / total) * 100 : 100;

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full flex">
        <div 
          className="bg-brand-green" 
          style={{ width: `${checkedWidth}%` }}
        />
        <div 
          className="bg-brand-error" 
          style={{ width: `${mismatchWidth}%` }}
        />
        <div 
          className="bg-brand-light-gray" 
          style={{ width: `${uncheckedWidth}%` }}
        />
      </div>
    </div>
  );
}

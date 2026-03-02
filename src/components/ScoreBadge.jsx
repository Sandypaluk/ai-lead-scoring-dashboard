export default function ScoreBadge({ score }) {
  let ringColor, barColor, labelCls, label

  if (score >= 70) {
    ringColor = 'ring-green-200 bg-green-50'
    barColor = 'bg-green-500'
    labelCls = 'text-green-700 bg-green-100'
    label = 'High'
  } else if (score >= 40) {
    ringColor = 'ring-amber-200 bg-amber-50'
    barColor = 'bg-amber-400'
    labelCls = 'text-amber-700 bg-amber-100'
    label = 'Med'
  } else {
    ringColor = 'ring-red-200 bg-red-50'
    barColor = 'bg-red-400'
    labelCls = 'text-red-700 bg-red-100'
    label = 'Low'
  }

  return (
    <div className={`inline-flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg ring-1 ${ringColor} min-w-[64px]`}>
      <span className="text-slate-800 font-bold text-base leading-none">{score}</span>
      {/* Score bar */}
      <div className="w-full bg-slate-200 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${labelCls}`}>
        {label}
      </span>
    </div>
  )
}

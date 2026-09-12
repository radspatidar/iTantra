const EMERGENCY_KEYWORDS = [
  "help",
  "fire",
  "evacuate",
  "evacuation",
  "emergency",
  "danger",
  "sos",
  "mayday",
  "casualty",
  "injured",
  "blast",
  "explosion",
  "attack",
  // Hindi / Devanagari
  "मदद",
  "आग",
  "खतरा",
  "सहायता",
  "निकासी",
  "तुरंत सहायता",
  "बचाओ",
  "सुरक्षित स्थान",
  "evacuate",
  "खाली करें",
]

const IMPORTANT_KEYWORDS = [
  "report",
  "status",
  "urgent",
  "priority",
  "attention",
  "caution",
  "warning",
  "standby",
  "hold",
  "confirm",
  "acknowledge",
  "रिपोर्ट",
  "स्थिति",
  "जरूरी",
  "सावधान",
  "ध्यान",
]

export function classifyPriority(text) {
  const lower = (text || "").toLowerCase()
  for (const kw of EMERGENCY_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return "emergency"
  }
  for (const kw of IMPORTANT_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return "important"
  }
  return "normal"
}

export function priorityLabel(p) {
  return (
    { normal: "Normal", important: "Important", emergency: "Emergency" }[p] ||
    "Normal"
  )
}

export function priorityColor(p) {
  return (
    {
      normal: {
        bg: "bg-slate-100 dark:bg-slate-700",
        text: "text-slate-600 dark:text-slate-300",
        dot: "bg-slate-400",
      },
      important: {
        bg: "bg-amber-50 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
      },
      emergency: {
        bg: "bg-red-50 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        dot: "bg-red-500",
      },
    }[p] || {
      bg: "bg-slate-100 dark:bg-slate-700",
      text: "text-slate-600 dark:text-slate-300",
      dot: "bg-slate-400",
    }
  )
}

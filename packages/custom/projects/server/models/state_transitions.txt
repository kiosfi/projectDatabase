states.insert(
  {
    name: "registered",
    next_states: ["in_review", "ended"]
  },
  {
    name: "in_review",
    next_states: ["approved", "rejected", "ended"]
  },
  {
    name: "approved",
    next_states: ["signed", "rejected", "ended"]
  },
  {
    name: "rejected",
    next_states: []
  },
  {
    name: "signed",
    next_states: ["intermediary_report", "end_report", "ended"]
  },
  {
    name: "intermediary_report",
    next_states: ["intermediary_report", "end_report", "ended"]
  },
  {
    name: "end_report",
    next_states: ["ended"]
  },
  {
    name: "ended",
    next_states: []
  }
)

# Scheduled Events Documentation

## Overview

Scheduled events enable you to run microflows automatically on a regular basis without requiring end-user interaction.

They're managed through the task queue mechanism and added to modules as documents.

**Note**: "Scheduled events can be tested locally, but they will not be run if your app is deployed as a Free App."

---

## Creating Scheduled Events

Access scheduled events by right-clicking your module and selecting "Add other."

---

## Core Configuration Properties

### Common Properties

| Property | Description |
|----------|-------------|
| **Name** | Identifies the scheduled event in `System.ProcessedQueueTask` at runtime |
| **Documentation** | For model documentation only |
| **Microflow** | Operation triggered by the event (no parameters, runs with all rights) |
| **Enabled** | Controls whether microflow executes |

---

## Timing Options

The system supports six interval types:

| Interval | Description |
|----------|-------------|
| **Yearly** | Run on specific dates or weekdays (e.g., first Monday in April) |
| **Monthly** | Execute on particular days or specific weekdays |
| **Weekly** | Run on selected days (Monday, Wednesday, Friday) |
| **Daily** | Execute at a specified time |
| **Hourly** | Run every N hours with optional minute offset |
| **Minutes** | Execute every N minutes |

Each option allows UTC or server-based time zone specification.

---

## Handling Long-Running Events

When events exceed their interval duration, choose an overlap strategy:

| Strategy | Behavior |
|----------|----------|
| **Skip next** (default) | Subsequent events skipped until completion, resuming at next scheduled time |
| **Delay next** | Next event starts immediately after previous finishes, potentially drifting from schedule |

---

## Key Operational Limits

- Maximum of ten scheduled events can run concurrently per cluster node
- Hour and minute intervals must be integer divisors of 24 or 60 respectively
- All Mendix Cloud servers operate on UTC time

---

## Database Management

Each execution creates entries in `System.ProcessedQueueTask`.

**Important**: Implement cleanup procedures to manage table growth over time.

---

## Best Practices

1. **Use meaningful names** for easy identification
2. **Set appropriate intervals** based on task requirements
3. **Handle errors gracefully** within the microflow
4. **Monitor execution** through logs and system entities
5. **Implement cleanup** for ProcessedQueueTask table

---

## Sources

- [Scheduled Events](https://docs.mendix.com/refguide/scheduled-events/)

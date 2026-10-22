# RotBrain

**Cross-Platform Reels & Shorts Tracker with 3D Brain Animations**

RotBrain is a digital wellbeing mobile application for Android and iOS built with React Native and TypeScript. It is designed to help users develop mindful awareness of their short-form video scrolling habits across **Instagram Reels** and **YouTube Shorts**.

As users scroll short-form videos throughout the day, an evolving 3D brain character dynamically transforms across four distinct milestones to visually reflect cognitive fatigue.

---

## 🧠 Brain Fatigue Progression Milestones

| State | Milestone Count | Visual Appearance & Aura | Digital Wellbeing State |
| :--- | :--- | :--- | :--- |
| **Fresh Brain** | `0 – 29` videos | Radiant neon cyan & electric violet glow, cheerful expression | Optimal focus & mental clarity |
| **Tired Brain** | `30 – 59` videos | Warm amber glow, sleepy eyes, gentle fatigue | Dopamine fatigue setting in; break recommended |
| **Very Tired Brain** | `60 – 89` videos | Dimming orange aura, drooping & dizzy swirly eyes | Sensory overload; step away |
| **Completely Exhausted** | `90+` videos | Faint coral/red embers, completely slumped / melted | Daily limit exceeded; put phone down |

*Note: The brain character's appearance represents a behavioral milestone reminder to encourage balance, not a clinical or medical diagnosis.*

---

## 🛠️ Technology Stack

* **Frontend:** React Native (TypeScript in strict mode)
* **Navigation:** React Navigation (Native Stack & Bottom Tabs)
* **State Management:** Zustand
* **Animations:** React Native Reanimated (UI-thread performant motion)
* **Touch & Gestures:** React Native Gesture Handler
* **Icons & Visuals:** Bespoke 3D Brain character assets & Lucide icons
* **Local Database:** SQLite with transactional integrity & duplicate event rejection
* **Time System:** Centralized strict 24-hour formatting (`00:00` to `23:59`) with zero AM/PM across all screens, charts, and storage
* **Testing:** Jest & React Native Testing Library
* **Android Native:** Kotlin (`UsageStatsManager`, `AccessibilityService`, `WindowManager` floating overlay)
* **iOS Native:** Swift (`FamilyControls`, `DeviceActivity`, `ManagedSettings`)

---

## 📱 Features

1. **Animated Onboarding (6 Screens):**
   * *Screen 1:* Welcome to RotBrain & Mascot Introduction
   * *Screen 2:* The Dopamine Loop & Scroll-triggered Demonstration
   * *Screen 3:* Meet Your Brain (Interactive milestone state cards)
   * *Screen 4:* Choose Platforms (Independent Instagram & YouTube toggles)
   * *Screen 5:* Enable Permissions (Transparent explanations with zero misleading claims)
   * *Screen 6:* Ready to Begin & Confirmation Summary

2. **Main Dashboard:**
   * Live 24-hour clock header (`HH:mm:ss`)
   * Dynamic `BrainStatusCard` with live counter and milestone progress bar
   * Platform Filter Tabs (`Combined`, `Instagram Reels`, `YouTube Shorts`)
   * Today's overview metric cards (Confirmed Videos, Viewing Time, Sessions, Daily Goal)
   * Real-time session monitoring controls & simulation harness

3. **24-Hour Behavioral Analytics:**
   * Daily, Weekly, and Monthly view intervals
   * 24-Hour Activity Distribution Chart (hour-by-hour timeline from `00:00` to `23:00`)
   * Platform Consumption Share breakdown
   * Detailed Session History list with 24-hour ranges (`14:20 – 14:45`) and local deletion

4. **Android Floating Brain Overlay:**
   * Draggable, compact on-screen mascot positioned at bottom-right
   * Displays live count and updates character expression without flicker
   * Single tap launches the RotBrain application
   * Configurable sizes (`small`, `medium`, `large`)

5. **Local Privacy & Recovery:**
   * 100% on-device SQLite storage — zero remote telemetry or video capture
   * Automatic local calendar day reset at midnight (resets counter to 0, returns to Fresh Brain, archives yesterday's summary)
   * Safe session recovery for interrupted sessions
   * One-tap local data deletion and JSON export

---

## 🧪 Automated Testing

RotBrain includes a comprehensive test suite covering all critical business rules:

```bash
# Run all unit tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Verified Test Suites:
* `__tests__/brainStateManager.test.ts`: Validates milestone boundary counts (0, 29, 30, 59, 60, 89, 90, 90+).
* `__tests__/dateTimeFormatter.test.ts`: Enforces strict 24-hour time formatting and verifies zero AM/PM occurrences.
* `__tests__/platformFilter.test.ts`: Verifies independent platform filtering and ensures filter switches do not alter brain state.
* `__tests__/dailyResetManager.test.ts`: Validates local calendar midnight rollover, session recovery, and deduplication.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start development server
npm start
```

---

## 📄 License

MIT © [Mahendra Singh](https://github.com/mahendraasingh)

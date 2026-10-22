package com.rotbrain.monitoring

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context

/**
 * UsageStatsMonitor
 *
 * Utilizes Android's UsageStatsManager to track foreground presence and session duration
 * for Instagram and YouTube without requiring invasive screen inspection.
 */
class UsageStatsMonitor(private val context: Context) {

    private val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager

    companion object {
        const val PKG_INSTAGRAM = "com.instagram.android"
        const val PKG_YOUTUBE = "com.google.android.youtube"
    }

    /**
     * Determines whether the user has granted PACKAGE_USAGE_STATS permission.
     */
    fun hasUsagePermission(): Boolean {
        if (usageStatsManager == null) return false
        val now = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            now - 1000 * 60,
            now
        )
        return stats != null && stats.isNotEmpty()
    }

    /**
     * Queries foreground events in the specified time window.
     */
    fun getForegroundEvents(startTime: Long, endTime: Long): List<ForegroundSessionEvent> {
        val results = mutableListOf<ForegroundSessionEvent>()
        if (usageStatsManager == null) return results

        val events = usageStatsManager.queryEvents(startTime, endTime)
        val currentEvent = UsageEvents.Event()

        while (events.hasNextEvent()) {
            events.getNextEvent(currentEvent)
            val pkg = currentEvent.packageName

            if (pkg == PKG_INSTAGRAM || pkg == PKG_YOUTUBE) {
                if (currentEvent.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                    results.add(ForegroundSessionEvent(pkg, currentEvent.timeStamp, true))
                } else if (currentEvent.eventType == UsageEvents.Event.ACTIVITY_PAUSED) {
                    results.add(ForegroundSessionEvent(pkg, currentEvent.timeStamp, false))
                }
            }
        }
        return results
    }

    data class ForegroundSessionEvent(
        val packageName: String,
        val timestamp: Long,
        val isForeground: Boolean
    )
}

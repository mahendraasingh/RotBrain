package com.rotbrain.monitoring

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * RotBrainAccessibilityService
 *
 * Provides short-video context detection inside supported platforms:
 * - Instagram Reels: com.instagram.android
 * - YouTube Shorts: com.google.android.youtube
 *
 * Privacy and Policy Compliance:
 * - Legitimately detects only vertical scroll actions inside the Reels/Shorts container.
 * - Never captures text content, personal messages, or user credentials.
 * - Cleans node hierarchies immediately to prevent memory retention.
 */
class RotBrainAccessibilityService : AccessibilityService() {

    companion object {
        const val ACTION_VIDEO_SCROLLED = "com.rotbrain.ACTION_VIDEO_SCROLLED"
        const val EXTRA_PLATFORM = "extra_platform"
        const val EXTRA_CONFIDENCE = "extra_confidence"

        private const val PKG_INSTAGRAM = "com.instagram.android"
        private const val PKG_YOUTUBE = "com.google.android.youtube"
    }

    private var lastScrollTimestamp: Long = 0
    private val scrollDebounceMs = 1200L // Prevent rapid double-trigger on single swipe

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val pkgName = event.packageName?.toString() ?: return
        val currentTime = System.currentTimeMillis()

        if (event.eventType == AccessibilityEvent.TYPE_VIEW_SCROLLED) {
            if (currentTime - lastScrollTimestamp < scrollDebounceMs) {
                return
            }

            when (pkgName) {
                PKG_INSTAGRAM -> {
                    if (isInstagramReelsContext(event.source)) {
                        lastScrollTimestamp = currentTime
                        broadcastVideoEvent("instagram", 0.95f)
                    }
                }
                PKG_YOUTUBE -> {
                    if (isYouTubeShortsContext(event.source)) {
                        lastScrollTimestamp = currentTime
                        broadcastVideoEvent("youtube", 0.95f)
                    }
                }
            }
        }
    }

    private fun isInstagramReelsContext(rootNode: AccessibilityNodeInfo?): Boolean {
        if (rootNode == null) return false
        try {
            // Check for Reels view hierarchy markers
            val reelsIndicators = rootNode.findAccessibilityNodeInfosByViewId("com.instagram.android:id/reel_viewer_container")
            if (reelsIndicators.isNotEmpty()) {
                return true
            }

            val clipsIndicators = rootNode.findAccessibilityNodeInfosByViewId("com.instagram.android:id/clips_video_container")
            return clipsIndicators.isNotEmpty()
        } finally {
            rootNode.recycle()
        }
    }

    private fun isYouTubeShortsContext(rootNode: AccessibilityNodeInfo?): Boolean {
        if (rootNode == null) return false
        try {
            // Check for Shorts video player container
            val shortsIndicators = rootNode.findAccessibilityNodeInfosByViewId("com.google.android.youtube:id/reel_player_view")
            return shortsIndicators.isNotEmpty()
        } finally {
            rootNode.recycle()
        }
    }

    private fun broadcastVideoEvent(platform: String, confidence: Float) {
        val intent = Intent(ACTION_VIDEO_SCROLLED).apply {
            putExtra(EXTRA_PLATFORM, platform)
            putExtra(EXTRA_CONFIDENCE, confidence)
            setPackage(packageName)
        }
        sendBroadcast(intent)
    }

    override fun onInterrupt() {
        // Handle interruption or accessibility state change
    }
}

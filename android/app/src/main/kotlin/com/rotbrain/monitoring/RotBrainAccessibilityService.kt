package com.rotbrain.monitoring

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.rotbrain.overlay.FloatingBrainOverlayService

/**
 * RotBrainAccessibilityService
 *
 * Provides short-video context detection inside supported platforms:
 * - Instagram Reels: com.instagram.android
 * - YouTube Shorts: com.google.android.youtube
 *
 * Strict Visibility Control:
 * - During normal scrolling / other applications: floating overlay remains hidden.
 * - ONLY when user starts using Reels or Shorts: overlay appears immediately with live counter.
 * - When user exits Reels/Shorts: overlay hides immediately.
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
    private var isCurrentlyInReelsOrShorts: Boolean = false

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val pkgName = event.packageName?.toString() ?: return
        val currentTime = System.currentTimeMillis()

        // If user changed windows / switched apps outside target platforms, hide overlay
        if (pkgName != PKG_INSTAGRAM && pkgName != PKG_YOUTUBE) {
            if (isCurrentlyInReelsOrShorts) {
                isCurrentlyInReelsOrShorts = false
                updateOverlayVisibility(false)
            }
            return
        }

        val rootNode = event.source

        // Determine if current view hierarchy is actively inside Reels or Shorts
        val inReels = pkgName == PKG_INSTAGRAM && isInstagramReelsContext(rootNode)
        val inShorts = pkgName == PKG_YOUTUBE && isYouTubeShortsContext(rootNode)
        val inTargetFeed = inReels || inShorts

        if (inTargetFeed != isCurrentlyInReelsOrShorts) {
            isCurrentlyInReelsOrShorts = inTargetFeed
            updateOverlayVisibility(inTargetFeed)
        }

        // On scroll events inside Reels / Shorts, record confirmed video view
        if (event.eventType == AccessibilityEvent.TYPE_VIEW_SCROLLED && inTargetFeed) {
            if (currentTime - lastScrollTimestamp < scrollDebounceMs) {
                return
            }

            lastScrollTimestamp = currentTime
            val platform = if (inReels) "instagram" else "youtube"
            broadcastVideoEvent(platform, 0.95f)
        }
    }

    private fun updateOverlayVisibility(isVisible: Boolean) {
        val intent = Intent(this, FloatingBrainOverlayService::class.java).apply {
            putExtra(FloatingBrainOverlayService.EXTRA_VISIBLE, isVisible)
        }
        try {
            startService(intent)
        } catch (_: Exception) {
            // Service not running or permissions not granted
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
        } catch (_: Exception) {
            return false
        } finally {
            try {
                rootNode.recycle()
            } catch (_: Exception) {}
        }
    }

    private fun isYouTubeShortsContext(rootNode: AccessibilityNodeInfo?): Boolean {
        if (rootNode == null) return false
        try {
            // Check for Shorts video player container
            val shortsIndicators = rootNode.findAccessibilityNodeInfosByViewId("com.google.android.youtube:id/reel_player_view")
            return shortsIndicators.isNotEmpty()
        } catch (_: Exception) {
            return false
        } finally {
            try {
                rootNode.recycle()
            } catch (_: Exception) {}
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
        if (isCurrentlyInReelsOrShorts) {
            isCurrentlyInReelsOrShorts = false
            updateOverlayVisibility(false)
        }
    }
}

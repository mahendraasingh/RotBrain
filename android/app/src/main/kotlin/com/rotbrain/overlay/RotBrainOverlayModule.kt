package com.rotbrain.overlay

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * RotBrainOverlayModule
 *
 * Checks and requests Android SYSTEM_ALERT_WINDOW (display over other apps)
 * and controls FloatingBrainOverlayService.
 */
class RotBrainOverlayModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RotBrainOverlayModule"

    @ReactMethod
    fun checkPermission(promise: Promise) {
        val granted = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(reactContext)
        } else {
            true
        }
        promise.resolve(if (granted) "granted" else "denied")
    }

    @ReactMethod
    fun requestPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${reactContext.packageName}")
                ).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                reactContext.startActivity(intent)
                promise.resolve("requested")
            } catch (e: Exception) {
                promise.reject("OVERLAY_ERROR", e.message)
            }
        } else {
            promise.resolve("granted")
        }
    }

    @ReactMethod
    fun updateCount(count: Int, state: String, promise: Promise) {
        val intent = Intent(reactContext, FloatingBrainOverlayService::class.java).apply {
            putExtra(FloatingBrainOverlayService.EXTRA_COUNT, count)
            putExtra(FloatingBrainOverlayService.EXTRA_STATE, state)
        }
        reactContext.startService(intent)
        promise.resolve(true)
    }

    @ReactMethod
    fun setVisible(visible: Boolean, promise: Promise) {
        val intent = Intent(reactContext, FloatingBrainOverlayService::class.java)
        if (visible) {
            reactContext.startService(intent)
        } else {
            reactContext.stopService(intent)
        }
        promise.resolve(true)
    }
}

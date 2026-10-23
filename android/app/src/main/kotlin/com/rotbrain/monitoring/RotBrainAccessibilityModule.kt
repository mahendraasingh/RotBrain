package com.rotbrain.monitoring

import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

/**
 * RotBrainAccessibilityModule
 *
 * Checks if RotBrainAccessibilityService is currently enabled in Android Accessibility settings
 * and opens the Settings.ACTION_ACCESSIBILITY_SETTINGS screen so the user can grant permission.
 */
class RotBrainAccessibilityModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RotBrainAccessibilityModule"

    @ReactMethod
    fun checkPermission(promise: Promise) {
        try {
            val accessibilityManager =
                reactContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as? AccessibilityManager
            if (accessibilityManager == null) {
                promise.resolve("unsupported")
                return
            }

            val enabledServices = accessibilityManager.getEnabledAccessibilityServiceList(
                AccessibilityServiceInfo.FEEDBACK_GENERIC or AccessibilityServiceInfo.FEEDBACK_ALL_MASK
            )

            val serviceId = "${reactContext.packageName}/${RotBrainAccessibilityService::class.java.canonicalName}"
            val isEnabled = enabledServices.any { service ->
                val id = service.id
                id.contains(reactContext.packageName) || id.equals(serviceId, ignoreCase = true)
            }

            if (isEnabled) {
                promise.resolve("granted")
            } else {
                promise.resolve("denied")
            }
        } catch (e: Exception) {
            promise.resolve("denied")
        }
    }

    @ReactMethod
    fun requestPermission(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(intent)
            promise.resolve("requested")
        } catch (e: Exception) {
            promise.reject("ACCESSIBILITY_SETTINGS_ERROR", e.message)
        }
    }

    @ReactMethod
    fun startMonitoring(platforms: ReadableArray, promise: Promise) {
        // Accessibility service automatically detects once enabled in system settings
        promise.resolve(true)
    }

    @ReactMethod
    fun stopMonitoring(promise: Promise) {
        promise.resolve(true)
    }
}

package com.rotbrain.monitoring

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * RotBrainUsageStatsModule
 *
 * Native bridge providing genuine Android Usage Access permission inspection
 * and launching the system Settings.ACTION_USAGE_ACCESS_SETTINGS screen.
 */
class RotBrainUsageStatsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RotBrainUsageStatsModule"

    @ReactMethod
    fun checkPermission(promise: Promise) {
        try {
            val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager
            if (appOps == null) {
                promise.resolve("unsupported")
                return
            }

            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    reactContext.packageName
                )
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    reactContext.packageName
                )
            }

            if (mode == AppOpsManager.MODE_ALLOWED) {
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
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
                data = Uri.fromParts("package", reactContext.packageName, null)
            }
            reactContext.startActivity(intent)
            promise.resolve("requested")
        } catch (e: Exception) {
            try {
                // Fallback to general usage settings if package URI fails
                val generalIntent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                reactContext.startActivity(generalIntent)
                promise.resolve("requested")
            } catch (fallbackError: Exception) {
                promise.reject("PERMISSION_ERROR", fallbackError.message)
            }
        }
    }
}

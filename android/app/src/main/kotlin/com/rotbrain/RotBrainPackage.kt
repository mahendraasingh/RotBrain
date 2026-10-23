package com.rotbrain

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.rotbrain.monitoring.RotBrainAccessibilityModule
import com.rotbrain.monitoring.RotBrainUsageStatsModule
import com.rotbrain.overlay.RotBrainOverlayModule

/**
 * RotBrainPackage
 *
 * Registers RotBrain native modules for usage stats, accessibility reels/shorts detection,
 * and floating brain overlay.
 */
class RotBrainPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            RotBrainUsageStatsModule(reactContext),
            RotBrainAccessibilityModule(reactContext),
            RotBrainOverlayModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<View, ReactShadowNode<*>>> {
        return emptyList()
    }
}

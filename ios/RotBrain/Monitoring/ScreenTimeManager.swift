import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings

/**
 * ScreenTimeManager
 *
 * Manages Apple Screen Time API integration using FamilyControls & DeviceActivity.
 * Authorizes user consent and establishes activity schedules for Instagram and YouTube.
 */
@available(iOS 15.0, *)
@objc(RotBrainScreenTimeManager)
public class ScreenTimeManager: NSObject {

    private let center = AuthorizationCenter.shared

    @objc
    public static func requiresMainQueueSetup() -> Bool {
        return false
    }

    /**
     * Checks current authorization status for FamilyControls.
     */
    @objc
    public func checkAuthorization(_ resolve: @escaping (String) -> Void) {
        switch center.authorizationStatus {
        case .approved:
            resolve("granted")
        case .denied:
            resolve("denied")
        case .notDetermined:
            resolve("not_requested")
        @unknown default:
            resolve("unsupported")
        }
    }

    /**
     * Requests FamilyControls authorization from user.
     */
    @objc
    public func requestAuthorization(_ resolve: @escaping (String) -> Void, reject: @escaping (String, String, Error?) -> Void) {
        Task {
            do {
                try await center.requestAuthorization(for: .individual)
                resolve("granted")
            } catch {
                resolve("denied")
            }
        }
    }

    /**
     * Configures DeviceActivity monitoring schedule for short-form video apps.
     */
    @objc
    public func startMonitoringSchedule() {
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )

        let activityName = DeviceActivityName("com.rotbrain.dailyMonitoring")
        let activityCenter = DeviceActivityCenter()

        do {
            try activityCenter.startMonitoring(activityName, during: schedule)
        } catch {
            print("RotBrain: Failed to start DeviceActivity monitoring: \(error)")
        }
    }
}

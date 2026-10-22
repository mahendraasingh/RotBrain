/**
 * RotBrain Centralized DateTimeFormatter
 *
 * MANDATORY REQUIREMENT:
 * Every time displayed across RotBrain MUST use the strict 24-hour format (e.g., 00:00, 08:15, 14:30, 23:59).
 * AM and PM are NEVER displayed anywhere in the application.
 */

export class DateTimeFormatter {
  /**
   * Formats a date/timestamp to 24-hour format: "HH:mm" (e.g., "14:30", "00:05", "23:59")
   */
  public static formatTime24(dateInput: Date | string | number): string {
    const date = this.toDate(dateInput);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Formats a date/timestamp to 24-hour format with seconds: "HH:mm:ss"
   */
  public static formatTimeSeconds24(dateInput: Date | string | number): string {
    const date = this.toDate(dateInput);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Formats a time range in strict 24-hour format (e.g., "14:15 – 14:45" or "23:50 – 00:10")
   */
  public static formatTimeRange24(
    startInput: Date | string | number,
    endInput: Date | string | number | null
  ): string {
    const startStr = this.formatTime24(startInput);
    if (!endInput) {
      return `${startStr} – Present`;
    }
    const endStr = this.formatTime24(endInput);
    return `${startStr} – ${endStr}`;
  }

  /**
   * Formats a local calendar date as "YYYY-MM-DD"
   */
  public static formatLocalDate(dateInput: Date | string | number = new Date()): string {
    const date = this.toDate(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formats date with 24-hour time: "YYYY-MM-DD HH:mm"
   */
  public static formatDateTime24(dateInput: Date | string | number): string {
    const dateStr = this.formatLocalDate(dateInput);
    const timeStr = this.formatTime24(dateInput);
    return `${dateStr} ${timeStr}`;
  }

  /**
   * Formats a human-readable calendar title with 24-hour time
   * e.g., "Today, 14:30" or "Yesterday, 21:05" or "22 Oct, 09:15"
   */
  public static formatRelativeDateTime24(dateInput: Date | string | number): string {
    const date = this.toDate(dateInput);
    const todayStr = this.formatLocalDate(new Date());
    const targetDateStr = this.formatLocalDate(date);

    const timeStr = this.formatTime24(date);

    if (targetDateStr === todayStr) {
      return `Today, ${timeStr}`;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (targetDateStr === this.formatLocalDate(yesterday)) {
      return `Yesterday, ${timeStr}`;
    }

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${day} ${month}, ${timeStr}`;
  }

  /**
   * Formats duration in seconds to clean reading format
   * e.g. 45 -> "45s", 125 -> "2m 05s", 3720 -> "1h 02m"
   */
  public static formatDuration(seconds: number): string {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`;
    }
    return `${remainingSeconds}s`;
  }

  /**
   * Returns list of 24 hourly labels for charts: ["00:00", "01:00", ..., "23:00"]
   */
  public static get24HourLabels(): string[] {
    return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  }

  /**
   * Helper to ensure Date object
   */
  private static toDate(input: Date | string | number): Date {
    if (input instanceof Date) {
      return input;
    }
    const parsed = new Date(input);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date input for DateTimeFormatter: ${input}`);
    }
    return parsed;
  }
}

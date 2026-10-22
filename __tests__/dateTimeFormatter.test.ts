import { DateTimeFormatter } from '../src/utils/dateTimeFormatter';

describe('DateTimeFormatter — Strict 24-Hour Time Format Tests', () => {
  test('Formats midnight as 00:00', () => {
    const midnight = new Date('2026-10-23T00:00:00');
    expect(DateTimeFormatter.formatTime24(midnight)).toBe('00:00');
  });

  test('Formats morning as 08:15', () => {
    const morning = new Date('2026-10-23T08:15:00');
    expect(DateTimeFormatter.formatTime24(morning)).toBe('08:15');
  });

  test('Formats noon as 12:00', () => {
    const noon = new Date('2026-10-23T12:00:00');
    expect(DateTimeFormatter.formatTime24(noon)).toBe('12:00');
  });

  test('Formats afternoon as 14:30', () => {
    const afternoon = new Date('2026-10-23T14:30:00');
    expect(DateTimeFormatter.formatTime24(afternoon)).toBe('14:30');
  });

  test('Formats evening as 18:45', () => {
    const evening = new Date('2026-10-23T18:45:00');
    expect(DateTimeFormatter.formatTime24(evening)).toBe('18:45');
  });

  test('Formats end of day as 23:59', () => {
    const endOfDay = new Date('2026-10-23T23:59:59');
    expect(DateTimeFormatter.formatTime24(endOfDay)).toBe('23:59');
  });

  test('Mandatory Rule: Output must NEVER contain AM or PM', () => {
    const testHours = [0, 4, 8, 11, 12, 13, 16, 20, 23];
    testHours.forEach((hour) => {
      const date = new Date(2026, 9, 23, hour, 30, 0);
      const time24 = DateTimeFormatter.formatTime24(date);
      const timeSeconds = DateTimeFormatter.formatTimeSeconds24(date);
      const dateTime = DateTimeFormatter.formatDateTime24(date);

      expect(time24).not.toMatch(/am|pm/i);
      expect(timeSeconds).not.toMatch(/am|pm/i);
      expect(dateTime).not.toMatch(/am|pm/i);
    });
  });

  test('Formats time range in 24-hour style', () => {
    const start = new Date(2026, 9, 23, 14, 15);
    const end = new Date(2026, 9, 23, 14, 45);
    expect(DateTimeFormatter.formatTimeRange24(start, end)).toBe('14:15 – 14:45');
  });

  test('Formats duration accurately', () => {
    expect(DateTimeFormatter.formatDuration(35)).toBe('35s');
    expect(DateTimeFormatter.formatDuration(125)).toBe('2m 05s');
    expect(DateTimeFormatter.formatDuration(3665)).toBe('1h 01m');
  });

  test('24-Hour chart labels must contain exactly 24 elements from 00:00 to 23:00', () => {
    const labels = DateTimeFormatter.get24HourLabels();
    expect(labels.length).toBe(24);
    expect(labels[0]).toBe('00:00');
    expect(labels[12]).toBe('12:00');
    expect(labels[23]).toBe('23:00');

    labels.forEach((label) => {
      expect(label).not.toMatch(/am|pm/i);
      expect(label).toMatch(/^\d{2}:00$/);
    });
  });
});

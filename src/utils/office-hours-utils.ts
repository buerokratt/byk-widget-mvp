import { DateTime } from 'luxon';

const areOfficeHoursVariablesCorrectlyConfigured = () =>
  typeof window._env_.OFFICE_HOURS.TIMEZONE === 'string' &&
  typeof window._env_.OFFICE_HOURS.END === 'number' &&
  typeof window._env_.OFFICE_HOURS.BEGIN === 'number';

export const isOfficeHours = (): boolean => {
  if (!window._env_.OFFICE_HOURS) return true;
  // eslint-disable-next-line no-console
  if (!areOfficeHoursVariablesCorrectlyConfigured()) console.error('BYK widget - TIMEZONE Configuration error');

  const currentDateTime = DateTime.now().setZone(window._env_.OFFICE_HOURS.TIMEZONE);
  const isOfficeHour = window._env_.OFFICE_HOURS.BEGIN <= currentDateTime.hour && currentDateTime.hour < window._env_.OFFICE_HOURS.END;
  const isOfficeDay = window._env_.OFFICE_HOURS.DAYS.includes(currentDateTime.weekday);
  return isOfficeHour && isOfficeDay;
};

export default isOfficeHours();

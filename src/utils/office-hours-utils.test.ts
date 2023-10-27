import { Settings } from 'luxon';
import { isOfficeHours } from './office-hours-utils';

describe('officeHoursUtils', () => {
  it('should say officeHours is true when in defined office hours', () => {
    Settings.now = () => new Date(2021, 12, 18, 12).valueOf();
    expect(isOfficeHours()).toBeTruthy();
  });

  it('should say officeHours is false when not in defined office hours', () => {
    Settings.now = () => new Date(2021, 12, 18, 2).valueOf();
    expect(isOfficeHours()).toBeFalsy();
  });

  it('should say officeHours is false when day is not defined work day', () => {
    Settings.now = () => new Date(2021, 12, 15, 2).valueOf();
    expect(isOfficeHours()).toBeFalsy();
  });
});

import { setToSessionStorage } from './session-storage-utils';

const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => null);

describe('sessionStorageUtils', () => {
  it('setToSessionStorage calls to Storage API to set a stringified value', () => {
    setToSessionStorage('test', 1);
    expect(setItem).toHaveBeenCalledWith('test', '1');
  });
});

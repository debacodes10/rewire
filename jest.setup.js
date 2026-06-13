/* eslint-env jest */

jest.mock('react-native-mmkv', () => {
  const stores = new Map();

  return {
    createMMKV: ({ id = 'default' } = {}) => {
      if (!stores.has(id)) {
        stores.set(id, new Map());
      }

      const store = stores.get(id);

      return {
        id,
        getString: key => store.get(key),
        set: (key, value) => {
          store.set(key, String(value));
        },
        remove: key => store.delete(key),
        clearAll: () => store.clear(),
        contains: key => store.has(key),
        getAllKeys: () => Array.from(store.keys()),
      };
    },
  };
});

jest.mock('react-native-biometrics', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      isSensorAvailable: jest.fn(async () => ({ available: true, biometryType: 'FaceID' })),
      simplePrompt: jest.fn(async () => ({ success: true })),
    })),
  };
});

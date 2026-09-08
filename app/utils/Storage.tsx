import AsyncStorage from '@react-native-async-storage/async-storage';

async function get<T = any>(key: string, defaultValue: T | null = null): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return defaultValue;
  } catch (error) {
    console.warn('Storage.get error for key: ' + key, error);
    return defaultValue;
  }
}

async function set(key: string, value: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage.set error for key: ' + key, error);
  }
}

async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('Storage.remove error for key: ' + key, error);
  }
}

async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.warn('Storage.clear error', error);
  }
}

export default {
  get,
  set,
  clear,
  remove,
};
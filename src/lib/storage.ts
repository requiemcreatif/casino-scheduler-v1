/**
 * Utility for localStorage with type safety, error handling.
 * This is to simulate a real API
 */

// Storage keys used across the application
export const STORAGE_KEYS = {
  PRESENTERS: "casino-scheduler-presenters",
  TABLES: "casino-scheduler-tables",
  USERS: "casino-scheduler-users",
  AUTH_TOKEN: "casino-scheduler-token",
};

/**
 * To get an item from localStorage
 * @param key The key to retrieve from
 * @param initialData Fallback data if not found
 * @returns The stored data or initialData if not found/error
 */
export function getStorageItem<T>(key: string, initialData: T): T {
  // Handle SSR - localStorage is not available during server-side rendering
  if (typeof window === "undefined") {
    return initialData;
  }

  try {
    const item = localStorage.getItem(key);
    // Return parsed item if it exists, otherwise return initialData
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return initialData;
  }
}

/**
 * To set an item in localStorage
 * @param key The key to store under
 * @param data The data to store
 */
export function setStorageItem<T>(key: string, data: T): void {
  // Handle SSR - localStorage is not available during server-side rendering
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
}

/**
 * To remove an item from localStorage
 * @param key The key to remove
 */
export function removeStorageItem(key: string): void {
  // Handle SSR - localStorage is not available during server-side rendering
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * To clear all localStorage items for this application
 */
export function clearStorage(): void {
  // Handle SSR - localStorage is not available during server-side rendering
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Only clear items related to this application
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * To initialize localStorage with initial data if not already present
 * @param storageKey The key to initialize
 * @param initialData The initial data to set if the key doesn't exist
 */
export function initializeStorage<T>(storageKey: string, initialData: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(initialData));
    }
  } catch (error) {
    console.error(`Error initializing ${storageKey} in localStorage:`, error);
  }
}

/**
 * Updates localStorage if initial data has changed (for example: if data schema or mock data has been updated)
 * @param storageKey The key to update
 * @param initialData The updated initial data
 * @param shouldUpdate Optional function to decide if update should happen (for example: comparing lengths)
 */
export function updateStorageIfChanged<T extends any[]>(
  storageKey: string,
  initialData: T,
  shouldUpdate?: (stored: T, initial: T) => boolean
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storedData = getStorageItem<T>(storageKey, [] as unknown as T);

    // This is to compare lengths of arrays and item properties
    const defaultShouldUpdate = (stored: T, initial: T): boolean => {
      if (stored.length !== initial.length) {
        return true;
      }

      // Check if items have different properties
      // For tables data, we need to check name, number, active status
      if (storageKey === STORAGE_KEYS.TABLES) {
        for (let i = 0; i < initial.length; i++) {
          const initialItem = initial[i] as any;
          const storedItem = (stored as any[]).find(
            (item) => item.number === initialItem.number
          );

          if (!storedItem) {
            return true;
          }

          // To check if key properties have changed
          if (
            initialItem.name !== storedItem.name ||
            initialItem.active !== storedItem.active
          ) {
            return true;
          }
        }
      }

      return false;
    };

    const checkFunction = shouldUpdate || defaultShouldUpdate;

    if (checkFunction(storedData, initialData)) {
      //console.log(`Updating ${storageKey} due to data changes`);
      setStorageItem(storageKey, initialData);
    }
  } catch (error) {
    console.error(`Error updating ${storageKey} in localStorage:`, error);
    // Fallback to setting the initial data
    setStorageItem(storageKey, initialData);
  }
}

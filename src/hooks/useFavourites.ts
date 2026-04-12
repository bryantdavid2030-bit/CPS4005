import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface FavouritesState {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
}

const FavouritesContext = createContext<FavouritesState | undefined>(undefined);

const STORAGE_KEY = 'humnsprt.favourites';

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavourites(JSON.parse(raw));
      } catch {
        // Silently fall back to empty list.
      }
    })();
  }, []);

  const isFavourite = useCallback(
    (id: string) => favourites.includes(id),
    [favourites],
  );

  const toggleFavourite = useCallback(
    (id: string) => {
      setFavourites((prev) => {
        const next = prev.includes(id)
          ? prev.filter((f) => f !== id)
          : [...prev, id];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      Haptics.selectionAsync();
    },
    [],
  );

  const value = useMemo(
    () => ({ favourites, isFavourite, toggleFavourite }),
    [favourites, isFavourite, toggleFavourite],
  );

  return React.createElement(
    FavouritesContext.Provider,
    { value },
    children,
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx)
    throw new Error('useFavourites must be used inside <FavouritesProvider>');
  return ctx;
}

import { useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '../storage/favorites';

export function useFavorites() {
  const [map, setMap] = useState<Record<string, true>>({});
  useEffect(()=>{ getFavorites().then(setMap); },[]);
  return {
    favorites: map,
    isFav: (id:string)=> !!map[id],
    async toggle(id:string) { const next = await toggleFavorite(id); setMap(next); },
  };
}
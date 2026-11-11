'use client';

import { useEffect, useState, type ComponentType } from 'react';

export default function CityLoader() {
  const [City, setCity] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    import('./city').then(module => {
      if (active) setCity(() => module.default);
    });
    return () => { active = false; };
  }, []);

  return City ? <City /> : null;
}

import { useEffect, useMemo, useState } from 'react';
import {
  donkiFallback,
  nasaApodFallback,
} from '../utils/spaceData.js';

const STORAGE_KEY = 'cosmos-nasa-cache-v1';
const NASA_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

function getCachedPayload() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

/**
 * Formats a Date instance as YYYY-MM-DD for NASA APIs.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Fetches APOD and DONKI data with session cache and static fallbacks.
 * @returns {{
 * loading: boolean,
 * apod: Array<object>,
 * donki: Array<object>,
 * error: string | null
 * }}
 */
export function useNASAApi() {
  const cachedPayload = getCachedPayload();
  const [loading, setLoading] = useState(!cachedPayload);
  const [error, setError] = useState(null);
  const [apod, setApod] = useState(cachedPayload?.apod ?? nasaApodFallback);
  const [donki, setDonki] = useState(cachedPayload?.donki ?? donkiFallback);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const controller = new AbortController();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(endDate.getDate() - 5);
    const spaceWeatherStart = new Date(today);
    spaceWeatherStart.setDate(endDate.getDate() - 14);

    const apodUrl = new URL('https://api.nasa.gov/planetary/apod');
    apodUrl.searchParams.set('api_key', NASA_KEY);
    apodUrl.searchParams.set('thumbs', 'true');
    apodUrl.searchParams.set('start_date', formatDate(startDate));
    apodUrl.searchParams.set('end_date', formatDate(endDate));

    const donkiUrl = new URL('https://api.nasa.gov/DONKI/notifications');
    donkiUrl.searchParams.set('api_key', NASA_KEY);
    donkiUrl.searchParams.set('startDate', formatDate(spaceWeatherStart));
    donkiUrl.searchParams.set('endDate', formatDate(endDate));
    donkiUrl.searchParams.set('type', 'all');

    async function load() {
      try {
        const [apodResponse, donkiResponse] = await Promise.all([
          fetch(apodUrl, { signal: controller.signal }),
          fetch(donkiUrl, { signal: controller.signal }),
        ]);

        if (!apodResponse.ok || !donkiResponse.ok) {
          throw new Error('NASA feed unavailable');
        }

        const [apodJson, donkiJson] = await Promise.all([
          apodResponse.json(),
          donkiResponse.json(),
        ]);

        const apodItems = Array.isArray(apodJson)
          ? [...apodJson]
              .filter((item) => item.media_type === 'image')
              .reverse()
              .slice(0, 6)
          : nasaApodFallback;
        const donkiItems = Array.isArray(donkiJson)
          ? donkiJson.slice(0, 6)
          : donkiFallback;

        setApod(apodItems.length ? apodItems : nasaApodFallback);
        setDonki(donkiItems.length ? donkiItems : donkiFallback);
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            apod: apodItems,
            donki: donkiItems,
          }),
        );
      } catch (fetchError) {
        setError(fetchError.message);
        setApod(nasaApodFallback);
        setDonki(donkiFallback);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [today]);

  return { loading, apod, donki, error };
}

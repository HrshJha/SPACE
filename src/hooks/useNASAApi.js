import { useEffect, useMemo, useState } from 'react';
import {
  donkiFallback,
  nasaApodFallback,
} from '../utils/spaceData.js';

const STORAGE_KEY = 'cosmos-nasa-cache-v2';
const NASA_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

const WEATHER_LABELS = {
  CME: 'Coronal Mass Ejection',
  FLR: 'Solar Flare',
  GST: 'Geomagnetic Storm',
  HSS: 'High-Speed Stream',
  IPS: 'Interplanetary Shock',
  MPC: 'Magnetopause Crossing',
  RBE: 'Radiation Belt Enhancement',
  SEP: 'Solar Energetic Particle Event',
};

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
 * Cleans DONKI text for UI rendering.
 * @param {unknown} value
 * @returns {string}
 */
function cleanWeatherText(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/#+\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(
      /Community Coordinated Modeling Center Database Of Notifications, Knowledge, Information\s*\(\s*CCMC DONKI\s*\)/gi,
      '',
    )
    .replace(/Disclaimer:\s*NOAA.*?accordingly\./gi, '')
    .trim();
}

/**
 * Extracts a DONKI event code from a notification.
 * @param {Record<string, unknown>} entry
 * @param {string} cleanedText
 * @returns {string}
 */
function extractWeatherCode(entry, cleanedText) {
  const explicitCode = String(entry.messageType ?? '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  if (explicitCode && explicitCode !== 'ALL') {
    return explicitCode.slice(0, 4);
  }

  const textMatch = cleanedText.match(/\b(CME|FLR|GST|HSS|IPS|MPC|RBE|SEP)\b/i);
  return textMatch?.[1]?.toUpperCase() ?? 'SWX';
}

/**
 * Extracts a concise DONKI summary line.
 * @param {string} cleanedText
 * @returns {string}
 */
function extractSummary(cleanedText) {
  const summaryMatch = cleanedText.match(
    /Summary:\s*(.*?)(?:Start time(?: of the event)?:|Estimated speed:|Estimated opening half-angle:|Direction \(lon\.\/lat\.\):|$)/i,
  );

  if (summaryMatch?.[1]) {
    return summaryMatch[1].trim();
  }

  return cleanedText;
}

/**
 * Extracts affected assets from a DONKI notification headline.
 * @param {string} cleanedText
 * @returns {string[]}
 */
function extractAffectedAssets(cleanedText) {
  const match = cleanedText.match(
    /Message Type:\s*Space Weather Notification\s*-\s*[^()]+\(([^)]+)\)/i,
  );

  return match?.[1]
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

/**
 * Normalizes a DONKI notification into a UI-ready weather alert.
 * @param {Record<string, unknown>} entry
 * @param {number} index
 * @returns {Record<string, unknown>}
 */
function normalizeWeatherEntry(entry, index) {
  const cleanedText = cleanWeatherText(
    entry.note ??
      entry.messageBody ??
      entry.classType ??
      entry.messageType ??
      entry.description ??
      '',
  );
  const code = extractWeatherCode(entry, cleanedText);
  const title = String(entry.classType ?? WEATHER_LABELS[code] ?? 'Space Weather Alert');
  const issuedAt = String(
    entry.messageIssueDate ??
      entry.messageIssueTime ??
      entry.beginTime ??
      entry.startTime ??
      entry.eventTime ??
      '',
  );
  const summary = extractSummary(cleanedText);
  const affectedAssets = extractAffectedAssets(cleanedText);
  const sourceLocation =
    String(entry.sourceLocation ?? '').trim() || 'DONKI analyzed notification';
  const sortTime = Number.isNaN(new Date(issuedAt).getTime())
    ? 0
    : new Date(issuedAt).getTime();

  return {
    id: String(entry.activityID ?? entry.messageID ?? `${code}-${issuedAt || index}`),
    code,
    title,
    issuedAt,
    sourceLocation,
    summary,
    detail: cleanedText,
    affectedAssets,
    link: entry.link ?? null,
    sortTime,
  };
}

/**
 * Summarizes raw DONKI notifications down to the latest alert per event class.
 * This removes repetitive update chains and makes the "today" panel more legible.
 * @param {Array<Record<string, unknown>>} entries
 * @returns {Array<Record<string, unknown>>}
 */
function summarizeDonki(entries) {
  const normalizedEntries = entries
    .map((entry, index) => normalizeWeatherEntry(entry, index))
    .sort((left, right) => right.sortTime - left.sortTime);

  const latestByCode = new Map();

  normalizedEntries.forEach((entry) => {
    if (!latestByCode.has(entry.code)) {
      latestByCode.set(entry.code, entry);
    }
  });

  return [...latestByCode.values()].sort((left, right) => right.sortTime - left.sortTime).slice(0, 5);
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
  const [donki, setDonki] = useState(
    cachedPayload?.donki ?? summarizeDonki(donkiFallback),
  );
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
          ? summarizeDonki(donkiJson)
          : summarizeDonki(donkiFallback);

        setApod(apodItems.length ? apodItems : nasaApodFallback);
        setDonki(donkiItems.length ? donkiItems : summarizeDonki(donkiFallback));
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            apod: apodItems,
            donki: donkiItems,
          }),
        );
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : 'NASA feed unavailable',
        );
        setApod(nasaApodFallback);
        setDonki(summarizeDonki(donkiFallback));
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [today]);

  return { loading, apod, donki, error };
}

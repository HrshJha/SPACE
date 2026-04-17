import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useCosmosStore } from '../store/useCosmosStore.js';
import { clamp } from '../utils/cosmicMath.js';

/**
 * Creates a short WAV data URI for Howler one-shots.
 * @param {number} frequency
 * @param {number} durationMs
 * @returns {string}
 */
function buildToneDataUri(frequency, durationMs) {
  const sampleRate = 22050;
  const sampleCount = Math.floor((sampleRate * durationMs) / 1000);
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let index = 0; index < string.length; index += 1) {
      view.setUint8(offset + index, string.charCodeAt(index));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, sampleCount * 2, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const envelope = Math.exp(-time * 10);
    const sample = Math.sin(2 * Math.PI * frequency * time) * envelope;
    view.setInt16(44 + index * 2, sample * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return `data:audio/wav;base64,${btoa(binary)}`;
}

/**
 * Builds and controls the ambient audio field.
 * @returns {{
 * toggleAudio: () => Promise<void>,
 * playInteraction: (kind?: 'click' | 'warp') => void
 * }}
 */
export function useAmbientSound() {
  const audioEnabled = useCosmosStore((state) => state.audioEnabled);
  const activeZone = useCosmosStore((state) => state.activeZone);
  const horizonApproach = useCosmosStore((state) => state.horizonApproach);
  const blackHoleMass = useCosmosStore((state) => state.blackHoleMass);
  const setAudioEnabled = useCosmosStore((state) => state.setAudioEnabled);
  const setSoundReady = useCosmosStore((state) => state.setSoundReady);
  const contextRef = useRef(null);
  const layersRef = useRef([]);
  const oneShotsRef = useRef(null);

  const ensureContext = useCallback(async () => {
    if (contextRef.current) {
      return contextRef.current;
    }

    const context = new window.AudioContext();
    const master = context.createGain();
    master.gain.value = 0.18;
    master.connect(context.destination);

    const frequencies = [40, 280, 72, 540, 164];
    const layers = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.04 : 0.015;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();

      return { oscillator, gain, baseFrequency: frequency };
    });

    layersRef.current = layers;
    contextRef.current = context;
    setSoundReady(true);
    oneShotsRef.current = {
      click: new Howl({
        src: [buildToneDataUri(660, 120)],
        volume: 0.16,
      }),
      warp: new Howl({
        src: [buildToneDataUri(120, 420)],
        volume: 0.22,
      }),
      gravity: new Howl({
        src: [buildToneDataUri(220, 260)],
        volume: 0.18,
      }),
    };

    return context;
  }, [setSoundReady]);

  useEffect(() => {
    if (!audioEnabled || !layersRef.current.length) {
      return;
    }

    const zoneBias = {
      hero: 1,
      solar: 1.08,
      blackhole: 0.72,
      timeline: 0.88,
      missions: 1.02,
      constellations: 1.04,
      contact: 0.95,
    }[activeZone];
    const blackHoleSilence =
      activeZone === 'blackhole'
        ? clamp(1 - horizonApproach * 0.45 - blackHoleMass / 500, 0.32, 1)
        : 1;

    layersRef.current.forEach((layer, index) => {
      const target =
        index === 0
          ? 0.04 * blackHoleSilence
          : clamp(
              (zoneBias * (0.02 - index * 0.002)) / 1.1 * blackHoleSilence,
              0.003,
              0.02,
            );
      layer.gain.gain.linearRampToValueAtTime(
        target,
        contextRef.current.currentTime + 0.5,
      );
      layer.oscillator.frequency.linearRampToValueAtTime(
        layer.baseFrequency * zoneBias * blackHoleSilence,
        contextRef.current.currentTime + 0.5,
      );
    });
  }, [activeZone, audioEnabled, blackHoleMass, horizonApproach]);

  useEffect(
    () => () => {
      layersRef.current.forEach(({ oscillator }) => oscillator.stop());
      contextRef.current?.close();
    },
    [],
  );

  const toggleAudio = useCallback(async () => {
    const context = await ensureContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    setAudioEnabled(!audioEnabled);

    layersRef.current.forEach((layer, index) => {
      const target = !audioEnabled
        ? index === 0
          ? 0.04
          : 0.015
        : 0;
      layer.gain.gain.linearRampToValueAtTime(
        target,
        context.currentTime + 0.5,
      );
    });
  }, [audioEnabled, ensureContext, setAudioEnabled]);

  const playInteraction = useCallback((kind = 'click') => {
    if (!audioEnabled || !oneShotsRef.current) {
      return;
    }

    oneShotsRef.current[kind]?.play();
  }, [audioEnabled]);

  return { toggleAudio, playInteraction };
}

const NEW_LINE = String.fromCharCode(10);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function clampUuidQuantity(value, { min = 1, max = 1000 } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.max(min, Math.min(max, Math.trunc(parsed)));
}

export function createUuidV4(randomProvider = globalThis.crypto) {
  if (randomProvider?.randomUUID) return randomProvider.randomUUID();
  if (!randomProvider?.getRandomValues) throw new Error('Secure random generation is unavailable in this browser.');

  const bytes = randomProvider.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return [...bytes].map((byte, index) => {
    const separator = [4, 6, 8, 10].includes(index) ? '-' : '';
    return separator + byte.toString(16).padStart(2, '0');
  }).join('');
}

export function generateUuids(quantity, randomProvider = globalThis.crypto) {
  const count = clampUuidQuantity(quantity);
  return Array.from({ length: count }, () => createUuidV4(randomProvider));
}

export function formatUuidList(uuids) {
  return uuids.join(NEW_LINE);
}

export function isUuidV4(value) {
  return UUID_PATTERN.test(String(value ?? ''));
}

// Pembatasan percobaan login di sisi klien.
// Tahap 1: 5 kali gagal -> tunggu 2 menit. Tahap berikutnya: 5 kali gagal lagi -> tunggu 5 menit.
// Jika server membalas 429, durasi dari server (Retry-After) yang dipakai.

const STORAGE_KEY = 'login_throttle';

export const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATIONS = [2 * 60, 5 * 60]; // detik

const emptyState = { failures: 0, level: 0, lockedUntil: 0 };

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...emptyState, ...saved } : { ...emptyState };
  } catch {
    return { ...emptyState };
  }
}

function writeState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan tidak tersedia (mode privat); pembatasan hanya berlaku selama halaman terbuka.
  }
}

// Sisa detik penguncian, 0 jika tidak sedang terkunci.
export function getLockRemaining() {
  const { lockedUntil } = readState();
  return Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
}

export function getRemainingAttempts() {
  return MAX_LOGIN_ATTEMPTS - readState().failures;
}

// Catat satu kegagalan login. Mengembalikan lama penguncian (detik) jika batas tercapai, selain itu 0.
export function registerFailedAttempt() {
  const state = readState();
  state.failures += 1;

  if (state.failures < MAX_LOGIN_ATTEMPTS) {
    writeState(state);
    return 0;
  }

  const duration = LOCK_DURATIONS[Math.min(state.level, LOCK_DURATIONS.length - 1)];
  writeState({
    failures: 0,
    level: state.level + 1,
    lockedUntil: Date.now() + duration * 1000,
  });
  return duration;
}

// Kunci berdasarkan respons 429 dari server.
export function lockFor(seconds) {
  const state = readState();
  writeState({ ...state, failures: 0, lockedUntil: Date.now() + seconds * 1000 });
}

export function resetLoginThrottle() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
}

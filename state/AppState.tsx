import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { createMMKV, type MMKV } from 'react-native-mmkv';

export type SubstanceType = 'weed' | 'nicotine';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';
export type DayStatus = 'clean' | 'relapse' | 'craving_fought' | 'none';

export interface UserSettings {
  currency: CurrencyCode;
  weedDailyBudget: number;
  nicotineDailyBudget: number;
  biometricsEnabled: boolean;
  maskInSwitcher: boolean;
  onboardingComplete: boolean;
}

export interface SubstanceProfile {
  substance: SubstanceType;
  enabled: boolean;
  quitDate: string;
}

export interface CravingLog {
  id: string;
  substance_type: SubstanceType;
  logged_at: string;
  intensity: number;
  trigger: string;
  outcome: 'defeated' | 'relapse';
  notes?: string;
}

export interface RelapseLog {
  id: string;
  substance_type: SubstanceType;
  relapsed_at: string;
  streak_lost_seconds: number;
  trigger?: string;
  intensity?: number;
  notes?: string;
}

export interface AppData {
  version: string;
  settings: UserSettings;
  profiles: Record<SubstanceType, SubstanceProfile>;
  craving_logs: CravingLog[];
  relapse_logs: RelapseLog[];
}

export interface OnboardingPayload {
  enabledSubstances: SubstanceType[];
  quitDates: Record<SubstanceType, string>;
  currency: CurrencyCode;
  weedDailyBudget: number;
  nicotineDailyBudget: number;
  biometricsEnabled: boolean;
  maskInSwitcher: boolean;
}

interface AppStateValue {
  data: AppData;
  activeSubstance: SubstanceType;
  setActiveSubstance: (substance: SubstanceType) => void;
  completeOnboarding: (payload: OnboardingPayload) => void;
  updateFinancialSettings: (weedBudget: number, nicotineBudget: number, currency: CurrencyCode) => void;
  updatePrivacySettings: (settings: Partial<Pick<UserSettings, 'biometricsEnabled' | 'maskInSwitcher'>>) => void;
  logCraving: (input: Omit<CravingLog, 'id' | 'logged_at' | 'outcome'> & { notes?: string }) => void;
  logRelapse: (input: Omit<RelapseLog, 'id' | 'relapsed_at' | 'streak_lost_seconds'> & { notes?: string }) => void;
  resetDemoData: () => void;
  exportBackup: () => AppData;
  restoreBackup: (payload: unknown) => boolean;
}

type State = {
  data: AppData;
  activeSubstance: SubstanceType;
};

type Action =
  | { type: 'hydrate'; data: AppData }
  | { type: 'set_active_substance'; substance: SubstanceType }
  | { type: 'complete_onboarding'; payload: OnboardingPayload }
  | { type: 'update_financials'; weedBudget: number; nicotineBudget: number; currency: CurrencyCode }
  | { type: 'update_privacy'; settings: Partial<Pick<UserSettings, 'biometricsEnabled' | 'maskInSwitcher'>> }
  | { type: 'log_craving'; input: Omit<CravingLog, 'id' | 'logged_at' | 'outcome'> & { notes?: string } }
  | { type: 'log_relapse'; input: Omit<RelapseLog, 'id' | 'relapsed_at' | 'streak_lost_seconds'> & { notes?: string } }
  | { type: 'restore'; data: AppData }
  | { type: 'reset_demo' };

const STORAGE_KEY = 'rewire.local.app-data.v1';
const ACTIVE_SUBSTANCE_KEY = 'rewire.local.active-substance.v1';
const storage = createStorage();

const nowMinus = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const initialData: AppData = {
  version: '1.0.0',
  settings: {
    currency: 'INR',
    weedDailyBudget: 450,
    nicotineDailyBudget: 200,
    biometricsEnabled: false,
    maskInSwitcher: true,
    onboardingComplete: false,
  },
  profiles: {
    weed: {
      substance: 'weed',
      enabled: true,
      quitDate: nowMinus(3.6),
    },
    nicotine: {
      substance: 'nicotine',
      enabled: true,
      quitDate: nowMinus(2.2),
    },
  },
  craving_logs: [],
  relapse_logs: [],
};

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

function createStorage(): KeyValueStorage {
  try {
    return createMMKV({ id: 'rewire.local' }) as MMKV;
  } catch {
    const memory = new Map<string, string>();
    return {
      getString: key => memory.get(key),
      set: (key, value) => {
        memory.set(key, value);
      },
    };
  }
}

function loadStoredData(): AppData | null {
  try {
    const raw = storage.getString(STORAGE_KEY);
    return raw ? normalizeBackup(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function saveStoredData(data: AppData) {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Keep the in-memory state active if the native store is unavailable.
  }
}

function loadStoredActiveSubstance(data: AppData): SubstanceType {
  try {
    const stored = storage.getString(ACTIVE_SUBSTANCE_KEY) as SubstanceType | undefined;
    return stored && data.profiles[stored]?.enabled ? stored : getFirstEnabledSubstance(data);
  } catch {
    return getFirstEnabledSubstance(data);
  }
}

function saveStoredActiveSubstance(substance: SubstanceType) {
  try {
    storage.set(ACTIVE_SUBSTANCE_KEY, substance);
  } catch {
    // Active tab/substance preference is non-critical.
  }
}

function createInitialState(): State {
  const data = loadStoredData() ?? initialData;
  return {
    data,
    activeSubstance: loadStoredActiveSubstance(data),
  };
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function secondsBetween(startISO: string, endISO = new Date().toISOString()) {
  return Math.max(0, Math.floor((new Date(endISO).getTime() - new Date(startISO).getTime()) / 1000));
}

function normalizeBackup(payload: unknown): AppData | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const candidate = payload as Partial<AppData>;
  if (!candidate.settings || !candidate.profiles || !Array.isArray(candidate.craving_logs) || !Array.isArray(candidate.relapse_logs)) {
    return null;
  }

  const settings = candidate.settings as UserSettings;
  const profiles = candidate.profiles as Record<SubstanceType, SubstanceProfile>;

  if (!profiles.weed?.quitDate || !profiles.nicotine?.quitDate) {
    return null;
  }

  const weedEnabled = profiles.weed.enabled !== false;
  const nicotineEnabled = profiles.nicotine.enabled !== false;

  return {
    version: typeof candidate.version === 'string' ? candidate.version : '1.0.0',
    settings: {
      currency: settings.currency || 'INR',
      weedDailyBudget: Number(settings.weedDailyBudget) || 0,
      nicotineDailyBudget: Number(settings.nicotineDailyBudget) || 0,
      biometricsEnabled: Boolean(settings.biometricsEnabled),
      maskInSwitcher: settings.maskInSwitcher !== false,
      onboardingComplete: Boolean(settings.onboardingComplete),
    },
    profiles: {
      weed: { substance: 'weed', enabled: weedEnabled || !nicotineEnabled, quitDate: profiles.weed.quitDate },
      nicotine: { substance: 'nicotine', enabled: nicotineEnabled, quitDate: profiles.nicotine.quitDate },
    },
    craving_logs: candidate.craving_logs as CravingLog[],
    relapse_logs: candidate.relapse_logs as RelapseLog[],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { data: action.data, activeSubstance: loadStoredActiveSubstance(action.data) };
    case 'set_active_substance':
      return { ...state, activeSubstance: action.substance };
    case 'complete_onboarding': {
      const { payload } = action;
      const data: AppData = {
        ...state.data,
        settings: {
          ...state.data.settings,
          currency: payload.currency,
          weedDailyBudget: payload.weedDailyBudget,
          nicotineDailyBudget: payload.nicotineDailyBudget,
          biometricsEnabled: payload.biometricsEnabled,
          maskInSwitcher: payload.maskInSwitcher,
          onboardingComplete: true,
        },
        profiles: {
          weed: {
            substance: 'weed',
            enabled: payload.enabledSubstances.includes('weed'),
            quitDate: payload.quitDates.weed,
          },
          nicotine: {
            substance: 'nicotine',
            enabled: payload.enabledSubstances.includes('nicotine'),
            quitDate: payload.quitDates.nicotine,
          },
        },
      };
      const activeSubstance = data.profiles[state.activeSubstance].enabled ? state.activeSubstance : payload.enabledSubstances[0] || 'weed';
      return { data, activeSubstance };
    }
    case 'update_financials':
      return {
        ...state,
        data: {
          ...state.data,
          settings: {
            ...state.data.settings,
            weedDailyBudget: action.weedBudget,
            nicotineDailyBudget: action.nicotineBudget,
            currency: action.currency,
          },
        },
      };
    case 'update_privacy':
      return {
        ...state,
        data: {
          ...state.data,
          settings: { ...state.data.settings, ...action.settings },
        },
      };
    case 'log_craving': {
      const log: CravingLog = {
        id: createId('craving'),
        logged_at: new Date().toISOString(),
        outcome: 'defeated',
        ...action.input,
      };
      return {
        ...state,
        data: {
          ...state.data,
          craving_logs: [log, ...state.data.craving_logs],
        },
      };
    }
    case 'log_relapse': {
      const profile = state.data.profiles[action.input.substance_type];
      const relapsedAt = new Date().toISOString();
      const log: RelapseLog = {
        id: createId('relapse'),
        relapsed_at: relapsedAt,
        streak_lost_seconds: secondsBetween(profile.quitDate, relapsedAt),
        ...action.input,
      };
      return {
        ...state,
        data: {
          ...state.data,
          profiles: {
            ...state.data.profiles,
            [action.input.substance_type]: {
              ...profile,
              quitDate: relapsedAt,
            },
          },
          relapse_logs: [log, ...state.data.relapse_logs],
        },
      };
    }
    case 'restore':
      return { data: action.data, activeSubstance: getFirstEnabledSubstance(action.data) };
    case 'reset_demo':
      return { data: initialData, activeSubstance: 'weed' };
    default:
      return state;
  }
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    saveStoredData(state.data);
  }, [state.data]);

  useEffect(() => {
    saveStoredActiveSubstance(state.activeSubstance);
  }, [state.activeSubstance]);

  const restoreBackup = useCallback((payload: unknown) => {
    const normalized = normalizeBackup(payload);
    if (!normalized) {
      return false;
    }
    dispatch({ type: 'restore', data: normalized });
    return true;
  }, []);

  const value = useMemo<AppStateValue>(() => ({
    data: state.data,
    activeSubstance: state.activeSubstance,
    setActiveSubstance: substance => dispatch({ type: 'set_active_substance', substance }),
    completeOnboarding: payload => dispatch({ type: 'complete_onboarding', payload }),
    updateFinancialSettings: (weedBudget, nicotineBudget, currency) => dispatch({ type: 'update_financials', weedBudget, nicotineBudget, currency }),
    updatePrivacySettings: settings => dispatch({ type: 'update_privacy', settings }),
    logCraving: input => dispatch({ type: 'log_craving', input }),
    logRelapse: input => dispatch({ type: 'log_relapse', input }),
    resetDemoData: () => dispatch({ type: 'reset_demo' }),
    exportBackup: () => state.data,
    restoreBackup,
  }), [restoreBackup, state.activeSubstance, state.data]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

export function getDailyBudget(data: AppData, substance: SubstanceType) {
  return substance === 'weed' ? data.settings.weedDailyBudget : data.settings.nicotineDailyBudget;
}

export function getStreakSeconds(data: AppData, substance: SubstanceType) {
  return secondsBetween(data.profiles[substance].quitDate);
}

export function getMoneySaved(data: AppData, substance: SubstanceType) {
  return Math.floor((getStreakSeconds(data, substance) / 86400) * getDailyBudget(data, substance));
}

export function getCravingsForSubstance(data: AppData, substance: SubstanceType) {
  return data.craving_logs.filter(log => log.substance_type === substance);
}

export function getRelapsesForSubstance(data: AppData, substance: SubstanceType) {
  return data.relapse_logs.filter(log => log.substance_type === substance);
}

export function getCalendarStatuses(data: AppData, substance: SubstanceType, monthDate = new Date()) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const statuses: Record<number, DayStatus> = {};
  const quitDate = new Date(data.profiles[substance].quitDate);
  const today = new Date();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day, 12);
    if (date > today || date < startOfDay(quitDate)) {
      statuses[day] = 'none';
    } else {
      statuses[day] = 'clean';
    }
  }

  data.craving_logs
    .filter(log => log.substance_type === substance)
    .forEach(log => {
      const date = new Date(log.logged_at);
      if (date.getFullYear() === year && date.getMonth() === month) {
        statuses[date.getDate()] = 'craving_fought';
      }
    });

  data.relapse_logs
    .filter(log => log.substance_type === substance)
    .forEach(log => {
      const date = new Date(log.relapsed_at);
      if (date.getFullYear() === year && date.getMonth() === month) {
        statuses[date.getDate()] = 'relapse';
      }
    });

  return statuses;
}

export function getTriggerBreakdown(data: AppData, substance: SubstanceType) {
  const logs = getCravingsForSubstance(data, substance);
  const counts = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.trigger] = (acc[log.trigger] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: logs.length ? Math.round((count / logs.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getFirstEnabledSubstance(data: AppData): SubstanceType {
  return data.profiles.weed.enabled ? 'weed' : 'nicotine';
}

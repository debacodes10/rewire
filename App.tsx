import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState as RNAppState, AppStateStatus, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Analytics from './screens/Analytics';
import Dashboard from './screens/Dashboard';
import Onboarding from './screens/Onboarding';
import Settings from './screens/Settings';
import { AppStateProvider, useAppState } from './state/AppState';
import { authenticateForAppUnlock, getLocalAuthLabel } from './services/localAuth';

type TabName = 'dashboard' | 'analytics' | 'settings';

export default function App() {
  return (
    <AppStateProvider>
      <SafeAreaProvider>
        <AppShell />
      </SafeAreaProvider>
    </AppStateProvider>
  );
}

function AppShell() {
  const { data, activeSubstance, setActiveSubstance, completeOnboarding, updatePrivacySettings } = useAppState();
  const [currentTab, setCurrentTab] = useState<TabName>('dashboard');
  const [isLocked, setIsLocked] = useState(data.settings.biometricsEnabled);
  const [isSnapshotMasked, setIsSnapshotMasked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | undefined>();
  const appStateRef = useRef<AppStateStatus>(RNAppState.currentState);
  const authInProgressRef = useRef(false);

  useEffect(() => {
    if (!data.settings.biometricsEnabled) {
      setIsLocked(false);
    }
  }, [data.settings.biometricsEnabled]);

  useEffect(() => {
    const subscription = RNAppState.addEventListener('change', (nextState: AppStateStatus) => {
      const previousState = appStateRef.current;
      const inactive = nextState === 'inactive' || nextState === 'background';
      setIsSnapshotMasked(Boolean(data.settings.maskInSwitcher && inactive));

      if (
        nextState === 'active' &&
        previousState === 'background' &&
        data.settings.biometricsEnabled &&
        !authInProgressRef.current
      ) {
        setIsLocked(true);
      }

      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, [data.settings.biometricsEnabled, data.settings.maskInSwitcher]);

  const handleUnlock = async () => {
    if (isUnlocking) {
      return;
    }

    setIsUnlocking(true);
    authInProgressRef.current = true;
    setUnlockError(undefined);

    try {
      const result = await authenticateForAppUnlock();

      if (result.success) {
        setIsLocked(false);
        return;
      }

      const authLabel = getLocalAuthLabel(result.biometryType);
      setUnlockError(result.error || `Could not verify ${authLabel}. Try again or use your device passcode.`);
    } finally {
      authInProgressRef.current = false;
      setIsUnlocking(false);
    }
  };

  const handleDisableAppLock = () => {
    Alert.alert(
      'Disable app lock?',
      'This will turn off the local app lock on this device so you can get back into Rewire. You can re-enable it from Settings after checking Face ID, Touch ID, or your device passcode.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable Lock',
          style: 'destructive',
          onPress: () => {
            updatePrivacySettings({ biometricsEnabled: false });
            setUnlockError(undefined);
            setIsLocked(false);
          },
        },
      ],
    );
  };

  if (!data.settings.onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.workspace}>
        <View style={currentTab === 'dashboard' ? styles.visibleScreen : styles.hiddenScreen}>
          <Dashboard
            currentSubstance={activeSubstance}
            onSubstanceChange={setActiveSubstance}
          />
        </View>

        <View style={currentTab === 'analytics' ? styles.visibleScreen : styles.hiddenScreen}>
          <Analytics
            currentSubstance={activeSubstance}
            onSubstanceChange={setActiveSubstance}
          />
        </View>

        <View style={currentTab === 'settings' ? styles.visibleScreen : styles.hiddenScreen}>
          <Settings />
        </View>
      </View>

      <View style={styles.floatingNavContainer}>
        <View style={styles.navBar}>
          <NavButton active={currentTab === 'dashboard'} icon="⚡" label="Dashboard" onPress={() => setCurrentTab('dashboard')} />
          <NavButton active={currentTab === 'analytics'} icon="📊" label="Insights" onPress={() => setCurrentTab('analytics')} />
          <NavButton active={currentTab === 'settings'} icon="⚙️" label="Settings" onPress={() => setCurrentTab('settings')} />
        </View>
      </View>

      {isSnapshotMasked && <PrivacyMask />}
      {isLocked && data.settings.biometricsEnabled && (
        <LockOverlay
          error={unlockError}
          isUnlocking={isUnlocking}
          onDisableAppLock={handleDisableAppLock}
          onUnlock={handleUnlock}
        />
      )}
    </View>
  );
}

function NavButton({ active, icon, label, onPress }: { active: boolean; icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.activeIcon]}>{icon}</Text>
      <Text style={[styles.navText, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

function LockOverlay({
  error,
  isUnlocking,
  onDisableAppLock,
  onUnlock,
}: {
  error?: string;
  isUnlocking: boolean;
  onDisableAppLock: () => void;
  onUnlock: () => void;
}) {
  return (
    <View style={styles.lockOverlay}>
      <View style={styles.lockCard}>
        <Text style={styles.lockTitle}>Rewire Locked</Text>
        <Text style={styles.lockSubtitle}>
          Confirm Face ID, Touch ID, or your device passcode to continue.
        </Text>
        {error && <Text style={styles.lockError}>{error}</Text>}
        <TouchableOpacity activeOpacity={0.85} style={styles.unlockButton} onPress={onUnlock}>
          {isUnlocking ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.unlockButtonText}>Unlock Rewire</Text>
          )}
        </TouchableOpacity>
        {error && (
          <TouchableOpacity activeOpacity={0.8} style={styles.disableLockButton} onPress={onDisableAppLock}>
            <Text style={styles.disableLockText}>Disable app lock on this device</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function PrivacyMask() {
  return (
    <View style={styles.maskOverlay}>
      <Text style={styles.maskTitle}>Rewire</Text>
      <Text style={styles.maskSubtitle}>Private snapshot protected</Text>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  workspace: {
    flex: 1,
  },
  visibleScreen: {
    flex: 1,
    display: 'flex',
  },
  hiddenScreen: {
    display: 'none',
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  navBar: {
    flexDirection: 'row',
    width: width - 48,
    backgroundColor: 'rgba(28, 28, 30, 0.96)',
    borderRadius: 28,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.4,
    marginBottom: 3,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.08 }],
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 15, 16, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockCard: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 24,
    alignItems: 'center',
  },
  lockTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  lockSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  lockError: {
    color: '#FF453A',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
    textAlign: 'center',
  },
  unlockButton: {
    marginTop: 22,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 15,
  },
  disableLockButton: {
    marginTop: 14,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  disableLockText: {
    color: '#FF9F0A',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  maskOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F0F10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  maskSubtitle: {
    color: '#8E8E93',
    marginTop: 6,
    fontWeight: '600',
  },
});

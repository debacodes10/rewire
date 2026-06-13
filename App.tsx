import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screen Imports
import Dashboard from './screens/Dashboard';
import Analytics from './screens/Analytics';
import Settings from './screens/Settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');

  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        
        {/* 
          Fixed Component Matrix Stack: 
          All hooks are evaluated in a fixed, permanent order on initial boot.
          We use conditional styling properties to show/hide them instead.
        */}
        <View style={styles.workspace}>
          <View style={currentTab === 'dashboard' ? styles.visibleScreen : styles.hiddenScreen}>
            <Dashboard />
          </View>
          
          <View style={currentTab === 'analytics' ? styles.visibleScreen : styles.hiddenScreen}>
            <Analytics />
          </View>
          
          <View style={currentTab === 'settings' ? styles.visibleScreen : styles.hiddenScreen}>
            <Settings />
          </View>
        </View>

        {/* Premium Floating Rounded Bottom Tab Bar */}
        <View style={styles.floatingNavContainer}>
          <View style={styles.navBar}>
            
            {/* Tab 1: Dashboard */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.navItem}
              onPress={() => setCurrentTab('dashboard')}
            >
              <Text style={[styles.navIcon, currentTab === 'dashboard' && styles.activeIcon]}>⚡</Text>
              <Text style={[styles.navText, currentTab === 'dashboard' && styles.activeText]}>
                Dashboard
              </Text>
            </TouchableOpacity>

            {/* Tab 2: Analytics */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.navItem}
              onPress={() => setCurrentTab('analytics')}
            >
              <Text style={[styles.navIcon, currentTab === 'analytics' && styles.activeIcon]}>📊</Text>
              <Text style={[styles.navText, currentTab === 'analytics' && styles.activeText]}>
                Insights
              </Text>
            </TouchableOpacity>

            {/* Tab 3: Settings */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.navItem}
              onPress={() => setCurrentTab('settings')}
            >
              <Text style={[styles.navIcon, currentTab === 'settings' && styles.activeIcon]}>⚙️</Text>
              <Text style={[styles.navText, currentTab === 'settings' && styles.activeText]}>
                Settings
              </Text>
            </TouchableOpacity>

          </View>
        </View>

      </View>
    </SafeAreaProvider>
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
  // Efficient conditional display styles
  visibleScreen: {
    flex: 1,
    display: 'flex',
  },
  hiddenScreen: {
    display: 'none', // Completely pulls the layout out of the render layout pass while keeping hooks alive
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20, 
    width: width,
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
});
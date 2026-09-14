import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DashboardHeader from './DashboardHeader';
import SidebarDrawer from './SidebarDrawer';
import BottomTabBar from './BottomTabBar';
import ProfileCompletionBanner from './ProfileCompletionBanner';
import CreatorInviteBanner from './CreatorInviteBanner';

interface DashboardLayoutProps {
  title?: string;
  activeTab: string;
  children: React.ReactNode;
  showBanners?: boolean;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showBack?: boolean;
  onBack?: () => void;
  hideBottomBar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  activeTab,
  children,
  showBanners = false,
  scrollable = true,
  contentContainerStyle,
  showBack = false,
  onBack,
  hideBottomBar = false,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={[styles.root, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
      />

      {/* Top Header */}
      <DashboardHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
      />

      {/* Banners (conditional, e.g. on Home / Dashboard) */}
      {showBanners && (
        <View style={styles.bannersWrap}>
          <ProfileCompletionBanner />
          <CreatorInviteBanner />
        </View>
      )}

      {/* Screen Content Body */}
      <KeyboardAvoidingView
        style={styles.contentWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.plainContent, contentContainerStyle]}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Tab Bar */}
      {!hideBottomBar && <BottomTabBar activeTab={activeTab} />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bannersWrap: {
    paddingBottom: 2,
  },
  contentWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  plainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default DashboardLayout;

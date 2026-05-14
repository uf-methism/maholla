import { StyleSheet, Text, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';

interface SettingsItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  description: string;
  colors: typeof Colors.light;
}

function SettingsItem({ icon, label, description, colors }: SettingsItemProps) {
  return (
    <Pressable
      style={[
        styles.settingsItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
        SHADOWS.sm,
      ]}>
      <View style={[styles.settingsIcon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={[styles.settingsLabel, { color: colors.text }]}>
          {label}
        </Text>
        <Text style={[styles.settingsDesc, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const settingsItems: Omit<SettingsItemProps, 'colors'>[] = [
    { icon: 'storefront', label: 'Store Profile', description: 'Name, category, address, timings' },
    { icon: 'qr-code', label: 'UPI QR Code', description: 'Upload or generate your payment QR' },
    { icon: 'notifications', label: 'Notifications', description: 'Order alerts, low stock reminders' },
    { icon: 'language', label: 'Language', description: 'App language preference' },
    { icon: 'help-circle', label: 'Help & Support', description: 'FAQs, contact support' },
    { icon: 'information-circle', label: 'About Mohalla', description: 'Version, terms, privacy' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.list}>
        {settingsItems.map((item, i) => (
          <SettingsItem key={i} {...item} colors={colors} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  list: {
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  settingsDesc: {
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
});

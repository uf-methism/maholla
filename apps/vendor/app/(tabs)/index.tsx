import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          Welcome back 👋
        </Text>
        <Text style={[styles.storeName, { color: colors.text }]}>
          Your Store
        </Text>
      </View>

      {/* Store Status Card */}
      <View style={[styles.statusCard, { backgroundColor: colors.primary }]}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Ionicons name="storefront" size={24} color="#fff" />
            <Text style={styles.statusLabel}>Store Status</Text>
            <Text style={styles.statusValue}>Closed</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Ionicons name="today" size={24} color="#fff" />
            <Text style={styles.statusLabel}>Today's Orders</Text>
            <Text style={styles.statusValue}>0</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Quick Actions
      </Text>
      <View style={styles.actionsGrid}>
        {[
          { icon: 'mic' as const, label: 'Voice Add', desc: 'Add stock by speaking' },
          { icon: 'add-circle' as const, label: 'Add Product', desc: 'Add manually' },
          { icon: 'qr-code' as const, label: 'My UPI QR', desc: 'Show to customers' },
          { icon: 'share-social' as const, label: 'Share Store', desc: 'WhatsApp link' },
        ].map((action, i) => (
          <View
            key={i}
            style={[
              styles.actionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              SHADOWS.sm,
            ]}>
            <Ionicons name={action.icon} size={28} color={colors.primary} />
            <Text style={[styles.actionLabel, { color: colors.text }]}>
              {action.label}
            </Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              {action.desc}
            </Text>
          </View>
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
  header: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
  },
  storeName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: SPACING.xs,
  },
  statusCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statusLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.sm,
  },
  statusValue: {
    color: '#fff',
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '47%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  actionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.xs,
  },
  actionDesc: {
    fontSize: FONT_SIZE.xs,
  },
});

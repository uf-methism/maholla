import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Empty State */}
      <View style={styles.emptyState}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="receipt-outline" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Orders Yet
        </Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          When customers order via WhatsApp or the Mohalla app, their orders will appear here for you to confirm.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
  },
  emptyDesc: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});

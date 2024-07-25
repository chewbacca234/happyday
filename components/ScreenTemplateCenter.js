import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, colors, headerHeight } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

export function ScreenTemplateCenter({ children }) {
  const safeInsetTop = useSafeAreaInsets().top;
  const safeInsetBottom = useSafeAreaInsets().bottom;

  return (
    <LinearGradient
      style={{
        ...styles.gradient,
        paddingTop: safeInsetTop + headerHeight,
        paddingBottom: safeInsetBottom,
      }}
      {...colors.primaryGradientProps}
    >
      <View style={styles.containerCenter}>{children}</View>
    </LinearGradient>
  );
}

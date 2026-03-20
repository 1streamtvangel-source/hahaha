import { useRef, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export function useListAnimations() {
  const lastScrollY = useRef(0);

  const scrollY = useSharedValue(0);
  const fabExpanded = useSharedValue(1);
  const showScrollTopAnim = useSharedValue(0);

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const y = event.nativeEvent.contentOffset.y;
      scrollY.value = y;

      const scrollDiff = y - lastScrollY.current;
      const isScrollingDown = scrollDiff > 5;
      const isScrollingUp = scrollDiff < -5;

      if (y > 50) {
        if (isScrollingDown) {
          fabExpanded.value = withTiming(0, { duration: 200 });
          showScrollTopAnim.value = withTiming(0, { duration: 200 });
        } else if (isScrollingUp) {
          fabExpanded.value = withTiming(1, { duration: 200 });
          showScrollTopAnim.value = withTiming(1, { duration: 200 });
        }
      } else {
        fabExpanded.value = withTiming(1, { duration: 200 });
        showScrollTopAnim.value = withTiming(0, { duration: 200 });
      }

      lastScrollY.current = y;
    },
    [scrollY, fabExpanded, showScrollTopAnim]
  );

  // Scroll-to-top button: scale + fade + slide up
  const scrollTopAnimatedStyle = useAnimatedStyle(() => ({
    opacity: showScrollTopAnim.value,
    transform: [
      { scale: showScrollTopAnim.value },
      { translateY: interpolate(showScrollTopAnim.value, [0, 1], [20, 0]) },
    ],
  }));

  // Filter pill: morphs from 52px circle to 130px pill
  const filterPillAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(fabExpanded.value, [0, 1], [52, 130]),
    paddingLeft: interpolate(fabExpanded.value, [0, 1], [0, 16]),
    paddingRight: interpolate(fabExpanded.value, [0, 1], [0, 14]),
  }));

  // Filter pill text: fades + collapses width
  const filterPillTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabExpanded.value,
    width: interpolate(fabExpanded.value, [0, 1], [0, 55]),
    marginRight: interpolate(fabExpanded.value, [0, 1], [0, 8]),
  }));

  // Title row: collapses height + fades
  const headerRowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabExpanded.value,
    height: interpolate(fabExpanded.value, [0, 1], [0, 44]),
    marginBottom: interpolate(fabExpanded.value, [0, 1], [0, 8]),
    overflow: 'hidden' as const,
  }));

  // Search + chips + sort: collapses together below the title
  const toolbarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabExpanded.value,
    maxHeight: interpolate(fabExpanded.value, [0, 1], [0, 200]),
    marginBottom: interpolate(fabExpanded.value, [0, 1], [0, 8]),
    overflow: 'hidden' as const,
  }));

  return {
    handleScroll,
    scrollTopAnimatedStyle,
    filterPillAnimatedStyle,
    filterPillTextAnimatedStyle,
    headerRowAnimatedStyle,
    toolbarAnimatedStyle,
  };
}

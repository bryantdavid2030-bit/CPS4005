import React from 'react';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
  showWordmark?: boolean;
}

/**
 * HumnSprt mark. Vector so it scales crisply at any density.
 * A simple angular monogram (HS) with a hairline underscore
 * reading as both a minimalist H and the horizon line of a track.
 */
export function Logo({ size = 96, color = '#F4F1EA', showWordmark = true }: LogoProps) {
  const w = size * 2.6;
  const h = size;
  return (
    <Svg width={w} height={h} viewBox="0 0 260 100">
      <G>
        {/* H mark */}
        <Path d="M12 14 L12 78" stroke={color} strokeWidth={3} strokeLinecap="square" />
        <Path d="M46 14 L46 78" stroke={color} strokeWidth={3} strokeLinecap="square" />
        <Path d="M12 46 L46 46" stroke={color} strokeWidth={3} strokeLinecap="square" />
        {/* Ember dot */}
        <Path d="M57 46 l0 0" stroke={color} strokeWidth={6} strokeLinecap="round" />
        {showWordmark && (
          <SvgText
            x={72}
            y={54}
            fill={color}
            fontFamily="PlayfairDisplay-Regular"
            fontSize={28}
            letterSpacing={2}
          >
            HUMN SPRT
          </SvgText>
        )}
        {/* Horizon hairline */}
        <Path d="M12 92 L248 92" stroke={color} strokeWidth={0.8} opacity={0.6} />
      </G>
    </Svg>
  );
}

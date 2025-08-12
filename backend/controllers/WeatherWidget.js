import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fetchWeather } from '../utils/weather';

/**
 * A basic weather widget that retrieves current weather information for
 * a fixed coordinate (Austin, TX) using the `fetchWeather` utility.
 */
export default function WeatherWidget() {
  const { colors } = useTheme();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Coordinates for Austin, Texas
        const lat = 30.266666;
        const lon = -97.73333;
        const data = await fetchWeather(lat, lon);
        setWeather(data);
      } catch (err) {
        console.warn('Weather fetch error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}> 
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (!weather) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}> 
        <Text style={{ color: colors.text }}>Weather data not available.</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}> 
      {weather.icon && (
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
          style={styles.icon}
        />
      )}
      <View style={styles.info}>
        <Text style={{ color: colors.text, fontSize: 16 }}>{weather.city}</Text>
        <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>{weather.temp}°F</Text>
        <Text style={{ color: colors.text, fontSize: 14 }}>{weather.main}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
});

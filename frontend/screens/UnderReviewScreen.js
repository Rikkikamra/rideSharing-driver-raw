import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const UnderReviewScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Under Review</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Your application is under review. We will notify you once a decision is made.
      </Text>
    </View>
  );
};

export default UnderReviewScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  header: { fontSize:24, fontWeight:'bold', marginBottom:10 },
  text: { fontSize:16, textAlign:'center' }
});
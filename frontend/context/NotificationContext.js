import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Display a transient notification.  This helper accepts either
   * an object with `title`, `message` and optional `type` (preferred),
   * or the deprecated `(title, message, type)` signature for
   * backwards compatibility.  All calls eventually normalise into
   * an object before pushing to the notifications queue.
   *
   * Examples:
   *   notify({ title: 'Success', message: 'Saved!', type: 'success' });
   *   notify('Error', 'Something went wrong', 'error');
   */
  const notify = (arg1, arg2, arg3) => {
    let title;
    let message;
    let type = 'info';
    // If first argument is an object, use its fields
    if (typeof arg1 === 'object' && arg1 !== null) {
      ({ title, message, type = 'info' } = arg1);
    } else {
      // Else treat arguments as (title, message, type)
      title = arg1;
      message = arg2;
      if (typeof arg3 === 'string') type = arg3;
    }
    // Ignore invalid calls
    if (!title || !message) return;
    // Generate a stable ID for this notification.  Using a local
    // variable prevents race conditions with setTimeout closures.
    const id = Date.now();
    setNotifications(prev => [
      ...prev,
      { id, title, message, type }
    ]);
    // Auto‑dismiss after 3s; remove this specific notification
    setTimeout(() => {
      setNotifications(current => current.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* 2) Render both title & message */}
      {notifications.map(note => (
        <View key={note.id} style={styles.container}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.message}>{note.message}</Text>
        </View>
      ))}
    </NotificationContext.Provider>
  );
};

// 3) Hook for consuming context
export const useNotification = () => useContext(NotificationContext);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 4,
    zIndex: 999,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#fff',
  },
});

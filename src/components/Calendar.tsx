import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-10 至 2026-03-11');
  return (
    <TouchableOpacity
      style={styles.calendarContainer}
      onPress={() => alert('打开日历选择器（实际项目实现日期选择逻辑）')}
    >
      <Text style={styles.calendarText}>{selectedDate}</Text>
      <Text style={styles.calendarIcon}>📅</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  calendarText: {
    fontSize: 14,
    color: '#333'
  },
  calendarIcon: {
    fontSize: 18
  }
});

export default Calendar;
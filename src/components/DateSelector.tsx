import React from 'react';
import {View, StyleSheet} from 'react-native';
import Calendar from './Calendar';

interface DateSelectorProps {
  startDate: string;
  endDate: string;
  onDateSelect: (start: string, end: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  onDateSelect,
}) => {
  console.log('startDate1', startDate);
  console.log('endDate2', endDate);
  return (
    <View style={styles.container}>
      <Calendar
        onDateSelect={onDateSelect}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default DateSelector;

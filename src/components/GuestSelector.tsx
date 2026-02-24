import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface GuestSelectorProps {
  rooms: number;
  adults: number;
  children: number;
  onRoomsChange: (value: number) => void;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onNumberPress: (type: 'rooms' | 'adults' | 'children') => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  rooms,
  adults,
  children,
  onRoomsChange,
  onAdultsChange,
  onChildrenChange,
  onNumberPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 房间数量 */}
      <View style={styles.guestRow}>
        <Text style={styles.guestRowLabel}>房间数量</Text>
        <View style={styles.numberControl}>
          <TouchableOpacity
            style={[
              styles.numberButton,
              rooms <= 1 && styles.numberButtonDisabled,
            ]}
            onPress={() => rooms > 1 && onRoomsChange(rooms - 1)}
            disabled={rooms <= 1}>
            <Text
              style={[
                styles.numberButtonText,
                rooms <= 1 && styles.numberButtonTextDisabled,
              ]}>
              -
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.numberValue}
            onPress={() => onNumberPress('rooms')}>
            <Text style={styles.numberValueText}>{rooms}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => onRoomsChange(rooms + 1)}>
            <Text style={styles.numberButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 成人数量 */}
      <View style={styles.guestRow}>
        <Text style={styles.guestRowLabel}>成人数量</Text>
        <View style={styles.numberControl}>
          <TouchableOpacity
            style={[
              styles.numberButton,
              adults <= 1 && styles.numberButtonDisabled,
            ]}
            onPress={() => adults > 1 && onAdultsChange(adults - 1)}
            disabled={adults <= 1}>
            <Text
              style={[
                styles.numberButtonText,
                adults <= 1 && styles.numberButtonTextDisabled,
              ]}>
              -
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.numberValue}
            onPress={() => onNumberPress('adults')}>
            <Text style={styles.numberValueText}>{adults}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => onAdultsChange(adults + 1)}>
            <Text style={styles.numberButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 儿童数量 */}
      <View style={styles.guestRow}>
        <Text style={styles.guestRowLabel}>儿童数量</Text>
        <View style={styles.numberControl}>
          <TouchableOpacity
            style={[
              styles.numberButton,
              children <= 0 && styles.numberButtonDisabled,
            ]}
            onPress={() => children > 0 && onChildrenChange(children - 1)}
            disabled={children <= 0}>
            <Text
              style={[
                styles.numberButtonText,
                children <= 0 && styles.numberButtonTextDisabled,
              ]}>
              -
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.numberValue}
            onPress={() => onNumberPress('children')}>
            <Text style={styles.numberValueText}>{children}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => onChildrenChange(children + 1)}>
            <Text style={styles.numberButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestRowLabel: {
    fontSize: 14,
    color: '#333',
  },
  numberControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  numberButtonDisabled: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  numberButtonText: {
    fontSize: 18,
    color: '#1890ff',
    fontWeight: '600',
  },
  numberButtonTextDisabled: {
    color: '#999',
  },
  numberValue: {
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  numberValueText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
});

export default GuestSelector;

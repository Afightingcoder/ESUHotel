import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

interface SortFilterProps {
  visible: boolean;
  onClose: () => void;
  onSortChange: (sortType: string) => void;
  currentSort: string;
}

const sortOptions = [
  {key: 'default', label: '默认排序'},
  {key: 'price_low', label: '低价优先'},
  {key: 'price_high', label: '高价优先'},
  {key: 'star_high', label: '高星优先'},
];

const SortFilter: React.FC<SortFilterProps> = ({
  visible,
  onClose,
  onSortChange,
  currentSort,
}) => {
  const handleSelect = (sortType: string) => {
    onSortChange(sortType);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.topArea} />
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={styles.optionItem}
                onPress={() => handleSelect(option.key)}>
                <Text
                  style={[
                    styles.optionText,
                    currentSort === option.key && styles.optionTextActive,
                  ]}>
                  {option.label}
                </Text>
                {currentSort === option.key && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.bottomArea} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  topArea: {
    height: 110,
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'hidden',
  },
  bottomArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextActive: {
    color: '#1890ff',
    fontWeight: '500',
  },
  checkMark: {
    fontSize: 16,
    color: '#1890ff',
    fontWeight: '600',
  },
});

export default SortFilter;

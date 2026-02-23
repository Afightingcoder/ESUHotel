import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ModalBase from '../../../components/ModalBase';

type NumberPickerType = 'rooms' | 'adults' | 'children';

interface NumberPickerModalProps {
  visible: boolean;
  onClose: () => void;
  type: NumberPickerType;
  onSelect: (num: number) => void;
  onShowInput: () => void;
}

const NumberPickerModal: React.FC<NumberPickerModalProps> = ({
  visible,
  onClose,
  type,
  onSelect,
  onShowInput,
}) => {
  const getTitle = () => {
    switch (type) {
      case 'rooms':
        return '选择房间数量';
      case 'adults':
        return '选择成人数量';
      case 'children':
        return '选择儿童数量';
    }
  };

  return (
    <ModalBase visible={visible} onClose={onClose} title={getTitle()}>
      <View style={styles.numberGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
          <TouchableOpacity
            key={num}
            style={styles.numberGridItem}
            onPress={() => {
              onSelect(num);
              onClose();
            }}>
            <Text style={styles.numberGridItemText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.numberGridItem}
          onPress={onShowInput}>
          <Text style={styles.numberGridItemText}>更多</Text>
        </TouchableOpacity>
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  numberGridItem: {
    width: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberGridItemText: {
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 40,
    textAlign: 'center',
  },
});

export default NumberPickerModal;

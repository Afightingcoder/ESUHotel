import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, StyleSheet} from 'react-native';
import ModalBase from '../../../components/ModalBase';

type InputNumberType = 'rooms' | 'adults' | 'children';

interface InputNumberModalProps {
  visible: boolean;
  onClose: () => void;
  type: InputNumberType;
  onConfirm: (num: number) => void;
}

const InputNumberModal: React.FC<InputNumberModalProps> = ({
  visible,
  onClose,
  type,
  onConfirm,
}) => {
  const [inputNumber, setInputNumber] = useState<string>('');

  const getTitle = () => {
    switch (type) {
      case 'rooms':
        return '输入房间数量';
      case 'adults':
        return '输入成人数量';
      case 'children':
        return '输入儿童数量';
    }
  };

  const handleConfirm = () => {
    const value = parseInt(inputNumber, 10);
    if (value > 30) {
      Alert.alert('提示', '最多输入30');
      return;
    }
    if (value > 0) {
      onConfirm(value);
      onClose();
    }
  };

  return (
    <ModalBase visible={visible} onClose={onClose} title={getTitle()}>
      <View style={styles.inputModalContent}>
        <TextInput
          style={styles.inputField}
          value={inputNumber}
          onChangeText={setInputNumber}
          placeholder="请输入数量"
          keyboardType="numeric"
          autoFocus
        />
        <Text style={styles.inputHint}>最多输入30</Text>
      </View>

      <View style={styles.inputModalFooter}>
        <TouchableOpacity
          style={[styles.inputModalButton, styles.inputModalCancelButton]}
          onPress={onClose}>
          <Text style={styles.inputModalCancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.inputModalButton, styles.inputModalConfirmButton]}
          onPress={handleConfirm}>
          <Text style={styles.inputModalConfirmButtonText}>确认</Text>
        </TouchableOpacity>
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  inputModalContent: {
    padding: 16,
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  inputModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputModalCancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  inputModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8,
  },
  inputModalCancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  inputModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default InputNumberModal;

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import GuestSelector from './GuestSelector';

interface GuestModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rooms: number;
  adults: number;
  children: number;
  onRoomsChange: (rooms: number) => void;
  onAdultsChange: (adults: number) => void;
  onChildrenChange: (children: number) => void;
}

const GuestModal: React.FC<GuestModalProps> = ({
  visible,
  onClose,
  onConfirm,
  rooms,
  adults,
  children,
  onRoomsChange,
  onAdultsChange,
  onChildrenChange,
}) => {
  const [isNumberModalVisible, setIsNumberModalVisible] = useState<boolean>(false);
  const [currentSelectType, setCurrentSelectType] = useState<'rooms' | 'adults' | 'children' | null>(null);
  const [inputNumber, setInputNumber] = useState<string>('');
  const [isInputModalVisible, setIsInputModalVisible] = useState<boolean>(false);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleNumberPress = (type: 'rooms' | 'adults' | 'children') => {
    setCurrentSelectType(type);
    setIsNumberModalVisible(true);
  };

  const handleNumberSelect = (num: number) => {
    if (currentSelectType === 'rooms') {
      onRoomsChange(num);
    } else if (currentSelectType === 'adults') {
      onAdultsChange(num);
    } else if (currentSelectType === 'children') {
      onChildrenChange(num);
    }
    setIsNumberModalVisible(false);
  };

  const handleMorePress = () => {
    setInputNumber('');
    setIsInputModalVisible(true);
  };

  const handleInputConfirm = () => {
    const value = parseInt(inputNumber, 10);
    if (isNaN(value) || value <= 0) {
      Alert.alert('提示', '请输入有效的数字');
      return;
    }
    if (value > 30) {
      Alert.alert('提示', '最多输入30');
      return;
    }
    if (currentSelectType === 'rooms') {
      onRoomsChange(value);
    } else if (currentSelectType === 'adults') {
      onAdultsChange(value);
    } else if (currentSelectType === 'children') {
      onChildrenChange(value);
    }
    setIsInputModalVisible(false);
    setIsNumberModalVisible(false);
  };

  const getSelectTitle = (isInput: boolean = false) => {
    const prefix = isInput ? '输入' : '选择';
    if (currentSelectType === 'rooms') {
      return `${prefix}房间数量`;
    } else if (currentSelectType === 'adults') {
      return `${prefix}成人数量`;
    } else {
      return `${prefix}儿童数量`;
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}>
        <TouchableOpacity
          style={styles.modalBottom}
          activeOpacity={1}
          onPress={onClose}>
          <View style={styles.guestModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择客房和入住人数</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <GuestSelector
                  rooms={rooms}
                  adults={adults}
                  children={children}
                  onRoomsChange={onRoomsChange}
                  onAdultsChange={onAdultsChange}
                  onChildrenChange={onChildrenChange}
                  onNumberPress={handleNumberPress}
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 数字选择弹窗 */}
      <Modal
        visible={isNumberModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNumberModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsNumberModalVisible(false)}>
          <View style={styles.numberModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getSelectTitle()}</Text>
                <TouchableOpacity onPress={() => setIsNumberModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.numberGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numberGridItem}
                    onPress={() => handleNumberSelect(num)}>
                    <Text style={styles.numberGridItemText}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.numberGridItem}
                  onPress={handleMorePress}>
                  <Text style={styles.numberGridItemText}>更多</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 输入数字弹窗 */}
      <Modal
        visible={isInputModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsInputModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsInputModalVisible(false)}>
          <View style={styles.inputModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getSelectTitle(true)}</Text>
                <TouchableOpacity onPress={() => setIsInputModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

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
                  onPress={() => setIsInputModalVisible(false)}>
                  <Text style={styles.inputModalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.inputModalButton, styles.inputModalConfirmButton]}
                  onPress={handleInputConfirm}>
                  <Text style={styles.inputModalConfirmButtonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  guestModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  numberModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  inputModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingHorizontal: 8,
    justifyContent: 'flex-start',
  },
  numberGridItem: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    marginRight: '2%',
  },
  numberGridItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  inputModalContent: {
    padding: 16,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  inputModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  inputModalButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inputModalCancelButton: {
    backgroundColor: '#f5f5f5',
  },
  inputModalConfirmButton: {
    backgroundColor: '#1890ff',
  },
  inputModalCancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  inputModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default GuestModal;

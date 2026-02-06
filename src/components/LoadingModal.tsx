import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from 'react-native';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const { width, height } = Dimensions.get('window');

const LoadingModal: React.FC<LoadingModalProps> = ({ 
  visible, 
  message = '正在处理中...' 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 加载动画 */}
          <ActivityIndicator 
            size="large" 
            color="#1890ff" 
            style={styles.loader}
          />
          
          {/* 加载文本 */}
          <Text style={styles.message}>{message}</Text>
          
          {/* 辅助文本 */}
          <Text style={styles.helperText}>请稍候...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.7,
    maxWidth: 300,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loader: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default LoadingModal;
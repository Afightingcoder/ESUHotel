import React, {useEffect, useRef} from 'react';
import {View, Text, Modal, Animated, StyleSheet} from 'react-native';

interface BookingSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  visible,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.delay(150),
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 180,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onClose();
        scaleAnim.setValue(0);
        checkmarkAnim.setValue(0);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.checkmarkContainer,
                {
                  transform: [
                    {
                      scale: checkmarkAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                  opacity: checkmarkAnim,
                },
              ]}>
              <Text style={styles.checkmark}>✓</Text>
            </Animated.View>
          </View>
          <Text style={styles.title}>预订成功</Text>
          <Text style={styles.subtitle}>您已成功预订该房型</Text>
          <View style={styles.divider} />
          <Text style={styles.hint}>详情请查看订单页面</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  checkmarkContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#52c41a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 40,
    color: '#fff',
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#1890ff',
    borderRadius: 2,
    marginBottom: 16,
  },
  hint: {
    fontSize: 13,
    color: '#999',
  },
});

export default BookingSuccessModal;

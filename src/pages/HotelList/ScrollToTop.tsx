import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';

interface ScrollToTopProps {
  visible: boolean;
  onPress: () => void;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({visible, onPress}) => {
  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.scrollTopButton}
      onPress={onPress}
      activeOpacity={0.8}>
      <Image
        source={{uri: 'https://img.cdn1.vip/i/699d8a74b78e8_1771932276.png'}}
        style={styles.scrollTopIcon}
      />
    </TouchableOpacity>
  );
};

export default ScrollToTop;

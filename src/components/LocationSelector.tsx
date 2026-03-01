import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Geolocation as AMapGeolocation} from 'react-native-amap-geolocation';
import LoadingModal from './LoadingModal';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface AMapLocationData {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  address?: string;
  poiName?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  placeholder = '输入城市',
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '位置权限',
            message: '需要获取您的位置信息以提供更好的服务',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('定位权限被拒绝', '请在设置中开启定位权限');
        setLoading(false);
        return;
      }

      AMapGeolocation.getCurrentPosition(
        position => {
          console.log('定位结果:', position);
          
          const location = position.location as unknown as AMapLocationData | undefined;
          
          if (location) {
            const displayAddress = buildDisplayAddress(location);
            onChange(displayAddress);
          } else {
            const {latitude, longitude} = position.coords;
            onChange(`${latitude.toFixed(4)},${longitude.toFixed(4)}`);
          }
          
          setLoading(false);
        },
        error => {
          Alert.alert('定位失败', error.message);
          console.log('定位失败:', error);
          setLoading(false);
        },
      );
    } catch (error) {
      console.log('定位过程中出现错误:', error);
      Alert.alert('定位失败', '获取位置信息时出现错误');
      setLoading(false);
    }
  };

  const buildDisplayAddress = (location: AMapLocationData): string => {
    const parts: string[] = [];
    
    if (location.city) {
      parts.push(location.city);
    } else if (location.province) {
      parts.push(location.province);
    }
    
    if (location.district) {
      parts.push(location.district);
    }
    
    const baseAddress = parts.join('');
    
    if (location.poiName) {
      return `${baseAddress}${location.poiName}`;
    }
    
    return baseAddress || location.address || '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {!isFocused && value && (
            <View style={styles.ellipsisOverlay} pointerEvents="none">
              <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">
                {value}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.verticalDivider} />
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationButtonText}>当前地点</Text>
        </TouchableOpacity>
      </View>

      <LoadingModal visible={loading} message="正在定位" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    height: 34,
  },
  inputWrapper: {
    flex: 1,
    height: 34,
  },
  input: {
    flex: 1,
    height: 34,
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 0,
    paddingRight: 8,
  },
  ellipsisOverlay: {
    position: 'absolute',
    left: 0,
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  verticalDivider: {
    width: 0.5,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 6,
    backgroundColor: '#e6f7ff',
    borderRadius: 20,
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1890ff',
  },
});

export default LocationSelector;

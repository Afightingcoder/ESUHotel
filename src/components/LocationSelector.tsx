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
import qs from 'qs';
import {Geolocation as AMapGeolocation} from 'react-native-amap-geolocation';
import LoadingModal from './LoadingModal';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onGetLocation?: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  placeholder = '输入城市',
  onGetLocation,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // 请求定位权限
  const requestLocationPermission = async () => {
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
      } else {
        // iOS 权限请求会在定位时自动触发
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // 获取当前地点
  const getCurrentLocation = async () => {
    if (onGetLocation) {
      onGetLocation();
      return;
    }

    // 显示加载弹窗
    setLoading(true);

    try {
      // 请求定位权限
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('定位权限被拒绝', '请在设置中开启定位权限');
        setLoading(false); // 关闭加载弹窗
        return;
      }

      // 获取当前地点 - 使用react-native-amap-geolocation
      AMapGeolocation.getCurrentPosition(
        position => {
          console.log('位置', position);
          const {latitude, longitude} = position.coords;
          // 高德地图逆地理编码API参数
          const aMapParams = {
            key: '06bce1963ddc5fbd277faea82fd638fb', // API密钥
            poitype: 'all', // 兴趣点类型
            radius: 3000, // 搜索半径
            output: 'json', // 输出格式
            extensions: 'all', // 返回结果是否包含详细信息
            roadlevel: 0, // 道路等级
            location: `${longitude},${latitude}`, // 经纬度
          };

          // 构建请求URL
          const aMapBaseURL = 'https://restapi.amap.com/v3/geocode/regeo';
          const aMapLocationURL = `${aMapBaseURL}?${qs.stringify(aMapParams)}`;
          // 发送请求获取地址信息
          fetch(aMapLocationURL)
            .then(response => response.json())
            .then(data => {
              // 处理响应数据
              if (data.status === '1') {
                // 提取地址组成部分
                const addressComponent = data.regeocode.addressComponent;
                if (addressComponent) {
                  // 构建街道级别的地址
                  let addressParts = [];
                  if (addressComponent.city) {
                    addressParts.push(addressComponent.city);
                  }
                  if (addressComponent.district) {
                    addressParts.push(addressComponent.district);
                  }
                  if (addressComponent.township) {
                    addressParts.push(addressComponent.township);
                  }

                  const streetLevelAddress = addressParts.join('');
                  onChange(streetLevelAddress);
                }
              } else {
                // 如果逆地理编码失败，使用经纬度信息
                onChange(`${longitude.toFixed(4)},${latitude.toFixed(4)}`);
              }

              // 定位成功，关闭加载弹窗
              setLoading(false);
            })
            .catch(_ => {
              // 如果逆地理编码失败，使用经纬度信息
              onChange(`${longitude.toFixed(4)},${latitude.toFixed(4)}`);
              // 关闭加载弹窗
              setLoading(false);
            });
        },
        error => {
          Alert.alert('定位失败', error.message);
          console.log('定位失败:', error);
          // 关闭加载弹窗
          setLoading(false);
        },
      );
    } catch (error) {
      console.log('定位过程中出现错误:', error);
      Alert.alert('定位失败', '获取位置信息时出现错误');
      // 关闭加载弹窗
      setLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        autoCapitalize="none"
        keyboardType="default"
        autoCorrect={false}
      />

      {/* 加载弹窗 */}
      <LoadingModal visible={loading} message="正在紧急定位中" />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 44,
  },
  input: {
    width: '100%',
    height: 44,
    paddingHorizontal: 0,
    fontSize: 18,
  },
});

export default LocationSelector;

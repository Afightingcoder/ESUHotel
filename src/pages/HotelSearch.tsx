import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native';
import type { RouteType } from '../types';
import Calendar from '../components/Calendar';
import LoadingModal from '../components/LoadingModal';
import qs from 'qs';
// 导入react-native-amap-geolocation库
import { init, Geolocation as AMapGeolocation } from 'react-native-amap-geolocation';

const HotelSearchPage = ({ navigateTo }: { navigateTo: (route: RouteType, params?: any) => void }) => {
  const [location, setLocation] = useState<string>('上海');
  const [keyword, setKeyword] = useState<string>('');
  
  // 计算今天和明天的日期
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };
  
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  };
  
  const [startDate, setStartDate] = useState<string>(getTodayDate());
  const [endDate, setEndDate] = useState<string>(getTomorrowDate());
  const [filters, setFilters] = useState<{ star: number[]; priceRange: number[] }>({
    star: [],
    priceRange: []
  });
  // 加载弹窗状态
  const [loading, setLoading] = useState<boolean>(false);

  // 快捷标签数据
  const quickTags = [
    { id: 'tag_01', name: '亲子友好' },
    { id: 'tag_02', name: '豪华酒店' },
    { id: 'tag_03', name: '免费停车' },
    { id: 'tag_04', name: '近地铁' },
    { id: 'tag_05', name: '含早餐' },
    { id: 'tag_06', name: '江景房' }
  ];

  // 初始化react-native-amap-geolocation库
  useEffect(() => {
    // 初始化高德地图定位
    if (Platform.OS === 'android') {
      // Android端需要在代码中设置API key
      init({
        ios: '',
        android: '81583f4cae74715f049663264b247f14'
      });
    }
    // 组件卸载时清理
    return () => {
    };
  }, []);

  // 请求定位权限
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '位置权限',
            message: '需要获取您的位置信息以提供更好的服务',
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

  // 筛选条件处理
  const handleFilterChange = (type: 'star' | 'price', value: number) => {
    setFilters(prev => {
      const propertyName = type === 'price' ? 'priceRange' : type;
      const currentValues = prev[propertyName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [propertyName]: newValues };
    });
  };

  // 处理日期选择
  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // 提交查询
  const handleSearch = () => {
    navigateTo('list', {
      location,
      keyword,
      filters,
      checkDate: `${startDate} 至 ${endDate}`
    });
  };

  return (
    <ScrollView style={styles.pageContainer}>
      {/* 顶部Banner */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={() => navigateTo('detail', { hotelId: 'hotel_001' })}
      >
        <ImageBackground
          source={{ uri: 'https://picsum.photos/id/1031/1200/300' }}
          style={styles.bannerImage}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>上海陆家嘴玥酒店</Text>
            <Text style={styles.bannerSubtitle}>豪华体验 · 近东方明珠 · 限时8折</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* 核心查询区域 */}
      <View style={styles.searchContainer}>
        {/* 当前地点 */}
        <View style={styles.locationSearchItem}>
          <View style={styles.locationContainer}>
            <View style={styles.floatingLabelInputContainer}>
              {location ? (
                <Text style={styles.floatingLabel}>位置</Text>
              ) : null}
              <TextInput
                style={[styles.searchInput, location && styles.searchInputWithValue]}
                value={location}
                onChangeText={setLocation}
                placeholder={!location ? "位置" : ""}
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
              />
            </View>
            {/* 竖线分隔符 */}
            <View style={styles.verticalDivider} />
            <TouchableOpacity 
              style={styles.locationButton} 
              onPress={async () => {
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
                  
                  // 获取当前位置 - 使用react-native-amap-geolocation
                  AMapGeolocation.getCurrentPosition(
                    (position) => {
                      console.log('位置', position);
                      const { latitude, longitude } = position.coords;
                      // 高德地图逆地理编码API参数
                      const aMapParams = {
                        key: '06bce1963ddc5fbd277faea82fd638fb', // API密钥
                        poitype: 'all', // 兴趣点类型
                        radius: 3000, // 搜索半径
                        output: 'json', // 输出格式
                        extensions: 'all', // 返回结果是否包含详细信息
                        roadlevel: 0, // 道路等级
                        location: `${longitude},${latitude}` // 经纬度
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
                              if (addressComponent.city) addressParts.push(addressComponent.city);
                              if (addressComponent.district) addressParts.push(addressComponent.district);
                              if (addressComponent.township) addressParts.push(addressComponent.township);
                              
                              const streetLevelAddress = addressParts.join('');
                              setLocation(streetLevelAddress);
                            }
                          } else {
                            // 如果逆地理编码失败，使用经纬度信息
                            setLocation(`${longitude.toFixed(4)},${latitude.toFixed(4)}`);
                          }
                          
                          // 定位成功，关闭加载弹窗
                          setLoading(false);
                        })
                        .catch(error => {
                          // 如果逆地理编码失败，使用经纬度信息
                          setLocation(`${longitude.toFixed(4)},${latitude.toFixed(4)}`);
                          // 关闭加载弹窗
                          setLoading(false);
                        });
                    },
                    (error) => {
                      Alert.alert('定位失败', error.message);
                      console.log('定位失败:', error);
                      // 关闭加载弹窗
                      setLoading(false);
                    }
                  );
                } catch (error) {
                  console.log('定位过程中出现错误:', error);
                  Alert.alert('定位失败', '获取位置信息时出现错误');
                  // 关闭加载弹窗
                  setLoading(false);
                }
              }}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>当前地点</Text>
            </TouchableOpacity>
          </View>
          {/* 横线分隔符 */}
          <View style={styles.horizontalDivider} />
        </View>

        {/* 关键字搜索 */}
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>🔍</Text>
          <View style={styles.floatingLabelInputContainer}>
            {keyword ? (
              <Text style={styles.floatingLabel}>酒店/品牌</Text>
            ) : null}
            <TextInput
              style={[styles.searchInput, keyword && styles.searchInputWithValue]}
              value={keyword}
              onChangeText={setKeyword}
              placeholder={!keyword ? "酒店/品牌" : ""}
              autoCapitalize="none"
              keyboardType="default"
              autoCorrect={false}
            />
          </View>
        </View>
        {/* 横线分隔符 */}
          <View style={styles.horizontalDivider} />

        {/* 日期选择 */}
        <View style={styles.searchItem}>
          <Calendar
            onDateSelect={handleDateSelect}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        </View>
        {/* 横线分隔符 */}
          <View style={styles.horizontalDivider} />

        {/* 筛选条件（星级+价格） */}
        <View style={styles.filterContainer}>
          <View style={styles.filterContent}>
            <View style={styles.starFilter}>
              <Text style={styles.filterSubLabel}>星级：</Text>
              {[2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={`star_${star}`}
                  style={[
                    styles.filterTag,
                    filters.star.includes(star) && styles.filterTagActive
                  ]}
                  onPress={() => handleFilterChange('star', star)}
                >
                  <Text style={styles.filterTagText}>{star}星</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.priceFilter}>
              <Text style={styles.filterSubLabel}>价格：</Text>
              {
                [
                  { id: 1, label: '≤300', value: 300 },
                  { id: 2, label: '300-600', value: 600 },
                  { id: 3, label: '600-1000', value: 1000 },
                  { id: 4, label: '≥1000', value: 1001 }
                ].map(item => (
                  <TouchableOpacity
                    key={`price_${item.id}`}
                    style={[
                      styles.filterTag,
                      filters.priceRange.includes(item.value) && styles.filterTagActive
                    ]}
                    onPress={() => handleFilterChange('price', item.value)}
                  >
                    <Text style={styles.filterTagText}>{item.label}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
          </View>
        </View>

        {/* 快捷标签 */}
        <View style={styles.tagsContainer}>
          <View style={styles.tagsContent}>
            {quickTags.map(tag => (
              <TouchableOpacity key={tag.id} style={styles.quickTag}>
                <Text style={styles.quickTagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 查询按钮 */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>查询酒店</Text>
        </TouchableOpacity>
      </View>
      
      {/* 加载弹窗 */}
      <LoadingModal 
        visible={loading} 
        message="紧急定位ing~"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  // 首页Banner样式
  bannerContainer: {
    width: '100%',
    height: 180,
    marginBottom: 16
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  bannerOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff'
  },
  // 搜索区域样式
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36
  },
  locationSearchItem: {
    flexDirection: 'column',
    marginBottom: 12
  },
  searchLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500'
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 18
  },
  verticalDivider: {
    width: 0.5,
    height: '60%',
    backgroundColor: '#ddd',
    marginHorizontal: 8
  },
  horizontalDivider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#eee',
    marginTop: 8,
    marginBottom: 8
  },
  // 当前地点容器样式
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44
  },
  locationInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  locationText: {
    fontSize: 14,
    color: '#333'
  },
  locationArrow: {
    fontSize: 14,
    color: '#999'
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 20,
    justifyContent: 'center'
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1890ff'
  },
  // 筛选条件样式
  filterContainer: {
    marginBottom: 12
  },
  filterContent: {
    gap: 12
  },
  starFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  priceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  filterSubLabel: {
    fontSize: 14,
    color: '#666'
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  filterTagActive: {
    borderColor: '#1890ff',
    backgroundColor: 'rgba(24,144,255,0.1)'
  },
  filterTagText: {
    fontSize: 12,
    color: '#333'
  },
  // 快捷标签样式
  tagsContainer: {
    marginBottom: 16
  },
  tagsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  quickTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5fafe',
    borderRadius: 20
  },
  quickTagText: {
    fontSize: 12,
    color: '#1890ff'
  },
  // 搜索按钮样式
  searchBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#1890ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  // 浮动标签样式
  floatingLabelInputContainer: {
    flex: 1,
    position: 'relative',
    height: 44
  },
  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 12,
    fontSize: 12,
    color: '#999',
    backgroundColor: '#fff',
    paddingHorizontal: 4
  },
  searchInputWithValue: {
    paddingTop: 16,
    paddingBottom: 8
  }
});

export default HotelSearchPage;

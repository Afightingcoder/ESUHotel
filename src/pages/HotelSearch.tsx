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
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>当前地点</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={styles.searchInput}
              value={location}
              onChangeText={setLocation}
              placeholder="输入城市"
              autoCapitalize="none"
              keyboardType="default"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.locationButton} 
              onPress={async () => {
                Alert.alert('正在获取当前位置...');
                
                // 请求定位权限
                const hasPermission = await requestLocationPermission();
                if (!hasPermission) {
                  Alert.alert('定位权限被拒绝', '请在设置中开启定位权限');
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
                      })
                      .catch(error => {
                        // 如果逆地理编码失败，使用经纬度信息
                        setLocation(`${longitude.toFixed(4)},${latitude.toFixed(4)}`);
                      });
                  },
                  (error) => {
                    Alert.alert('定位失败', error.message);
                    console.log('定位失败:', error);
                  }
                );
              }}
            >
              <Text style={styles.locationIcon}>📍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 关键字搜索 */}
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>关键字</Text>
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="酒店名称/商圈"
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
          />
        </View>

        {/* 日期选择 */}
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>入住日期</Text>
          <Calendar
            onDateSelect={handleDateSelect}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        </View>

        {/* 筛选条件（星级+价格） */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>筛选条件</Text>
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
          <Text style={styles.filterLabel}>快捷标签</Text>
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
    marginBottom: 12,
    height: 44
  },
  searchLabel: {
    width: 60,
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14
  },
  // 当前地点容器样式
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#e6f7ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationIcon: {
    fontSize: 16
  },
  // 筛选条件样式
  filterContainer: {
    marginBottom: 12
  },
  filterLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8
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
  }
});

export default HotelSearchPage;

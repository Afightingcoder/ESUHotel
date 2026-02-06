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
  PermissionsAndroid,
  Modal
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
  // 客房和人数状态
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  // 选择弹窗状态
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);
  // 数字选择弹窗状态
  const [isNumberModalVisible, setIsNumberModalVisible] = useState<boolean>(false);
  const [currentSelectType, setCurrentSelectType] = useState<'rooms' | 'adults' | 'children' | null>(null);
  // 输入数字状态
  const [inputNumber, setInputNumber] = useState<string>('');
  const [isInputModalVisible, setIsInputModalVisible] = useState<boolean>(false);
  // 筛选弹窗状态
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  // 价格区间选择状态（单选）
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  // 星级选择状态（多选）
  const [selectedStars, setSelectedStars] = useState<number[]>([]);

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
            {keyword ? (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => setKeyword('')}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            ) : null}
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

        {/* 客房和人数统计 */}
        <TouchableOpacity 
          style={styles.searchItem}
          onPress={() => setIsGuestModalVisible(true)}
        >
          <Text style={styles.searchLabel}>👥</Text>
          <View style={styles.guestInfoContainer}>
            <Text style={styles.guestInfoText}>
              {rooms}间房 · {adults}成人 · {children}儿童
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </TouchableOpacity>
        {/* 横线分隔符 */}
          <View style={styles.horizontalDivider} />

        {/* 筛选条件（星级+价格） */}
        <TouchableOpacity 
          style={styles.searchItem}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Text style={styles.searchLabel}></Text>
          <View style={styles.guestInfoContainer}>
            <Text style={[styles.guestInfoText, !selectedPrice && selectedStars.length === 0 && styles.greyText]}>
              {selectedPrice || selectedStars.length > 0 ? (
                <>
                  {selectedPrice ? (
                    [
                      { id: 1, label: '￥200以下', value: 200 },
                      { id: 2, label: '￥200-￥350', value: 350 },
                      { id: 3, label: '￥350-￥400', value: 400 },
                      { id: 4, label: '￥400-￥500', value: 500 },
                      { id: 5, label: '￥500-￥900', value: 900 },
                      { id: 6, label: '￥900-￥1400', value: 1400 },
                      { id: 7, label: '￥1400以上', value: 1401 }
                    ].find(item => item.value === selectedPrice)?.label
                  ) : ''}
                  {selectedPrice && selectedStars.length > 0 ? ' · ' : ''}
                  {selectedStars.length > 0 ? (
                    selectedStars.map(star => `${star}星`).join(', ')
                  ) : ''}
                </>
              ) : '价格/星级'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </TouchableOpacity>
        {/* 横线分隔符 */}
          <View style={styles.horizontalDivider} />

        {/* 快捷标签 */}
        <View style={styles.tagsContainer}>
          <View style={styles.tagsContent}>
            {quickTags.map(tag => (
              <TouchableOpacity 
                key={tag.id} 
                style={[
                  styles.quickTag,
                  keyword === tag.name && styles.quickTagActive
                ]}
                onPress={() => setKeyword(tag.name)}
              >
                <Text style={[
                  styles.quickTagText,
                  keyword === tag.name && styles.quickTagTextActive
                ]}>{tag.name}</Text>
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
      
      {/* 选择客房和入住人数弹窗 */}
      <Modal
        visible={isGuestModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGuestModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsGuestModalVisible(false)}
        >
          <View style={styles.guestModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择客房和入住人数</Text>
                <TouchableOpacity onPress={() => setIsGuestModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                {/* 房间数量 */}
                <View style={styles.guestRow}>
                  <Text style={styles.guestRowLabel}>房间数量</Text>
                  <View style={styles.numberControl}>
                    <TouchableOpacity 
                      style={[
                        styles.numberButton, 
                        rooms <= 1 && styles.numberButtonDisabled
                      ]}
                      onPress={() => rooms > 1 && setRooms(rooms - 1)}
                      disabled={rooms <= 1}
                    >
                      <Text style={[
                        styles.numberButtonText, 
                        rooms <= 1 && styles.numberButtonTextDisabled
                      ]}>—</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.numberValue}
                      onPress={() => {
                        setCurrentSelectType('rooms');
                        setIsNumberModalVisible(true);
                      }}
                    >
                      <Text style={styles.numberValueText}>{rooms}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.numberButton}
                      onPress={() => setRooms(rooms + 1)}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* 成人数量 */}
                <View style={styles.guestRow}>
                  <Text style={styles.guestRowLabel}>成人数量</Text>
                  <View style={styles.numberControl}>
                    <TouchableOpacity 
                      style={[
                        styles.numberButton, 
                        adults <= 1 && styles.numberButtonDisabled
                      ]}
                      onPress={() => adults > 1 && setAdults(adults - 1)}
                      disabled={adults <= 1}
                    >
                      <Text style={[
                        styles.numberButtonText, 
                        adults <= 1 && styles.numberButtonTextDisabled
                      ]}>—</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.numberValue}
                      onPress={() => {
                        setCurrentSelectType('adults');
                        setIsNumberModalVisible(true);
                      }}
                    >
                      <Text style={styles.numberValueText}>{adults}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.numberButton}
                      onPress={() => setAdults(adults + 1)}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* 儿童数量 */}
                <View style={styles.guestRow}>
                  <Text style={styles.guestRowLabel}>儿童数量</Text>
                  <View style={styles.numberControl}>
                    <TouchableOpacity 
                      style={[
                        styles.numberButton, 
                        children <= 0 && styles.numberButtonDisabled
                      ]}
                      onPress={() => children > 0 && setChildren(children - 1)}
                      disabled={children <= 0}
                    >
                      <Text style={[
                        styles.numberButtonText, 
                        children <= 0 && styles.numberButtonTextDisabled
                      ]}>—</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.numberValue}
                      onPress={() => {
                        setCurrentSelectType('children');
                        setIsNumberModalVisible(true);
                      }}
                    >
                      <Text style={styles.numberValueText}>{children}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.numberButton}
                      onPress={() => setChildren(children + 1)}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => setIsGuestModalVisible(false)}
              >
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
        onRequestClose={() => setIsNumberModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsNumberModalVisible(false)}
        >
          <View style={styles.numberModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentSelectType === 'rooms' ? '选择房间数量' : 
                   currentSelectType === 'adults' ? '选择成人数量' : '选择儿童数量'}
                </Text>
                <TouchableOpacity onPress={() => setIsNumberModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.numberGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <TouchableOpacity 
                    key={num}
                    style={styles.numberGridItem}
                    onPress={() => {
                      if (currentSelectType === 'rooms') setRooms(num);
                      else if (currentSelectType === 'adults') setAdults(num);
                      else if (currentSelectType === 'children') setChildren(num);
                      setIsNumberModalVisible(false);
                    }}
                  >
                    <Text style={styles.numberGridItemText}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity 
                  style={styles.numberGridItem}
                  onPress={() => {
                    // 显示输入弹窗
                    setInputNumber('');
                    setIsInputModalVisible(true);
                  }}
                >
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
        onRequestClose={() => setIsInputModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsInputModalVisible(false)}
        >
          <View style={styles.inputModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentSelectType === 'rooms' ? '输入房间数量' : 
                   currentSelectType === 'adults' ? '输入成人数量' : '输入儿童数量'}
                </Text>
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
                  onPress={() => setIsInputModalVisible(false)}
                >
                  <Text style={styles.inputModalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.inputModalButton, styles.inputModalConfirmButton]}
                  onPress={() => {
                    const value = parseInt(inputNumber);
                    if (value > 30) {
                      Alert.alert('提示', '最多输入30');
                      return;
                    }
                    if (value > 0) {
                      if (currentSelectType === 'rooms') setRooms(value);
                      else if (currentSelectType === 'adults') setAdults(value);
                      else if (currentSelectType === 'children') setChildren(value);
                      setIsInputModalVisible(false);
                      setIsNumberModalVisible(false);
                    }
                  }}
                >
                  <Text style={styles.inputModalConfirmButtonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* 筛选弹窗 */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <View style={styles.filterModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择价格/星级</Text>
                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterModalContent}>
                {/* 价格区间 */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>价格</Text>
                  <View style={styles.filterOptions}>
                    {[
                      { id: 1, label: '￥200以下', value: 200 },
                      { id: 2, label: '￥200-￥350', value: 350 },
                      { id: 3, label: '￥350-￥400', value: 400 },
                      { id: 4, label: '￥400-￥500', value: 500 },
                      { id: 5, label: '￥500-￥900', value: 900 },
                      { id: 6, label: '￥900-￥1400', value: 1400 },
                      { id: 7, label: '￥1400以上', value: 1401 }
                    ].map(item => (
                      <TouchableOpacity
                        key={`price_${item.id}`}
                        style={[
                          styles.filterOptionItem,
                          selectedPrice === item.value && styles.filterOptionItemActive
                        ]}
                        onPress={() => setSelectedPrice(item.value)}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          selectedPrice === item.value && styles.filterOptionTextActive
                        ]}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                {/* 星级/钻级 */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>星级/钻级</Text>
                  <View style={styles.filterOptions}>
                    {[
                      { id: 1, label: '2星及以下', value: 2, desc: '经济' },
                      { id: 2, label: '3星', value: 3, desc: '舒适' },
                      { id: 3, label: '4星', value: 4, desc: '高档' },
                      { id: 4, label: '5星', value: 5, desc: '豪华' }
                    ].map(item => (
                      <TouchableOpacity
                        key={`star_${item.id}`}
                        style={[
                          styles.filterOptionItem,
                          selectedStars.includes(item.value) && styles.filterOptionItemActive
                        ]}
                        onPress={() => {
                          if (selectedStars.includes(item.value)) {
                            setSelectedStars(selectedStars.filter(star => star !== item.value));
                          } else {
                            setSelectedStars([...selectedStars, item.value]);
                          }
                        }}
                      >
                        <View>
                          <Text style={[
                            styles.filterOptionText,
                            selectedStars.includes(item.value) && styles.filterOptionTextActive
                          ]}>{item.label}</Text>
                          <Text style={styles.filterOptionDesc}>{item.desc}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <View style={styles.filterModalFooter}>
                <TouchableOpacity 
                  style={[styles.filterModalButton, styles.filterModalClearButton]}
                  onPress={() => {
                    setSelectedPrice(null);
                    setSelectedStars([]);
                  }}
                >
                  <Text style={styles.filterModalClearButtonText}>清空</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterModalButton, styles.filterModalConfirmButton]}
                  onPress={() => {
                    // 将选择结果应用到filters状态
                    setFilters({
                      star: selectedStars,
                      priceRange: selectedPrice ? [selectedPrice] : []
                    });
                    setIsFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.filterModalConfirmButtonText}>完成</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: '#f5f5f5',
    borderRadius: 20
  },
  quickTagActive: {
    backgroundColor: '#e6f7ff'
  },
  quickTagText: {
    fontSize: 12,
    color: '#333'
  },
  quickTagTextActive: {
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
  },
  // 清除按钮样式
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600'
  },
  // 客房和人数统计样式
  guestInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  guestInfoText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600'
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8
  },
  greyText: {
    color: '#999'
  },
  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  guestModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30
  },
  numberModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
    padding: 4
  },
  modalContent: {
    padding: 16
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  guestRowLabel: {
    fontSize: 14,
    color: '#333'
  },
  numberControl: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  numberButtonDisabled: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5'
  },
  numberButtonText: {
    fontSize: 18,
    color: '#1890ff',
    fontWeight: '600'
  },
  numberButtonTextDisabled: {
    color: '#999'
  },
  numberValue: {
    minWidth: 40,
    textAlign: 'center',
    marginLeft: 16,
    marginRight: -10
  },
  numberValueText: {
    fontSize: 14,
    color: '#333'
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  // 数字选择弹窗样式
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16
  },
  numberGridItem: {
    width: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberGridItemText: {
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 40,
    textAlign: 'center'
  },
  // 输入数字弹窗样式
  inputModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30
  },
  inputModalContent: {
    padding: 16
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right'
  },
  inputModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  inputModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputModalCancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8
  },
  inputModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8
  },
  inputModalCancelButtonText: {
    fontSize: 16,
    color: '#333'
  },
  inputModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  // 筛选弹窗样式
  filterModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
    maxHeight: '80%'
  },
  filterModalContent: {
    padding: 16,
    maxHeight: 400
  },
  filterSection: {
    marginBottom: 24
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  filterOptions: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  filterOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    minWidth: 120
  },
  filterOptionItemActive: {
    borderColor: '#1890ff',
    backgroundColor: 'rgba(24, 144, 255, 0.05)'
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333'
  },
  filterOptionTextActive: {
    color: '#1890ff',
    fontWeight: '500'
  },
  filterOptionDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2
  },
  checkmark: {
    fontSize: 16,
    color: '#1890ff',
    fontWeight: '600'
  },
  filterModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  filterModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterModalClearButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8
  },
  filterModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8
  },
  filterModalClearButtonText: {
    fontSize: 16,
    color: '#333'
  },
  filterModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  }
});

export default HotelSearchPage;

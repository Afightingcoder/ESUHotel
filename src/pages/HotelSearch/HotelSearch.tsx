import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import type {RouteType} from '../../types';
import LoadingModal from '../../components/LoadingModal';
import LocationSelector from '../../components/LocationSelector';
import DateSelector from '../../components/DateSelector';
import GuestSelector from '../../components/GuestSelector';
import {formatDate} from '../../utils/dateUtils';
import {styles} from './styles';
// 导入react-native-amap-geolocation库
import {init} from 'react-native-amap-geolocation';

const HotelSearchPage = ({
  navigateTo,
}: {
  navigateTo: (route: RouteType, params?: any) => void;
}) => {
  const [location, setLocation] = useState<string>('上海');
  const [keyword, setKeyword] = useState<string>('');

  // 计算今天和明天的日期
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(
      tomorrow.getMonth() + 1,
    ).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  };

  const [startDate, setStartDate] = useState<string>(getTodayDate());
  const [endDate, setEndDate] = useState<string>(getTomorrowDate());
  const [filters, setFilters] = useState<{
    star: number[];
    priceRange: number[];
  }>({
    star: [],
    priceRange: [],
  });
  // 加载弹窗状态
  const [loading] = useState<boolean>(false);
  // 客房和人数状态
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  // 选择弹窗状态
  const [isGuestModalVisible, setIsGuestModalVisible] =
    useState<boolean>(false);
  // 数字选择弹窗状态
  const [isNumberModalVisible, setIsNumberModalVisible] =
    useState<boolean>(false);
  const [currentSelectType] = useState<'rooms' | 'adults' | 'children' | null>(
    null,
  );
  // 输入数字状态
  const [inputNumber, setInputNumber] = useState<string>('');
  const [isInputModalVisible, setIsInputModalVisible] =
    useState<boolean>(false);
  // 筛选弹窗状态
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);
  // 价格区间选择状态（单选）
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  // 星级选择状态（多选）
  const [selectedStars, setSelectedStars] = useState<number[]>([]);

  // 快捷标签数据
  const quickTags = [
    {id: 'tag_01', name: '亲子友好'},
    {id: 'tag_02', name: '豪华酒店'},
    {id: 'tag_03', name: '免费停车'},
    {id: 'tag_04', name: '近地铁'},
    {id: 'tag_05', name: '含早餐'},
    {id: 'tag_06', name: '江景房'},
  ];

  // 初始化react-native-amap-geolocation库
  useEffect(() => {
    // 初始化高德地图定位
    if (Platform.OS === 'android') {
      // Android端需要在代码中设置API key
      init({
        ios: '',
        android: '81583f4cae74715f049663264b247f14',
      });
    }
    // 组件卸载时清理
    return () => {};
  }, []);

  // 处理日期选择
  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // 提交查询
  const handleSearch = () => {
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    navigateTo('list', {
      location,
      keyword,
      filters,
      startDate: formattedStart,
      endDate: formattedEnd,
    });
  };

  return (
    <ScrollView style={styles.pageContainer}>
      {/* 顶部Banner */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={() => navigateTo('detail', {hotelId: 'hotel_001'})}>
        <ImageBackground
          source={{uri: 'https://picsum.photos/id/1031/1200/300'}}
          style={styles.bannerImage}>
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>上海陆家嘴玥酒店</Text>
            <Text style={styles.bannerSubtitle}>
              豪华体验 · 近东方明珠 · 限时8折
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* 核心查询区域 */}
      <View style={styles.searchContainer}>
        {/* 当前地点 */}
        <View style={styles.locationSearchItem}>
          <View style={styles.locationContainer}>
            <View style={styles.floatingLabelInputContainer}>
              {location ? <Text style={styles.floatingLabel}>位置</Text> : null}
              <View
                style={[
                  styles.searchInput,
                  location && styles.searchInputWithValue,
                ]}>
                <LocationSelector
                  value={location}
                  onChange={setLocation}
                  placeholder="位置"
                />
              </View>
            </View>
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
              style={[
                styles.searchInput,
                keyword && styles.searchInputWithValue,
              ]}
              value={keyword}
              onChangeText={setKeyword}
              placeholder={!keyword ? '酒店/品牌' : ''}
              autoCapitalize="none"
              keyboardType="default"
              autoCorrect={false}
            />
            {keyword ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setKeyword('')}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {/* 横线分隔符 */}
        <View style={styles.horizontalDivider} />

        {/* 日期选择 */}
        <View style={styles.searchItem}>
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            onDateSelect={handleDateSelect}
          />
        </View>
        {/* 横线分隔符 */}
        <View style={styles.horizontalDivider} />

        {/* 客房和人数统计 */}
        <TouchableOpacity
          style={styles.searchItem}
          onPress={() => setIsGuestModalVisible(true)}>
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
          onPress={() => setIsFilterModalVisible(true)}>
          <Text style={styles.searchLabel} />
          <View style={styles.guestInfoContainer}>
            <Text
              style={[
                styles.guestInfoText,
                !selectedPrice && selectedStars.length === 0 && styles.greyText,
              ]}>
              {selectedPrice || selectedStars.length > 0 ? (
                <>
                  {selectedPrice
                    ? [
                        {id: 1, label: '￥200以下', value: 200},
                        {id: 2, label: '￥200-￥350', value: 350},
                        {id: 3, label: '￥350-￥400', value: 400},
                        {id: 4, label: '￥400-￥500', value: 500},
                        {id: 5, label: '￥500-￥900', value: 900},
                        {id: 6, label: '￥900-￥1400', value: 1400},
                        {id: 7, label: '￥1400以上', value: 1401},
                      ].find(item => item.value === selectedPrice)?.label
                    : ''}
                  {selectedPrice && selectedStars.length > 0 ? ' · ' : ''}
                  {selectedStars.length > 0
                    ? selectedStars.map(star => `${star}星`).join(', ')
                    : ''}
                </>
              ) : (
                '价格/星级'
              )}
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
                  keyword === tag.name && styles.quickTagActive,
                ]}
                onPress={() => setKeyword(tag.name)}>
                <Text
                  style={[
                    styles.quickTagText,
                    keyword === tag.name && styles.quickTagTextActive,
                  ]}>
                  {tag.name}
                </Text>
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
      <LoadingModal visible={loading} message="紧急定位ing~" />

      {/* 选择客房和入住人数弹窗 */}
      <Modal
        visible={isGuestModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGuestModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsGuestModalVisible(false)}>
          <View style={styles.guestModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择客房和入住人数</Text>
                <TouchableOpacity onPress={() => setIsGuestModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <GuestSelector
                  rooms={rooms}
                  adults={adults}
                  children={children}
                  onRoomsChange={setRooms}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setIsGuestModalVisible(false)}>
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
                <Text style={styles.modalTitle}>
                  {currentSelectType === 'rooms'
                    ? '选择房间数量'
                    : currentSelectType === 'adults'
                    ? '选择成人数量'
                    : '选择儿童数量'}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsNumberModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.numberGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numberGridItem}
                    onPress={() => {
                      if (currentSelectType === 'rooms') {
                        setRooms(num);
                      } else if (currentSelectType === 'adults') {
                        setAdults(num);
                      } else if (currentSelectType === 'children') {
                        setChildren(num);
                      }
                      setIsNumberModalVisible(false);
                    }}>
                    <Text style={styles.numberGridItemText}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.numberGridItem}
                  onPress={() => {
                    // 显示输入弹窗
                    setInputNumber('');
                    setIsInputModalVisible(true);
                  }}>
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
                <Text style={styles.modalTitle}>
                  {currentSelectType === 'rooms'
                    ? '输入房间数量'
                    : currentSelectType === 'adults'
                    ? '输入成人数量'
                    : '输入儿童数量'}
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
                  style={[
                    styles.inputModalButton,
                    styles.inputModalCancelButton,
                  ]}
                  onPress={() => setIsInputModalVisible(false)}>
                  <Text style={styles.inputModalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.inputModalButton,
                    styles.inputModalConfirmButton,
                  ]}
                  onPress={() => {
                    const value = parseInt(inputNumber, 10);
                    if (value > 30) {
                      Alert.alert('提示', '最多输入30');
                      return;
                    }
                    if (value > 0) {
                      if (currentSelectType === 'rooms') {
                        setRooms(value);
                      } else if (currentSelectType === 'adults') {
                        setAdults(value);
                      } else if (currentSelectType === 'children') {
                        setChildren(value);
                      }
                      setIsInputModalVisible(false);
                      setIsNumberModalVisible(false);
                    }
                  }}>
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
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}>
          <View style={styles.filterModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择价格/星级</Text>
                <TouchableOpacity
                  onPress={() => setIsFilterModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterModalContent}>
                {/* 价格区间 */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>价格</Text>
                  <View style={styles.filterOptions}>
                    {[
                      {id: 1, label: '￥200以下', value: 200},
                      {id: 2, label: '￥200-￥350', value: 350},
                      {id: 3, label: '￥350-￥400', value: 400},
                      {id: 4, label: '￥400-￥500', value: 500},
                      {id: 5, label: '￥500-￥900', value: 900},
                      {id: 6, label: '￥900-￥1400', value: 1400},
                      {id: 7, label: '￥1400以上', value: 1401},
                    ].map(item => (
                      <TouchableOpacity
                        key={`price_${item.id}`}
                        style={[
                          styles.filterOptionItem,
                          selectedPrice === item.value &&
                            styles.filterOptionItemActive,
                        ]}
                        onPress={() => setSelectedPrice(item.value)}>
                        <Text
                          style={[
                            styles.filterOptionText,
                            selectedPrice === item.value &&
                              styles.filterOptionTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 星级/钻级 */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>星级/钻级</Text>
                  <View style={styles.filterOptions}>
                    {[
                      {id: 1, label: '2星及以下', value: 2, desc: '经济'},
                      {id: 2, label: '3星', value: 3, desc: '舒适'},
                      {id: 3, label: '4星', value: 4, desc: '高档'},
                      {id: 4, label: '5星', value: 5, desc: '豪华'},
                    ].map(item => (
                      <TouchableOpacity
                        key={`star_${item.id}`}
                        style={[
                          styles.filterOptionItem,
                          selectedStars.includes(item.value) &&
                            styles.filterOptionItemActive,
                        ]}
                        onPress={() => {
                          if (selectedStars.includes(item.value)) {
                            setSelectedStars(
                              selectedStars.filter(star => star !== item.value),
                            );
                          } else {
                            setSelectedStars([...selectedStars, item.value]);
                          }
                        }}>
                        <View>
                          <Text
                            style={[
                              styles.filterOptionText,
                              selectedStars.includes(item.value) &&
                                styles.filterOptionTextActive,
                            ]}>
                            {item.label}
                          </Text>
                          <Text style={styles.filterOptionDesc}>
                            {item.desc}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.filterModalFooter}>
                <TouchableOpacity
                  style={[
                    styles.filterModalButton,
                    styles.filterModalClearButton,
                  ]}
                  onPress={() => {
                    setSelectedPrice(null);
                    setSelectedStars([]);
                  }}>
                  <Text style={styles.filterModalClearButtonText}>清空</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterModalButton,
                    styles.filterModalConfirmButton,
                  ]}
                  onPress={() => {
                    // 将选择结果应用到filters状态
                    setFilters({
                      star: selectedStars,
                      priceRange: selectedPrice ? [selectedPrice] : [],
                    });
                    setIsFilterModalVisible(false);
                  }}>
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



export default HotelSearchPage;

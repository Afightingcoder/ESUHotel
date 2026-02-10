import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import type {RouteType, HotelType} from '../../types';
import {mockHotels} from '../../data/mockData';
// 导入react-native-amap-geolocation库
// import {init} from 'react-native-amap-geolocation';
import LocationSelector from '../../components/LocationSelector';
import DateSelector from '../../components/DateSelector';
import GuestSelector from '../../components/GuestSelector';
import {formatDate} from '../../utils/dateUtils';
import {BASE_URL} from '../../utils/api';
import {styles} from './styles';

const HotelListPage = ({
  navigateTo,
  routeParams
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  routeParams: any;
}) => {
  // 状态变量
  // const [page, setPage] = useState<number>(1);
  const [location, setLocation] = useState<string>(routeParams?.location || '');
  const [startDate, setStartDate] = useState<string>(
    routeParams?.startDate || '',
  );
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '');
  const [hotels, setHotels] = useState<HotelType[]>(routeParams?.hotels || []);
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);

  // 处理从详情页返回的数据更新
  React.useEffect(() => {
    console.log('接收到的routeParams:', routeParams);
    
    // 检查是否有updatedData字段
    if (routeParams?.updatedData) {
      console.log('接收到的更新数据:', routeParams.updatedData);
      const { startDate: updatedStartDate, endDate: updatedEndDate, rooms: updatedRooms, adults: updatedAdults, children: updatedChildren, hotels: hotels, location: location } = routeParams.updatedData;
      if (updatedStartDate) setStartDate(updatedStartDate);
      if (updatedEndDate) setEndDate(updatedEndDate);
      if (location) setLocation(location);
      if (updatedRooms) setRooms(updatedRooms);
      if (updatedAdults) setAdults(updatedAdults);
      if (updatedChildren) setChildren(updatedChildren);
      if (hotels) setHotels(hotels);
    }
  }, [routeParams, setStartDate, setEndDate, setRooms, setAdults, setChildren, setHotels, setLocation]); 

  // 初始化酒店数据 - 不使用模拟数据，只使用接口返回的数据
  React.useEffect(() => {
    console.log('酒店列表数据:', hotels);
  }, [hotels]);
  // 搜索框输入内容
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 弹窗状态
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // 客房和人数选择弹窗状态
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);
  // 数字选择弹窗状态
  const [isNumberModalVisible, setIsNumberModalVisible] = useState<boolean>(false);
  const [currentSelectType, setCurrentSelectType] = useState<'rooms' | 'adults' | 'children' | null>(null);
  // 输入数字状态
  const [inputNumber, setInputNumber] = useState<string>('');
  const [isInputModalVisible, setIsInputModalVisible] = useState<boolean>(false);



  // 上滑加载更多（模拟）
  const handleLoadMore = () => {
    setTimeout(() => {
      setHotels(prev => [
        ...prev,
        // ...mockHotels.map(hotel => ({...hotel, id: `${hotel.id}_${page + 1}`})),
      ]);
      // setPage(prev => prev + 1);
    }, 1000);
  };

  // 渲染酒店列表项
  const renderHotelItem = ({item}: {item: HotelType}) => {
    const handlePress = async () => {
      try {
        // 请求酒店详情API
        const response = await fetch(`${BASE_URL}/hotels/detail/${item.id}`); 

        if (response.ok) {
          const hotelDetail = await response.json();
          console.log('===详情', hotelDetail.data.roomTypes);
          // 导航到详情页并传递酒店详情数据，同时保留hotels数据
          navigateTo('detail', {hotelId: item.id, hotelDetail: hotelDetail.data, startDate, endDate, rooms, adults, children, hotels, location});
        } else {
          // API请求失败，使用现有的item数据作为后备
        console.log('API请求失败，使用现有数据');
        navigateTo('detail', {hotelId: item.id, startDate, endDate, rooms, adults, children, hotels});
        }
      } catch (error) {
        // 网络错误，使用现有的item数据作为后备
        console.error('网络请求错误:', error);
        navigateTo('detail', {hotelId: item.id, startDate, endDate, rooms, adults, children, hotels});
      }
    };

    return (
      <TouchableOpacity
        style={styles.hotelItem}
        onPress={handlePress}>
        <Image source={{uri: item.roomTypes[0].photos[0]}} style={styles.hotelImage} />
        <View style={styles.hotelInfo}>
          <View style={styles.hotelNameContainer}>
            <Text style={styles.hotelName}>{item.name}</Text>
            <Text style={styles.hotelStar}>{item.star}星</Text>
          </View>
          <Text style={styles.hotelAddress}>{item.address}</Text>
          <View style={styles.hotelTags}>
            <Text style={styles.hotelTagText}>
              #{item.nearbyInfo}
            </Text>
          </View>
          <View style={styles.hotelPriceContainer}>
            <View style={styles.priceWrapper}>
              <Text style={styles.hotelPriceSymbol}>¥</Text>
              <Text style={styles.hotelPrice}>{item.roomTypes[0].price}</Text>
              <Text style={styles.hotelPriceDesc}>起/晚</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.pageContainer}>
      {/* 顶部核心筛选头 */}
      <View style={styles.listFilterHeader}>
        <View style={styles.headerLeftContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigateTo('hotelSearch')}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text style={styles.headerInfoText} numberOfLines={2}>{location}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text style={styles.headerInfoText} numberOfLines={2}>{ `住 ${formatDate(startDate)} 离 ${formatDate(endDate)}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text style={[styles.headerInfoText, {maxWidth: 20}]}>
              {rooms}间{adults+children}人
          </Text>
          </TouchableOpacity>
          {/* 搜索框 */}
          <View style={styles.searchBoxContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchBox}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                placeholder="酒店/品牌"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>
      </View>
        <TouchableOpacity
          style={styles.filterBtn}>
          <Text style={styles.filterBtnText}>筛选 ▼</Text>
        </TouchableOpacity>
      {/* 酒店列表（支持上滑加载） */}
      <FlatList
        data={hotels}
        renderItem={renderHotelItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={styles.loadMoreFooter}>
            <Text style={styles.loadMoreText}>加载中...</Text>
          </View>
        )}
      />

      {/* 顶部固定的蒙层弹窗 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>

              <View style={styles.modalContent}>
                {/* 位置选择 */}
                  <View style={styles.locationModalContent}>
                    <LocationSelector
                      value={location}
                      onChange={setLocation}
                      placeholder="输入城市"
                    />
                  </View>
                  <View style={styles.horizontalDivider} />

                {/* 日期选择 */}
                  <View style={styles.searchItem}>
                    <DateSelector
                      startDate={startDate}
                      endDate={endDate}
                      onDateSelect={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                      }}
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
                
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  // 关闭弹窗
                  setIsModalVisible(false);
                  // 这里可以添加数据更新的逻辑，例如重新加载酒店列表等
                }}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 选择客房和入住人数弹窗 */}
      <Modal
        visible={isGuestModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGuestModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBottom}
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
                  autoFocus={true}
                />
                <Text style={styles.inputHint}>请输入1-999之间的数字</Text>
              </View>

              <View style={styles.inputModalFooter}>
                <TouchableOpacity
                  style={[styles.inputModalButton, styles.inputModalCancelButton]}
                  onPress={() => setIsInputModalVisible(false)}>
                  <Text style={[styles.inputModalButtonText, styles.inputModalCancelButtonText]}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.inputModalButton, styles.inputModalConfirmButton]}
                  onPress={() => {
                    const num = parseInt(inputNumber);
                    if (num >= 1 && num <= 999) {
                      if (currentSelectType === 'rooms') {
                        setRooms(num);
                      } else if (currentSelectType === 'adults') {
                        setAdults(num);
                      } else if (currentSelectType === 'children') {
                        setChildren(num);
                      }
                      setIsInputModalVisible(false);
                      setIsNumberModalVisible(false);
                    }
                  }}>
                  <Text style={[styles.inputModalButtonText, styles.inputModalConfirmButtonText]}>确认</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};



export default HotelListPage;

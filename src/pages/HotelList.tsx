import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import type {RouteType, HotelType} from '../types';
import {mockHotels} from '../data/mockData';
// 导入react-native-amap-geolocation库
// import {init} from 'react-native-amap-geolocation';
import LocationSelector from '../components/LocationSelector';
import DateSelector from '../components/DateSelector';
import GuestSelector from '../components/GuestSelector';
import {formatDate} from '../utils/dateUtils';

const HotelListPage = ({
  navigateTo,
  routeParams
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  routeParams: any;
}) => {
  const [hotels, setHotels] = useState<HotelType[]>(mockHotels);
  const [page, setPage] = useState<number>(1);

  // 状态变量
  const [location, setLocation] = useState<string>(routeParams?.location || '');
  const [startDate, setStartDate] = useState<string>(
    routeParams?.startDate || '',
  );
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '');
  console.log('startDate', startDate);
  console.log('endDate', endDate);
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
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
        ...mockHotels.map(hotel => ({...hotel, id: `${hotel.id}_${page + 1}`})),
      ]);
      setPage(prev => prev + 1);
    }, 1000);
  };

  // 渲染酒店列表项
  const renderHotelItem = ({item}: {item: HotelType}) => (
    <TouchableOpacity
      style={styles.hotelItem}
      onPress={() => navigateTo('detail', {hotelId: item.id})}>
      <Image source={{uri: item.mainImage}} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <View style={styles.hotelNameContainer}>
          <Text style={styles.hotelName}>{item.name.cn}</Text>
          <Text style={styles.hotelStar}>{item.star}星</Text>
        </View>
        <Text style={styles.hotelAddress}>{item.address}</Text>
        <View style={styles.hotelTags}>
          {item.tags.slice(0, 2).map((tag, idx) => (
            <Text key={idx} style={styles.hotelTagText}>
              #{tag}
            </Text>
          ))}
        </View>
        <View style={styles.hotelPriceContainer}>
          <Text style={styles.hotelScore}>{item.score}分</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.hotelPriceSymbol}>¥</Text>
            <Text style={styles.hotelPrice}>{item.price}</Text>
            <Text style={styles.hotelPriceDesc}>起/晚</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // 列表页筛选头样式
  listFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backBtn: {
    // width: 60,
    marginRight: 8,
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterHeaderText: {
    fontSize: 12,
    color: '#333',
    flexWrap: 'wrap',
    width: '20%',
  },
  filterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    alignSelf: 'flex-end', 
  },
  filterBtnText: {
    fontSize: 12,
    color: '#333',
  },
  headerInfoItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 0,
  },
  headerInfoText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'left' as const,
    maxWidth: 50
  },
  searchBoxContainer: {
    marginLeft: 8,
    flex: 1,
    maxWidth: 200,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 12,
    color: '#999',
    marginRight: 6,
  },
  searchBox: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    padding: 0,
  },
  // 酒店列表项样式
  hotelItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  hotelImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  hotelInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  hotelNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    maxWidth: '80%',
  },
  hotelStar: {
    fontSize: 12,
    color: '#ff9500',
    borderWidth: 1,
    borderColor: '#ff9500',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  hotelAddress: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  hotelTags: {
    flexDirection: 'row',
    gap: 6,
  },
  hotelTagText: {
    fontSize: 10,
    color: '#1890ff',
    backgroundColor: 'rgba(24,144,255,0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  hotelPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelScore: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '500',
  },
  priceWrapper: {
    alignItems: 'flex-end',
  },
  hotelPriceSymbol: {
    fontSize: 12,
    color: '#ff4d4f',
    fontWeight: '500',
  },
  hotelPrice: {
    fontSize: 18,
    color: '#ff4d4f',
    fontWeight: '600',
  },
  hotelPriceDesc: {
    fontSize: 10,
    color: '#666',
  },
  // 加载更多样式
  loadMoreFooter: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    color: '#666',
  },
  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    marginTop: 66,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '80%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modalContent: {
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  locationModalContent: {
    // 位置选择内容样式
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44,
  },
  locationInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  verticalDivider: {
    width: 0.5,
    height: '60%',
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 20,
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1890ff',
  },
  horizontalDivider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#eee',
    marginTop: 8,
    marginBottom: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  searchLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  guestInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  guestInfoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  guestModalContent: {
    // 客房和人数选择内容样式
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // 客房和人数选择样式
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestRowLabel: {
    fontSize: 14,
    color: '#333',
  },
  numberControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  numberButtonDisabled: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  numberButtonText: {
    fontSize: 18,
    color: '#1890ff',
    fontWeight: '600',
  },
  numberButtonTextDisabled: {
    color: '#999',
  },
  numberValue: {
    minWidth: 40,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  numberValueText: {
    fontSize: 14,
    color: '#333',
  },
  // 间人数量容器
  modalBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  guestModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  numberModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  inputModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  // 数字选择弹窗样式
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  numberGridItem: {
    width: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberGridItemText: {
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 40,
    textAlign: 'center',
  },
  // 输入数字弹窗样式
  inputModalContent: {
    padding: 16,
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  inputModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputModalCancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  inputModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8,
  },
  inputModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputModalCancelButtonText: {
    color: '#333',
  },
  inputModalConfirmButtonText: {
    color: '#fff',
  },
});

export default HotelListPage;

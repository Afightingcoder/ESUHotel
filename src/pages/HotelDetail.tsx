import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import Calendar from '../components/Calendar';
import GuestSelector from '../components/GuestSelector';

const HotelDetailPage = ({
  navigateBack,
  routeParams,
}: {
  navigateBack: (params?: any) => void;
  routeParams: any;
}) => {
  // 获取当前酒店数据 - 不使用模拟数据，只使用接口返回的数据
  const currentHotel = routeParams?.hotelDetail;
    console.log('===接收详情',currentHotel, '地点=====',routeParams?.location);

  // 日期状态管理
  const [startDate, setStartDate] = useState<string>(routeParams?.startDate || '2026-03-10');
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '2026-03-11');
  
  // 房间和人数状态管理
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  
  // 弹窗状态
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);

  // 处理日期选择
  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ScrollView style={styles.pageContainer}>
      {/* 顶部导航头 */}
      <View style={styles.detailHeader}>
        <TouchableOpacity 
          onPress={() => {
            // 返回列表页时传递更新后的数据
            navigateBack({ 
              updatedData: {
                startDate,
                endDate,
                rooms,
                adults,
                children,
                hotels: routeParams?.hotels || [],
                location: routeParams?.location || ''
              }
            });
          }} 
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{currentHotel.name}</Text>
        <View style={styles.emptyView} />
      </View>

      {/* 大图Banner（支持左右滚动） */}
      <FlatList
  // 修复点1：过滤+清洗URL（去除空格、过滤空值），同时做安全判断
  data={
    currentHotel?.photos // 先判断currentHotel是否存在
      ? currentHotel.photos
          .map(url => url.trim()) // 去除URL前后的空格（核心修复！）
          .filter(url => url) // 过滤清洗后为空的URL
      : ['https://picsum.photos/id/1031/800/400'] // 兜底图
  }
  renderItem={({ item }) => (
    // 修复点2：给Image加兜底（可选，进一步保证显示）
    <Image
      source={{ 
        uri: item,
        // 兼容iOS/Android的URI解析（可选）
        cache: 'force-cache' 
      }}
      style={styles.detailBanner}
      // 图片加载失败时显示兜底图（关键！）
      onError={() => console.log('图片加载失败：', item)}
      fallbackSource={{ uri: 'https://picsum.photos/id/1031/800/400' }} // RN 0.73+ 支持
    />
  )}
  keyExtractor={(item, idx) => `img_${idx}_${item}`} // 优化key（避免重复）
  horizontal
  showsHorizontalScrollIndicator={true}
  pagingEnabled
/>

      {/* 酒店基础信息 */}
      <View style={styles.hotelBaseInfo}>
        <View style={styles.baseInfoRow}>
          <Text style={styles.hotelNameLarge}>{currentHotel.name}</Text>
          <Text style={styles.hotelStarLarge}>{currentHotel.star}星</Text>
        </View>
        <Text style={styles.hotelAddressLarge}>{currentHotel.address}</Text>
        <View style={styles.facilitiesContainer}>
          <Text style={styles.facilityLabel}>酒店设施：</Text>
          <View style={styles.facilitiesList}>
            <Text style={styles.facilityText}>免费Wi-Fi</Text>
            <Text style={styles.facilityText}>停车场</Text>
            <Text style={styles.facilityText}>24小时前台</Text>
          </View>
        </View>
      </View>

      {/* 日历+人间夜Banner */}
      <View style={styles.calendarBanner}>
        <Calendar
          onDateSelect={handleDateSelect}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
        <View style={styles.roomNightContainer}>
          <View style={styles.roomNightContent}>
            <Text style={styles.roomNightLabel}>入住间夜</Text>
            <TouchableOpacity style={styles.roomNightBtn} onPress={() => setIsGuestModalVisible(true)}>
              <Text style={styles.roomNightText}>{rooms}间{adults+children}人 ▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 房型价格列表（从低到高排序） */}
      <View style={styles.roomTypesContainer}>
        <Text style={styles.sectionTitle}>
          房型价格（{currentHotel.roomTypes.length}种房型）
        </Text>
        {currentHotel.roomTypes
          .sort((a, b) => a.price - b.price) // 按价格从低到高排序
          .map(roomType => (
            <View key={roomType.id} style={styles.roomTypeItem}>
              <View style={styles.roomTypeLeftContent}>
                {roomType.photos && roomType.photos.length > 0 && (
                  <Image source={{uri: roomType.photos[0]}} style={styles.roomTypeImage} />
                )}
                <View style={styles.roomTypeInfo}>
                  <Text style={styles.roomTypeName}>{roomType.name}</Text>
                </View>
              </View>
              <View style={styles.roomTypePrice}>
                <Text style={styles.roomPriceSymbol}>¥</Text>
                <Text style={styles.roomPrice}>{roomType.price}</Text>
                <Text style={styles.roomPriceDesc}>/晚</Text>
                <View style={styles.roomTypeBottomRow}>
                  <Text style={styles.roomTypeDesc}>仅剩 {roomType.stock} 间</Text>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>立即预订</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // 详情页样式
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    width: 60,
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  emptyView: {
    width: 60,
  },
  detailBanner: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  hotelBaseInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  baseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  hotelStarLarge: {
    fontSize: 14,
    color: '#ff9500',
    borderWidth: 1,
    borderColor: '#ff9500',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotelAddressLarge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  facilitiesContainer: {
    marginBottom: 8,
  },
  facilityLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // 日历Banner样式
  calendarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roomNightContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  roomNightContent: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  roomNightLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  roomNightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomNightText: {
    fontSize: 14,
    color: '#333',
  },
  // 房型价格列表样式
  roomTypesContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  roomTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roomTypeLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  roomTypeImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
    resizeMode: 'cover',
  },
  roomTypeInfo: {
    flex: 1,
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  roomTypeBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  roomTypeDesc: {
    fontSize: 12,
    color: '#666',
  },
  roomTypePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roomPriceSymbol: {
    fontSize: 14,
    color: '#ff4d4f',
    fontWeight: '500',
  },
  roomPrice: {
    fontSize: 20,
    color: '#ff4d4f',
    fontWeight: '600',
  },
  roomPriceDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  bookBtn: {
    width: 80,
    height: 32,
    backgroundColor: '#1890ff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  // 弹窗样式
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
});

export default HotelDetailPage;

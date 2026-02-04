import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';
import { mockHotels } from '../data/mockData';
import Calendar from '../components/Calendar';

const HotelDetailPage = ({
  navigateBack,
  routeParams
}: {
  navigateBack: () => void;
  routeParams: any;
}) => {
  // 获取当前酒店数据
  const currentHotel = mockHotels.find(hotel => hotel.id === routeParams.hotelId) || mockHotels[0];
  
  // 日期状态管理
  const [startDate, setStartDate] = useState<string>('2026-03-10');
  const [endDate, setEndDate] = useState<string>('2026-03-11');
  
  // 处理日期选择
  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ScrollView style={styles.pageContainer}>
      {/* 顶部导航头 */}
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={navigateBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← 返回列表</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{currentHotel.name.cn}</Text>
        <View style={styles.emptyView} />
      </View>

      {/* 大图Banner（支持左右滚动） */}
      <FlatList
        data={currentHotel.images}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.detailBanner} />
        )}
        keyExtractor={(item, idx) => `img_${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />

      {/* 酒店基础信息 */}
      <View style={styles.hotelBaseInfo}>
        <View style={styles.baseInfoRow}>
          <Text style={styles.hotelNameLarge}>{currentHotel.name.cn}</Text>
          <Text style={styles.hotelStarLarge}>{currentHotel.star}星</Text>
        </View>
        <Text style={styles.hotelAddressLarge}>{currentHotel.address}</Text>
        <View style={styles.facilitiesContainer}>
          <Text style={styles.facilityLabel}>酒店设施：</Text>
          <View style={styles.facilitiesList}>
            {currentHotel.facilities.map((facility, idx) => (
              <Text key={idx} style={styles.facilityText}>{facility}</Text>
            ))}
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
          <Text style={styles.roomNightLabel}>入住间夜：</Text>
          <TouchableOpacity style={styles.roomNightBtn}>
            <Text style={styles.roomNightText}>1间1晚 ▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 房型价格列表（从低到高排序） */}
      <View style={styles.roomTypesContainer}>
        <Text style={styles.sectionTitle}>房型价格（{currentHotel.roomTypes.length}种房型）</Text>
        {currentHotel.roomTypes
          .sort((a, b) => a.price - b.price) // 按价格从低到高排序
          .map(roomType => (
            <View key={roomType.id} style={styles.roomTypeItem}>
              <View style={styles.roomTypeInfo}>
                <Text style={styles.roomTypeName}>{roomType.name}</Text>
                <Text style={styles.roomTypeDesc}>{roomType.desc}</Text>
              </View>
              <View style={styles.roomTypePrice}>
                <Text style={styles.roomPriceSymbol}>¥</Text>
                <Text style={styles.roomPrice}>{roomType.price}</Text>
                <Text style={styles.roomPriceDesc}>/晚</Text>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>立即预订</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  // 详情页样式
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backBtn: {
    width: 60,
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1
  },
  emptyView: {
    width: 60,
  },
  detailBanner: {
    width: '100%',
    height: 220,
    resizeMode: 'cover'
  },
  hotelBaseInfo: {
    padding: 16,
    backgroundColor: '#fff'
  },
  baseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  hotelNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  hotelStarLarge: {
    fontSize: 14,
    color: '#ff9500',
    borderWidth: 1,
    borderColor: '#ff9500',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  hotelAddressLarge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  facilitiesContainer: {
    marginBottom: 8
  },
  facilityLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  facilityText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
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
    borderBottomColor: '#eee'
  },
  roomNightContainer: {
    marginLeft: 12,
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  roomNightLabel: {
    fontSize: 14,
    color: '#333'
  },
  roomNightBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roomNightText: {
    fontSize: 14,
    color: '#333'
  },
  // 房型价格列表样式
  roomTypesContainer: {
    padding: 16,
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  roomTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  roomTypeInfo: {
    flex: 1
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4
  },
  roomTypeDesc: {
    fontSize: 12,
    color: '#666'
  },
  roomTypePrice: {
    alignItems: 'flex-end'
  },
  roomPriceSymbol: {
    fontSize: 14,
    color: '#ff4d4f',
    fontWeight: '500'
  },
  roomPrice: {
    fontSize: 20,
    color: '#ff4d4f',
    fontWeight: '600'
  },
  roomPriceDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8
  },
  bookBtn: {
    width: 80,
    height: 32,
    backgroundColor: '#1890ff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  }
});

export default HotelDetailPage;

import React, {useState, useEffect} from 'react';
import {ScrollView, Alert, Platform} from 'react-native';
import type {RouteType} from '../../types';
import LoadingModal from '../../components/LoadingModal';
import {formatDate} from '../../utils/dateUtils';
import {getHotelList} from '../../utils/api';
import {styles} from './styles';
import {init} from 'react-native-amap-geolocation';
import {useHotelSearch} from './hooks/useHotelSearch';
import SearchBanner from './components/SearchBanner';
import SearchForm from './components/SearchForm';
import QuickTags from './components/QuickTags';
import FilterModal from './components/FilterModal';

const HotelSearchPage = ({
  navigateTo,
  routeParams,
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  routeParams?: any;
}) => {
  const {
    location,
    setLocation,
    keyword,
    setKeyword,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    rooms,
    setRooms,
    adults,
    setAdults,
    children,
    setChildren,
    selectedPrice,
    setSelectedPrice,
    selectedStars,
    setSelectedStars,
    filters,
    setFilters,
    bannerHotel,
  } = useHotelSearch(routeParams);

  const [loading] = useState<boolean>(false);
  const [isGuestModalVisible, setIsGuestModalVisible] =
    useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      init({
        ios: '',
        android: '81583f4cae74715f049663264b247f14',
      });
    }
  }, []);

  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = async () => {
    try {
      const searchParams: any = {
        location,
        keyword,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        rooms,
        guests: adults + children,
      };

      if (selectedPrice !== null) {
        const priceRanges: Record<number, {min?: number; max?: number}> = {
          200: {max: 200},
          350: {min: 200, max: 350},
          400: {min: 350, max: 400},
          500: {min: 400, max: 500},
          900: {min: 500, max: 900},
          1400: {min: 900, max: 1400},
          1401: {min: 1400},
        };

        const priceRange = priceRanges[selectedPrice];
        if (priceRange) {
          if (priceRange.min) searchParams.minPrice = priceRange.min;
          if (priceRange.max) searchParams.maxPrice = priceRange.max;
        }
      }

      if (selectedStars.length > 0) {
        searchParams.stars = selectedStars;
      }

      console.log('搜索参数:', searchParams);

      const hotelList = await getHotelList(searchParams);
      console.log('获取酒店列表成功:', hotelList);

      navigateTo('list', {
        location,
        keyword,
        filters,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        rooms,
        adults,
        children,
        hotels: hotelList,
        selectedPrice,
        selectedStars,
      });
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      Alert.alert('查询失败', '获取酒店列表时出现错误，请稍后重试');
    }
  };

  return (
    <ScrollView style={styles.pageContainer}>
      <SearchBanner
        bannerHotel={bannerHotel}
        onPress={() =>
          navigateTo('detail', {
            hotelId: bannerHotel.id,
            hotelDetail: bannerHotel,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            rooms,
            adults,
            children,
          })
        }
      />

      <SearchForm
        location={location}
        setLocation={setLocation}
        keyword={keyword}
        setKeyword={setKeyword}
        startDate={startDate}
        endDate={endDate}
        onDateSelect={handleDateSelect}
        rooms={rooms}
        adults={adults}
        children={children}
        setRooms={setRooms}
        setAdults={setAdults}
        setChildren={setChildren}
        selectedPrice={selectedPrice}
        selectedStars={selectedStars}
        isGuestModalVisible={isGuestModalVisible}
        setIsGuestModalVisible={setIsGuestModalVisible}
        isFilterModalVisible={isFilterModalVisible}
        setIsFilterModalVisible={setIsFilterModalVisible}
        onSearch={handleSearch}
      />

      <QuickTags keyword={keyword} onTagPress={setKeyword} />

      <LoadingModal visible={loading} message="紧急定位ing~" />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        selectedStars={selectedStars}
        setSelectedStars={setSelectedStars}
        setFilters={setFilters}
      />
    </ScrollView>
  );
};

export default HotelSearchPage;

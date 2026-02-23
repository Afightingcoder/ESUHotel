import {useState, useEffect, useMemo} from 'react';
import type {HotelType} from '../../../types';
import {formatDate} from '../../../utils/dateUtils';
import {getHotelDetail, getHotelList} from '../../../utils/api';
import type {AdvancedFilters} from './useHotelFilters';

export const useHotelList = (
  routeParams?: any,
  filters?: {
    sortType: string;
    selectedPrice: number | null;
    selectedStars: number[];
    advancedFilters: AdvancedFilters;
  },
) => {
  const [location, setLocation] = useState<string>(routeParams?.location || '');
  const [startDate, setStartDate] = useState<string>(
    routeParams?.startDate || '',
  );
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '');
  const [hotels, setHotels] = useState<HotelType[]>(routeParams?.hotels || []);
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  const [searchKeyword, setSearchKeyword] = useState<string>(
    routeParams?.keyword || '',
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (routeParams?.updatedData) {
      const {
        startDate: updatedStartDate,
        endDate: updatedEndDate,
        rooms: updatedRooms,
        adults: updatedAdults,
        children: updatedChildren,
        hotels: updatedHotels,
        location: updatedLocation,
      } = routeParams.updatedData;
      if (updatedStartDate) setStartDate(updatedStartDate);
      if (updatedEndDate) setEndDate(updatedEndDate);
      if (updatedLocation) setLocation(updatedLocation);
      if (updatedRooms) setRooms(updatedRooms);
      if (updatedAdults) setAdults(updatedAdults);
      if (updatedChildren) setChildren(updatedChildren);
      if (updatedHotels) setHotels(updatedHotels);
    }
  }, [routeParams]);

  useEffect(() => {
    if (routeParams) {
      if (routeParams.keyword !== undefined)
        setSearchKeyword(routeParams.keyword);
      if (routeParams.startDate) setStartDate(routeParams.startDate);
      if (routeParams.endDate) setEndDate(routeParams.endDate);
      if (routeParams.rooms) setRooms(routeParams.rooms);
      if (routeParams.adults) setAdults(routeParams.adults);
      if (routeParams.children) setChildren(routeParams.children);
      if (routeParams.hotels) setHotels(routeParams.hotels);
      if (routeParams.location) setLocation(routeParams.location);
    }
  }, [routeParams]);

  const sortedHotels = useMemo(() => {
    const sortType = filters?.sortType || 'default';
    let result = [...hotels];

    switch (sortType) {
      case 'price_low':
        result.sort(
          (a, b) =>
            (a.roomTypes?.[0]?.price || 0) - (b.roomTypes?.[0]?.price || 0),
        );
        break;
      case 'price_high':
        result.sort(
          (a, b) =>
            (b.roomTypes?.[0]?.price || 0) - (a.roomTypes?.[0]?.price || 0),
        );
        break;
      case 'star_high':
        result.sort((a, b) => b.star - a.star);
        break;
      default:
        break;
    }

    return result;
  }, [hotels, filters?.sortType]);

  const searchHotels = async (params?: {
    price?: number | null;
    stars?: number[];
    filters?: AdvancedFilters;
  }) => {
    try {
      const searchParams: any = {
        location,
        keyword: searchKeyword,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        rooms,
        guests: adults + children,
      };

      const priceToUse =
        params?.price !== undefined ? params.price : filters?.selectedPrice;
      if (priceToUse !== null) {
        const priceRanges: Record<number, {min?: number; max?: number}> = {
          200: {max: 200},
          350: {min: 200, max: 350},
          400: {min: 350, max: 400},
          500: {min: 400, max: 500},
          900: {min: 500, max: 900},
          1400: {min: 900, max: 1400},
          1401: {min: 1400},
        };

        const priceRange = priceRanges[priceToUse];
        if (priceRange) {
          if (priceRange.min) searchParams.minPrice = priceRange.min;
          if (priceRange.max) searchParams.maxPrice = priceRange.max;
        }
      }

      const starsToUse = params?.stars || filters?.selectedStars || [];
      if (starsToUse.length > 0) {
        searchParams.stars = starsToUse;
      }

      const filtersToUse = params?.filters || filters?.advancedFilters;
      const filterKeywords: string[] = [];

      if (filtersToUse?.hotFilters.length > 0) {
        filterKeywords.push(...filtersToUse.hotFilters);
      }
      if (filtersToUse?.accommodationTypes.length > 0) {
        filterKeywords.push(...filtersToUse.accommodationTypes);
      }
      if (filtersToUse?.hotelFeatures.length > 0) {
        filterKeywords.push(...filtersToUse.hotelFeatures);
      }
      if (filtersToUse?.roomFeatures.length > 0) {
        filterKeywords.push(...filtersToUse.roomFeatures);
      }

      if (filterKeywords.length > 0) {
        searchParams.keyword = searchKeyword
          ? `${searchKeyword} ${filterKeywords.join(' ')}`
          : filterKeywords.join(' ');
      }

      console.log('搜索参数:', searchParams);

      const hotelList = await getHotelList(searchParams);
      console.log('获取酒店列表成功:', hotelList);

      if (hotelList) {
        setHotels(hotelList);
      }
    } catch (error) {
      console.error('获取酒店列表失败:', error);
    }
  };

  const handleLoadMore = () => {
    setTimeout(() => {}, 1000);
  };

  const navigateToDetail = async (item: HotelType, navigateTo: any) => {
    try {
      const hotelDetail = await getHotelDetail(`${item.id}`);
      console.log('===单个酒店详情', hotelDetail.data.amenities);
      navigateTo('detail', {
        hotelId: item.id,
        hotelDetail: hotelDetail.data,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        hotels,
        location,
        keyword: searchKeyword,
        selectedPrice: filters?.selectedPrice,
        selectedStars: filters?.selectedStars,
        advancedFilters: filters?.advancedFilters,
        sortType: filters?.sortType,
      });
    } catch (error) {
      console.error('网络请求错误:', error);
      navigateTo('detail', {
        hotelId: item.id,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        hotels,
        location,
        keyword: searchKeyword,
        selectedPrice: filters?.selectedPrice,
        selectedStars: filters?.selectedStars,
        advancedFilters: filters?.advancedFilters,
        sortType: filters?.sortType,
      });
    }
  };

  return {
    location,
    setLocation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    hotels,
    setHotels,
    rooms,
    setRooms,
    adults,
    setAdults,
    children,
    setChildren,
    searchKeyword,
    setSearchKeyword,
    sortedHotels,
    isModalVisible,
    setIsModalVisible,
    searchHotels,
    handleLoadMore,
    navigateToDetail,
  };
};

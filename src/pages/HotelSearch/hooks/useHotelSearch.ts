import {useState, useEffect} from 'react';
import {getHotelDetail, getHotelList} from '../../../utils/api';
import {getTodayDate, getTomorrowDate} from './useDateRange';

export const useHotelSearch = (routeParams?: any) => {
  const [location, setLocation] = useState<string>(routeParams?.location || '上海');
  const [keyword, setKeyword] = useState<string>(routeParams?.keyword || '');
  const [startDate, setStartDate] = useState<string>(routeParams?.startDate || getTodayDate());
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || getTomorrowDate());
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(routeParams?.selectedPrice || null);
  const [selectedStars, setSelectedStars] = useState<number[]>(routeParams?.selectedStars || []);
  const [filters, setFilters] = useState<{star: number[]; priceRange: number[]}>({star: [], priceRange: []});
  const [bannerHotel, setBannerHotel] = useState<any>(null);

  useEffect(() => {
    if (routeParams) {
      if (routeParams.location) setLocation(routeParams.location);
      if (routeParams.keyword) setKeyword(routeParams.keyword);
      if (routeParams.startDate) setStartDate(routeParams.startDate);
      if (routeParams.endDate) setEndDate(routeParams.endDate);
      if (routeParams.rooms) setRooms(routeParams.rooms);
      if (routeParams.adults) setAdults(routeParams.adults);
      if (routeParams.children) setChildren(routeParams.children);
      if (routeParams.selectedPrice !== undefined) setSelectedPrice(routeParams.selectedPrice);
      if (routeParams.selectedStars) setSelectedStars(routeParams.selectedStars);
    }
  }, [routeParams]);

  useEffect(() => {
    const fetchBannerHotel = async () => {
      try {
        const response = await getHotelDetail('699b08ebea44f20434e38c9c');
        if (response && response.data) {
          setBannerHotel(response.data);
        }
      } catch (error) {
        console.error('获取banner酒店数据失败:', error);
      }
    };

    fetchBannerHotel();
  }, []);

  return {
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
  };
};

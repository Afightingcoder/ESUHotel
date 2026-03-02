import { useState, useEffect, useCallback } from 'react';
import type { SearchRouteParams, HotelSearchParams } from '../types';
import { getTodayDate, getTomorrowDate, formatDate } from '../utils/dateUtils';
import { hotFiltersMap, getPriceRangeParams } from '../utils/mappings';

interface SearchFormState {
  location: string;
  keyword: string;
  startDate: string;
  endDate: string;
  rooms: number;
  adults: number;
  children: number;
  selectedPrice: number | null;
  selectedStars: number[];
}

interface UseSearchFormResult {
  formState: SearchFormState;
  setLocation: (location: string) => void;
  setKeyword: (keyword: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setRooms: (rooms: number) => void;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setSelectedPrice: (price: number | null) => void;
  setSelectedStars: (stars: number[]) => void;
  handleDateSelect: (start: string, end: string) => void;
  buildSearchParams: () => HotelSearchParams;
}

export const useSearchForm = (routeParams?: SearchRouteParams): UseSearchFormResult => {
  const [location, setLocation] = useState<string>(routeParams?.location || '上海');
  const [keyword, setKeyword] = useState<string>(routeParams?.keyword || '');
  const [startDate, setStartDate] = useState<string>(routeParams?.startDate || getTodayDate());
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || getTomorrowDate());
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(routeParams?.selectedPrice || null);
  const [selectedStars, setSelectedStars] = useState<number[]>(routeParams?.selectedStars || []);

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

  const handleDateSelect = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const buildSearchParams = useCallback((): HotelSearchParams => {
    let mappedKeyword = keyword;
    Object.entries(hotFiltersMap).forEach(([chinese, english]) => {
      if (keyword === chinese) {
        mappedKeyword = english;
      }
    });

    const searchParams: HotelSearchParams = {
      location,
      keyword: mappedKeyword,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      rooms,
      guests: adults + children,
    };

    if (selectedPrice !== null) {
      const priceRange = getPriceRangeParams(selectedPrice);
      if (priceRange) {
        if (priceRange.min !== undefined) searchParams.minPrice = priceRange.min;
        if (priceRange.max !== undefined) searchParams.maxPrice = priceRange.max;
      }
    }

    if (selectedStars.length > 0) {
      searchParams.stars = selectedStars;
    }

    return searchParams;
  }, [keyword, location, startDate, endDate, rooms, adults, children, selectedPrice, selectedStars]);

  return {
    formState: {
      location,
      keyword,
      startDate,
      endDate,
      rooms,
      adults,
      children,
      selectedPrice,
      selectedStars,
    },
    setLocation,
    setKeyword,
    setStartDate,
    setEndDate,
    setRooms,
    setAdults,
    setChildren,
    setSelectedPrice,
    setSelectedStars,
    handleDateSelect,
    buildSearchParams,
  };
};

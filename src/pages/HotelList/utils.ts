import type {HotelType} from '../../types';

export const ITEM_HEIGHT = 140;

export const PRICE_RANGES: Record<number, {min?: number; max?: number}> = {
  200: {max: 200},
  350: {min: 200, max: 350},
  400: {min: 350, max: 400},
  500: {min: 400, max: 500},
  900: {min: 500, max: 900},
  1400: {min: 900, max: 1400},
  1401: {min: 1400},
};

export const getHotelPrice = (hotel: HotelType): number => {
  const roomTypes = hotel.roomTypes as any;
  return roomTypes?.available?.[0]?.price || roomTypes?.[0]?.price || 0;
};

export const sortHotels = (hotels: HotelType[], sortType: string): HotelType[] => {
  const result = [...hotels];
  
  switch (sortType) {
    case 'price_low':
      result.sort((a, b) => getHotelPrice(a) - getHotelPrice(b));
      break;
    case 'price_high':
      result.sort((a, b) => getHotelPrice(b) - getHotelPrice(a));
      break;
    case 'star_high':
      result.sort((a, b) => (b.star || 0) - (a.star || 0));
      break;
    default:
      break;
  }
  
  return result;
};

export const buildSearchParams = (
  location: string,
  searchKeyword: string,
  startDate: string,
  endDate: string,
  rooms: number,
  adults: number,
  children: number,
  selectedPrice: number | null,
  selectedStars: number[],
  advancedFilters: {
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  },
  formatDateFn: (date: string) => string,
): any => {
  const searchParams: any = {
    location,
    keyword: searchKeyword,
    startDate: formatDateFn(startDate),
    endDate: formatDateFn(endDate),
    rooms,
    guests: adults + children,
  };

  if (selectedPrice !== null) {
    const priceRange = PRICE_RANGES[selectedPrice];
    if (priceRange) {
      if (priceRange.min) searchParams.minPrice = priceRange.min;
      if (priceRange.max) searchParams.maxPrice = priceRange.max;
    }
  }

  if (selectedStars.length > 0) {
    searchParams.stars = selectedStars;
  }

  const filterKeywords: string[] = [];
  
  if (advancedFilters.hotFilters.length > 0) {
    filterKeywords.push(...advancedFilters.hotFilters);
  }
  if (advancedFilters.accommodationTypes.length > 0) {
    filterKeywords.push(...advancedFilters.accommodationTypes);
  }
  if (advancedFilters.hotelFeatures.length > 0) {
    filterKeywords.push(...advancedFilters.hotelFeatures);
  }
  if (advancedFilters.roomFeatures.length > 0) {
    filterKeywords.push(...advancedFilters.roomFeatures);
  }
  
  if (filterKeywords.length > 0) {
    searchParams.keyword = searchKeyword 
      ? `${searchKeyword} ${filterKeywords.join(' ')}` 
      : filterKeywords.join(' ');
  }

  return searchParams;
};

export const getSortLabel = (sortType: string): string => {
  switch (sortType) {
    case 'price_low':
      return '低价优先';
    case 'price_high':
      return '高价优先';
    case 'star_high':
      return '高星优先';
    default:
      return '默认排序';
  }
};

export const getAdvancedFilterCount = (filters: {
  hotFilters: string[];
  accommodationTypes: string[];
  hotelFeatures: string[];
  roomFeatures: string[];
}): number => {
  return (
    filters.hotFilters.length +
    filters.accommodationTypes.length +
    filters.hotelFeatures.length +
    filters.roomFeatures.length
  );
};

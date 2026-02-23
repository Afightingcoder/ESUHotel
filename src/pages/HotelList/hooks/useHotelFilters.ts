import {useState} from 'react';
import {parseKeywordFilters} from '../../../utils/mappings';

export interface AdvancedFilters {
  hotFilters: string[];
  accommodationTypes: string[];
  hotelFeatures: string[];
  roomFeatures: string[];
}

export const useHotelFilters = (routeParams?: any) => {
  const [sortType, setSortType] = useState<string>('default');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(
    routeParams?.selectedPrice || null,
  );
  const [selectedStars, setSelectedStars] = useState<number[]>(
    routeParams?.selectedStars || [],
  );
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(
    () => {
      const keyword = routeParams?.keyword || '';
      return parseKeywordFilters(keyword);
    },
  );

  const [isSortFilterVisible, setIsSortFilterVisible] =
    useState<boolean>(false);
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] =
    useState<boolean>(false);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] =
    useState<boolean>(false);

  return {
    sortType,
    setSortType,
    selectedPrice,
    setSelectedPrice,
    selectedStars,
    setSelectedStars,
    advancedFilters,
    setAdvancedFilters,
    isSortFilterVisible,
    setIsSortFilterVisible,
    isPriceStarFilterVisible,
    setIsPriceStarFilterVisible,
    isAdvancedFilterVisible,
    setIsAdvancedFilterVisible,
  };
};

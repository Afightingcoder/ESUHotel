import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface AdvancedFilters {
  hotFilters: string[];
  accommodationTypes: string[];
  hotelFeatures: string[];
  roomFeatures: string[];
}

interface FilterBarProps {
  sortType: string;
  selectedPrice: number | null;
  selectedStars: number[];
  advancedFilters: AdvancedFilters;
  isSortFilterVisible: boolean;
  isPriceStarFilterVisible: boolean;
  isAdvancedFilterVisible: boolean;
  onSortPress: () => void;
  onPriceStarPress: () => void;
  onAdvancedFilterPress: () => void;
}

const getSortLabel = (sortType: string): string => {
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

const getAdvancedFilterCount = (filters: AdvancedFilters): number => {
  return (
    filters.hotFilters.length +
    filters.accommodationTypes.length +
    filters.hotelFeatures.length +
    filters.roomFeatures.length
  );
};

const FilterBar: React.FC<FilterBarProps> = ({
  sortType,
  selectedPrice,
  selectedStars,
  advancedFilters,
  isSortFilterVisible,
  isPriceStarFilterVisible,
  isAdvancedFilterVisible,
  onSortPress,
  onPriceStarPress,
  onAdvancedFilterPress,
}) => {
  const advancedFilterCount = getAdvancedFilterCount(advancedFilters);
  const priceStarCount = (selectedPrice !== null ? 1 : 0) + selectedStars.length;

  return (
    <View style={styles.filterBar}>
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={onSortPress}>
        <Text style={[styles.filterBtnText, styles.filterBtnTextActive]}>
          {getSortLabel(sortType)}
        </Text>
        <Text
          style={[
            styles.filterArrow,
            isSortFilterVisible && styles.filterArrowUp,
            styles.filterArrowActive,
          ]}>
          {isSortFilterVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={onPriceStarPress}>
        <Text
          style={[
            styles.filterBtnText,
            (isPriceStarFilterVisible || selectedPrice !== null || selectedStars.length > 0) &&
              styles.filterBtnTextActive,
          ]}>
          价格/星级
        </Text>
        {priceStarCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{priceStarCount}</Text>
          </View>
        )}
        <Text
          style={[
            styles.filterArrow,
            isPriceStarFilterVisible && styles.filterArrowUp,
            (isPriceStarFilterVisible || selectedPrice !== null || selectedStars.length > 0) &&
              styles.filterArrowActive,
          ]}>
          {isPriceStarFilterVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={onAdvancedFilterPress}>
        <Text
          style={[
            styles.filterBtnText,
            (isAdvancedFilterVisible || advancedFilterCount > 0) &&
              styles.filterBtnTextActive,
          ]}>
          筛选
        </Text>
        {advancedFilterCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{advancedFilterCount}</Text>
          </View>
        )}
        <Text
          style={[
            styles.filterArrow,
            isAdvancedFilterVisible && styles.filterArrowUp,
            (isAdvancedFilterVisible || advancedFilterCount > 0) &&
              styles.filterArrowActive,
          ]}>
          {isAdvancedFilterVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterBar;

import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles';

interface FilterBarProps {
  sortType: string;
  selectedPrice: number | null;
  selectedStars: number[];
  advancedFilters: {
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  };
  isSortFilterVisible: boolean;
  isPriceStarFilterVisible: boolean;
  isAdvancedFilterVisible: boolean;
  onSortPress: () => void;
  onPriceStarPress: () => void;
  onAdvancedPress: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortType,
  selectedPrice,
  selectedStars,
  advancedFilters,
  isSortFilterVisible,
  isPriceStarFilterVisible,
  isAdvancedFilterVisible,
  onSortPress,
  onPriceStarPress,
  onAdvancedPress,
}) => {
  const getSortText = () => {
    switch (sortType) {
      case 'default':
        return '默认排序';
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

  const priceStarActiveCount =
    (selectedPrice !== null ? 1 : 0) + selectedStars.length;
  const advancedActiveCount =
    advancedFilters.hotFilters.length +
    advancedFilters.accommodationTypes.length +
    advancedFilters.hotelFeatures.length +
    advancedFilters.roomFeatures.length;

  return (
    <View style={styles.filterBar}>
      <TouchableOpacity style={styles.filterBtn} onPress={onSortPress}>
        <Text style={[styles.filterBtnText, styles.filterBtnTextActive]}>
          {getSortText()}
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
      <TouchableOpacity style={styles.filterBtn} onPress={onPriceStarPress}>
        <Text
          style={[
            styles.filterBtnText,
            (isPriceStarFilterVisible || priceStarActiveCount > 0) &&
              styles.filterBtnTextActive,
          ]}>
          价格/星级
        </Text>
        {priceStarActiveCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{priceStarActiveCount}</Text>
          </View>
        )}
        <Text
          style={[
            styles.filterArrow,
            isPriceStarFilterVisible && styles.filterArrowUp,
            (isPriceStarFilterVisible || priceStarActiveCount > 0) &&
              styles.filterArrowActive,
          ]}>
          {isPriceStarFilterVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterBtn} onPress={onAdvancedPress}>
        <Text
          style={[
            styles.filterBtnText,
            (isAdvancedFilterVisible || advancedActiveCount > 0) &&
              styles.filterBtnTextActive,
          ]}>
          筛选
        </Text>
        {advancedActiveCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{advancedActiveCount}</Text>
          </View>
        )}
        <Text
          style={[
            styles.filterArrow,
            isAdvancedFilterVisible && styles.filterArrowUp,
            (isAdvancedFilterVisible || advancedActiveCount > 0) &&
              styles.filterArrowActive,
          ]}>
          {isAdvancedFilterVisible ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

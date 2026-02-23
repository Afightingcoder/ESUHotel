import React from 'react';
import {View} from 'react-native';
import type {RouteType} from '../../types';
import SortFilter from '../../components/SortFilter';
import PriceStarFilter from '../../components/PriceStarFilter';
import AdvancedFilter from '../../components/AdvancedFilter';
import {removeFilterKeywords} from '../../utils/mappings';
import {styles} from './styles';
import {useHotelFilters} from './hooks/useHotelFilters';
import {useHotelList} from './hooks/useHotelList';
import {ListFilterHeader} from './components/ListFilterHeader';
import {FilterBar} from './components/FilterBar';
import {HotelList as HotelListComponent} from './components/HotelList';
import {SearchConditionsModal} from './components/SearchConditionsModal';

const HotelListPage = ({
  navigateTo,
  routeParams,
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  routeParams: any;
}) => {
  const {
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
  } = useHotelFilters(routeParams);

  const filters = {
    sortType,
    selectedPrice,
    selectedStars,
    advancedFilters,
  };

  const {
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
  } = useHotelList(routeParams, filters);

  const handleGuestChange = (
    newRooms: number,
    newAdults: number,
    newChildren: number,
  ) => {
    setRooms(newRooms);
    setAdults(newAdults);
    setChildren(newChildren);
  };

  return (
    <View style={styles.pageContainer}>
      <ListFilterHeader
        location={location}
        startDate={startDate}
        endDate={endDate}
        rooms={rooms}
        adults={adults}
        children={children}
        searchKeyword={searchKeyword}
        onFilterPress={() => setIsModalVisible(true)}
        onSearchChange={setSearchKeyword}
        onBack={() =>
          navigateTo('hotelSearch', {
            location,
            keyword: searchKeyword,
            startDate,
            endDate,
            rooms,
            adults,
            children,
            selectedPrice,
            selectedStars,
          })
        }
      />

      <FilterBar
        sortType={sortType}
        selectedPrice={selectedPrice}
        selectedStars={selectedStars}
        advancedFilters={advancedFilters}
        isSortFilterVisible={isSortFilterVisible}
        isPriceStarFilterVisible={isPriceStarFilterVisible}
        isAdvancedFilterVisible={isAdvancedFilterVisible}
        onSortPress={() => setIsSortFilterVisible(true)}
        onPriceStarPress={() => setIsPriceStarFilterVisible(true)}
        onAdvancedPress={() => setIsAdvancedFilterVisible(true)}
      />

      <HotelListComponent
        hotels={sortedHotels}
        onLoadMore={handleLoadMore}
        onItemPress={item => navigateToDetail(item, navigateTo)}
      />

      <SearchConditionsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        location={location}
        startDate={startDate}
        endDate={endDate}
        rooms={rooms}
        adults={adults}
        children={children}
        onLocationChange={setLocation}
        onDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onGuestChange={handleGuestChange}
        onConfirm={() => {
          setIsModalVisible(false);
          searchHotels();
        }}
      />

      <SortFilter
        visible={isSortFilterVisible}
        onClose={() => setIsSortFilterVisible(false)}
        onSortChange={setSortType}
        currentSort={sortType}
      />

      <PriceStarFilter
        visible={isPriceStarFilterVisible}
        onClose={() => setIsPriceStarFilterVisible(false)}
        onFilterChange={(price, stars) => {
          setSelectedPrice(price);
          setSelectedStars(stars);
          searchHotels({price, stars});
        }}
        currentPrice={selectedPrice}
        currentStars={selectedStars}
        onRealTimeChange={(price, stars) => {
          setSelectedPrice(price);
          setSelectedStars(stars);
        }}
      />

      <AdvancedFilter
        visible={isAdvancedFilterVisible}
        onClose={() => setIsAdvancedFilterVisible(false)}
        onFilterChange={filters => {
          setAdvancedFilters(filters);
          searchHotels({filters});
        }}
        currentFilters={advancedFilters}
        onRealTimeChange={filters => {
          setAdvancedFilters(filters);
        }}
        onClear={() => {
          const cleanedKeyword = removeFilterKeywords(searchKeyword);
          setSearchKeyword(cleanedKeyword);
        }}
      />
    </View>
  );
};

export default HotelListPage;

import React, {useState, useMemo, useCallback, useRef} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import type {
  RouteType,
  HotelType,
  ListRouteParams,
  DetailRouteParams,
  SearchRouteParams,
  FlatListScrollEvent,
  ItemLayout,
  AdvancedFilters,
} from '../../types';
import SortFilter from '../../components/SortFilter';
import PriceStarFilter from '../../components/PriceStarFilter';
import AdvancedFilter from '../../components/AdvancedFilter';
import {formatDate, calculateNights} from '../../utils/dateUtils';
import {styles} from './styles';
import HotelListSkeleton from './HotelListSkeleton';
import {getHotelDetail, getHotelList} from '../../utils/api';
import {removeFilterKeywords, parseKeywordFilters} from '../../utils/mappings';
import HotelItem from './HotelItem';
import FilterBar from './FilterBar';
import ListHeader from './ListHeader';
import ScrollToTop from './ScrollToTop';
import SearchModal from './SearchModal';
import {sortHotels, buildSearchParams} from './utils';

const ITEM_HEIGHT = 140;
const PAGE_SIZE = 15;

type NavigateFunction = (route: RouteType, params?: SearchRouteParams | DetailRouteParams) => void;

const HotelListPage = ({
  navigateTo,
  routeParams
}: {
  navigateTo: NavigateFunction;
  routeParams: ListRouteParams;
}) => {
  const [location, setLocation] = useState<string>(routeParams?.location || '');
  const [startDate, setStartDate] = useState<string>(routeParams?.startDate || '');
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '');
  const [hotels, setHotels] = useState<HotelType[]>(routeParams?.hotels || []);
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const searchParamsRef = useRef<{
    price: number | null;
    stars: number[];
    filters: AdvancedFilters;
  }>({
    price: null,
    stars: [],
    filters: {
      hotFilters: [],
      accommodationTypes: [],
      hotelFeatures: [],
      roomFeatures: [],
    },
  });

  React.useEffect(() => {
    console.log('接收到的routeParams:', routeParams);
    
    if (routeParams?.updatedData) {
      console.log('接收到的更新数据:', routeParams.updatedData);
      const { startDate: updatedStartDate, endDate: updatedEndDate, rooms: updatedRooms, adults: updatedAdults, children: updatedChildren, hotels: updatedHotels, location: updatedLocation } = routeParams.updatedData;
      if (updatedStartDate) setStartDate(updatedStartDate);
      if (updatedEndDate) setEndDate(updatedEndDate);
      if (updatedLocation) setLocation(updatedLocation);
      if (updatedRooms) setRooms(updatedRooms);
      if (updatedAdults) setAdults(updatedAdults);
      if (updatedChildren) setChildren(updatedChildren);
      if (updatedHotels) setHotels(updatedHotels);
      if (updatedStartDate || updatedEndDate || updatedRooms || updatedAdults || updatedChildren) {
         searchHotels();
      }
    }
  }, [routeParams]); 

  React.useEffect(() => {
    console.log('酒店列表数据:', hotels);
  }, [hotels]);

  const [searchKeyword, setSearchKeyword] = useState<string>(routeParams?.keyword || '');

  const [isSortFilterVisible, setIsSortFilterVisible] = useState<boolean>(false);
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] = useState<boolean>(false);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState<boolean>(false);
  
  const [sortType, setSortType] = useState<string>('default');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(routeParams?.selectedPrice || null);
  const [selectedStars, setSelectedStars] = useState<number[]>(routeParams?.selectedStars || []);
  
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(() => {
    const keyword = routeParams?.keyword || '';
    return parseKeywordFilters(keyword);
  });

  React.useEffect(() => {
    if (routeParams) {
      if (routeParams.keyword !== undefined) setSearchKeyword(routeParams.keyword);
      if (routeParams.selectedPrice !== undefined) setSelectedPrice(routeParams.selectedPrice);
      if (routeParams.selectedStars) setSelectedStars(routeParams.selectedStars);
      if (routeParams.advancedFilters) setAdvancedFilters(routeParams.advancedFilters);
      if (routeParams.sortType) setSortType(routeParams.sortType);
      if (routeParams.startDate) setStartDate(routeParams.startDate);
      if (routeParams.endDate) setEndDate(routeParams.endDate);
      if (routeParams.rooms) setRooms(routeParams.rooms);
      if (routeParams.adults) setAdults(routeParams.adults);
      if (routeParams.children) setChildren(routeParams.children);
      if (routeParams.hotels) setHotels(routeParams.hotels);
      if (routeParams.location) setLocation(routeParams.location);
    }
  }, [routeParams]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);

  // 搜索酒店（首次加载或重新搜索）
  const searchHotels = useCallback(async (params?: {
    price?: number | null;
    stars?: number[];
    filters?: AdvancedFilters;
  }) => {
    setIsLoading(true);
    setCurrentPage(1);
    setHasMore(true);
    
    const currentParams = {
      price: params?.price !== undefined ? params.price : selectedPrice,
      stars: params?.stars || selectedStars,
      filters: params?.filters || advancedFilters,
    };
    searchParamsRef.current = currentParams;

    try {
      const searchParams = buildSearchParams(
        location,
        searchKeyword,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        currentParams.price,
        currentParams.stars,
        currentParams.filters,
        formatDate
      );

      console.log('搜索参数:', searchParams);
      
      const response = await getHotelList({
        ...searchParams,
        page: 1,
        limit: PAGE_SIZE,
      });
      console.log('获取酒店列表成功:', response);
      
      if (response && response.data) {
        setHotels(response.data);
        setHasMore(response.pagination?.hasMore ?? false);
      }
    } catch (error) {
      console.error('获取酒店列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [location, searchKeyword, startDate, endDate, rooms, adults, children, selectedPrice, selectedStars, advancedFilters]);

  // 加载更多
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const searchParams = buildSearchParams(
        location,
        searchKeyword,
        startDate,
        endDate,
        rooms,
        adults,
        children,
        searchParamsRef.current.price,
        searchParamsRef.current.stars,
        searchParamsRef.current.filters,
        formatDate
      );

      console.log('加载更多，页码:', nextPage);
      
      const response = await getHotelList({
        ...searchParams,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      
      if (response && response.data) {
        setHotels(prev => [...prev, ...response.data]);
        setCurrentPage(nextPage);
        setHasMore(response.pagination?.hasMore ?? false);
      }
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isLoading, currentPage, location, searchKeyword, startDate, endDate, rooms, adults, children]);

  const sortedHotels = useMemo(() => {
    return sortHotels(hotels, sortType);
  }, [hotels, sortType]);

  const handleHotelPress = useCallback(async (item: HotelType) => {
    try {
      const hotelDetail = await getHotelDetail(`${item.id}`, {
        startDate,
        endDate,
        rooms,
        guests: adults + children,
      });
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
        selectedPrice,
        selectedStars,
        advancedFilters,
        sortType,
        fromRoute: 'list',
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
        selectedPrice,
        selectedStars,
        advancedFilters,
        sortType,
        fromRoute: 'list',
      });
    }
  }, [startDate, endDate, rooms, adults, children, hotels, location, searchKeyword, selectedPrice, selectedStars, advancedFilters, sortType, navigateTo]);

  const nights = useMemo(() => calculateNights(startDate, endDate), [startDate, endDate]);

  const renderHotelItem = useCallback(({item}: {item: HotelType}) => (
    <HotelItem item={item} onPress={handleHotelPress} rooms={rooms} nights={nights} />
  ), [handleHotelPress, rooms, nights]);

  const keyExtractor = useCallback((item: HotelType) => `${item.id}`, []);

  const getItemLayout = useCallback((_data: unknown, index: number): ItemLayout => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const handleScroll = useCallback((event: FlatListScrollEvent) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  }, []);

  const handleGoBack = useCallback(() => {
    navigateTo('search', {
      location,
      keyword: searchKeyword,
      startDate,
      endDate,
      rooms,
      adults,
      children,
      selectedPrice,
      selectedStars,
    });
  }, [navigateTo, location, searchKeyword, startDate, endDate, rooms, adults, children, selectedPrice, selectedStars]);

  const handleModalConfirm = useCallback(() => {
    setIsModalVisible(false);
    searchHotels();
  }, [searchHotels]);

  const renderListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>暂无符合条件的酒店，修改条件可重新查询</Text>
    </View>
  ), []);

  const renderListFooter = useCallback(() => {
    if (sortedHotels.length === 0) return null;
    
    if (isLoadingMore) {
      return (
        <View style={styles.loadingMoreFooter}>
          <ActivityIndicator size="small" color="#1890ff" />
          <Text style={styles.loadingMoreText}>加载中...</Text>
        </View>
      );
    }
    
    if (!hasMore) {
      return (
        <View style={styles.loadMoreFooter}>
          <Text style={styles.loadMoreText}>———我是有底线的哦———</Text>
        </View>
      );
    }
    
    return null;
  }, [sortedHotels.length, isLoadingMore, hasMore]);

  const handleSortChange = useCallback((type: string) => {
    setSortType(type);
  }, []);

  const handlePriceStarChange = useCallback((price: number | null, stars: number[]) => {
    setSelectedPrice(price);
    setSelectedStars(stars);
    searchHotels({ price, stars });
  }, [searchHotels]);

  const handleAdvancedFilterChange = useCallback((filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
    searchHotels({ filters });
  }, [searchHotels]);

  const handleClearAdvancedFilter = useCallback(() => {
    const cleanedKeyword = removeFilterKeywords(searchKeyword);
    setSearchKeyword(cleanedKeyword);
  }, [searchKeyword]);

  return (
    <View style={styles.pageContainer}>
      <ListHeader
        location={location}
        startDate={startDate}
        endDate={endDate}
        rooms={rooms}
        adults={adults}
        children={children}
        searchKeyword={searchKeyword}
        onBackPress={handleGoBack}
        onHeaderInfoPress={() => setIsModalVisible(true)}
        onSearchKeywordChange={setSearchKeyword}
        onSearchSubmit={searchHotels}
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
        onAdvancedFilterPress={() => setIsAdvancedFilterVisible(true)}
      />
      
      {isLoading ? (
        <HotelListSkeleton />
      ) : (
        <FlatList
          ref={flatListRef}
          data={sortedHotels}
          renderItem={renderHotelItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={renderListEmpty}
          ListFooterComponent={renderListFooter}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}

      <ScrollToTop
        visible={showScrollTop}
        onPress={scrollToTop}
      />

      <SearchModal
        visible={isModalVisible}
        location={location}
        startDate={startDate}
        endDate={endDate}
        rooms={rooms}
        adults={adults}
        children={children}
        isGuestModalVisible={isGuestModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleModalConfirm}
        onLocationChange={setLocation}
        onDateSelect={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onGuestModalOpen={() => setIsGuestModalVisible(true)}
        onGuestModalClose={() => setIsGuestModalVisible(false)}
        onRoomsChange={setRooms}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
      />

      {/* 排序筛选弹窗 */}
      <SortFilter
        visible={isSortFilterVisible}
        onClose={() => setIsSortFilterVisible(false)}
        onSortChange={handleSortChange}
        currentSort={sortType}
      />

      {/* 价格/星级筛选弹窗 */}
      <PriceStarFilter
        visible={isPriceStarFilterVisible}
        onClose={() => setIsPriceStarFilterVisible(false)}
        onFilterChange={handlePriceStarChange}
        currentPrice={selectedPrice}
        currentStars={selectedStars}
        onRealTimeChange={(price, stars) => {
          setSelectedPrice(price);
          setSelectedStars(stars);
        }}
      />

      {/* 综合筛选弹窗 */}
      <AdvancedFilter
        visible={isAdvancedFilterVisible}
        onClose={() => setIsAdvancedFilterVisible(false)}
        onFilterChange={handleAdvancedFilterChange}
        currentFilters={advancedFilters}
        onRealTimeChange={(filters) => {
          setAdvancedFilters(filters);
        }}
        onClear={handleClearAdvancedFilter}
      />
    </View>
  );
};

export default HotelListPage;

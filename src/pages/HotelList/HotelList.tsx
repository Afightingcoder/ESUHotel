import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import type {RouteType, HotelType} from '../../types';
import {mockHotels} from '../../data/mockData';
// 导入react-native-amap-geolocation库
// import {init} from 'react-native-amap-geolocation';
import LocationSelector from '../../components/LocationSelector';
import DateSelector from '../../components/DateSelector';
import GuestSelector from '../../components/GuestSelector';
import SortFilter from '../../components/SortFilter';
import PriceStarFilter from '../../components/PriceStarFilter';
import AdvancedFilter from '../../components/AdvancedFilter';
import {formatDate} from '../../utils/dateUtils';
import {styles} from './styles';
import {getHotelDetail, getHotelList, getImageUrl} from '../../utils/api';
import {
  amenitiesMap,
  removeFilterKeywords,
  parseKeywordFilters,
} from '../../utils/mappings';

const HotelListPage = ({
  navigateTo,
  routeParams,
}: {
  navigateTo: (route: RouteType, params?: any) => void;
  routeParams: any;
}) => {
  // 状态变量
  // const [page, setPage] = useState<number>(1);
  const [location, setLocation] = useState<string>(routeParams?.location || '');
  const [startDate, setStartDate] = useState<string>(
    routeParams?.startDate || '',
  );
  const [endDate, setEndDate] = useState<string>(routeParams?.endDate || '');
  const [hotels, setHotels] = useState<HotelType[]>(routeParams?.hotels || []);
  const [rooms, setRooms] = useState<number>(routeParams?.rooms || 1);
  const [adults, setAdults] = useState<number>(routeParams?.adults || 1);
  const [children, setChildren] = useState<number>(routeParams?.children || 0);

  // 处理从详情页返回的数据更新
  React.useEffect(() => {
    console.log('接收到的routeParams:', routeParams);

    // 检查是否有updatedData字段
    if (routeParams?.updatedData) {
      console.log('接收到的更新数据:', routeParams.updatedData);
      const {
        startDate: updatedStartDate,
        endDate: updatedEndDate,
        rooms: updatedRooms,
        adults: updatedAdults,
        children: updatedChildren,
        hotels: hotels,
        location: location,
      } = routeParams.updatedData;
      if (updatedStartDate) setStartDate(updatedStartDate);
      if (updatedEndDate) setEndDate(updatedEndDate);
      if (location) setLocation(location);
      if (updatedRooms) setRooms(updatedRooms);
      if (updatedAdults) setAdults(updatedAdults);
      if (updatedChildren) setChildren(updatedChildren);
      if (hotels) setHotels(hotels);
    }
  }, [
    routeParams,
    setStartDate,
    setEndDate,
    setRooms,
    setAdults,
    setChildren,
    setHotels,
    setLocation,
  ]);

  // 初始化酒店数据 - 不使用模拟数据，只使用接口返回的数据
  React.useEffect(() => {
    console.log('酒店列表数据:', hotels);
  }, [hotels]);
  // 搜索框输入内容
  const [searchKeyword, setSearchKeyword] = useState<string>(
    routeParams?.keyword || '',
  );

  // 筛选弹窗状态
  const [isSortFilterVisible, setIsSortFilterVisible] =
    useState<boolean>(false);
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] =
    useState<boolean>(false);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] =
    useState<boolean>(false);

  // 筛选条件状态
  const [sortType, setSortType] = useState<string>('default');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(
    routeParams?.selectedPrice || null,
  );
  const [selectedStars, setSelectedStars] = useState<number[]>(
    routeParams?.selectedStars || [],
  );

  const [advancedFilters, setAdvancedFilters] = useState<{
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  }>(() => {
    const keyword = routeParams?.keyword || '';
    return parseKeywordFilters(keyword);
  });

  // 处理从详情页返回时的数据更新
  React.useEffect(() => {
    if (routeParams) {
      if (routeParams.keyword !== undefined)
        setSearchKeyword(routeParams.keyword);
      if (routeParams.selectedPrice !== undefined)
        setSelectedPrice(routeParams.selectedPrice);
      if (routeParams.selectedStars)
        setSelectedStars(routeParams.selectedStars);
      if (routeParams.advancedFilters)
        setAdvancedFilters(routeParams.advancedFilters);
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

  // 弹窗状态
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // 客房和人数选择弹窗状态
  const [isGuestModalVisible, setIsGuestModalVisible] =
    useState<boolean>(false);
  // 数字选择弹窗状态
  const [isNumberModalVisible, setIsNumberModalVisible] =
    useState<boolean>(false);
  const [currentSelectType, setCurrentSelectType] = useState<
    'rooms' | 'adults' | 'children' | null
  >(null);
  // 输入数字状态
  const [inputNumber, setInputNumber] = useState<string>('');
  const [isInputModalVisible, setIsInputModalVisible] =
    useState<boolean>(false);

  // 上滑加载更多（模拟）
  const handleLoadMore = () => {
    setTimeout(() => {
      setHotels(prev => [
        ...prev,
        // ...mockHotels.map(hotel => ({...hotel, id: `${hotel.id}_${page + 1}`})),
      ]);
      // setPage(prev => prev + 1);
    }, 1000);
  };

  // 前端排序后的酒店列表
  const sortedHotels = useMemo(() => {
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
  }, [hotels, sortType]);

  // 重新搜索酒店列表（价格/星级/筛选时调用）
  const searchHotels = async (params?: {
    price?: number | null;
    stars?: number[];
    filters?: {
      hotFilters: string[];
      accommodationTypes: string[];
      hotelFeatures: string[];
      roomFeatures: string[];
    };
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

      // 处理价格区间
      const priceToUse =
        params?.price !== undefined ? params.price : selectedPrice;
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

      // 处理星级
      const starsToUse = params?.stars || selectedStars;
      if (starsToUse.length > 0) {
        searchParams.stars = starsToUse;
      }

      // 处理筛选选项，添加到keyword中
      const filtersToUse = params?.filters || advancedFilters;
      const filterKeywords: string[] = [];

      if (filtersToUse.hotFilters.length > 0) {
        filterKeywords.push(...filtersToUse.hotFilters);
      }
      if (filtersToUse.accommodationTypes.length > 0) {
        filterKeywords.push(...filtersToUse.accommodationTypes);
      }
      if (filtersToUse.hotelFeatures.length > 0) {
        filterKeywords.push(...filtersToUse.hotelFeatures);
      }
      if (filtersToUse.roomFeatures.length > 0) {
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

  // 渲染酒店列表项
  const renderHotelItem = ({item}: {item: HotelType}) => {
    const handlePress = async () => {
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
        });
      }
    };

    return (
      <TouchableOpacity style={styles.hotelItem} onPress={handlePress}>
        <Image
          source={{uri: getImageUrl(item.photos[0].url)}}
          style={styles.hotelImage}
        />
        <View style={styles.hotelInfo}>
          <View style={styles.hotelNameContainer}>
            <Text style={styles.hotelName}>{item.name}</Text>
            <Text style={styles.hotelStar}>{'🌟'.repeat(item.star)}</Text>
          </View>
          <Text style={styles.hotelAddress}>{item.address}</Text>
          <View style={styles.hotelTags}>
            {item.amenities &&
              item.amenities.length > 0 &&
              item.amenities.map((amenity: string, index: number) => (
                <Text key={index} style={styles.hotelTagText}>
                  {amenitiesMap[amenity] || amenity}
                </Text>
              ))}
          </View>
          <View style={styles.hotelPriceContainer}>
            <View style={styles.priceWrapper}>
              <Text style={styles.hotelPriceSymbol}>¥</Text>
              <Text style={styles.hotelPrice}>
                {item.roomTypes?.available?.[0]?.price ||
                  item.roomTypes?.[0]?.price ||
                  '暂无'}
              </Text>
              <Text style={styles.hotelPriceDesc}>起/晚</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.pageContainer}>
      {/* 顶部核心筛选头 */}
      <View style={styles.listFilterHeader}>
        <View style={styles.headerLeftContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() =>
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
            }>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text style={styles.headerInfoText} numberOfLines={2}>
              {location}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text
              style={styles.headerInfoText}
              numberOfLines={2}>{`住 ${formatDate(startDate)} 离 ${formatDate(
              endDate,
            )}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfoItem}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text style={[styles.headerInfoText, {maxWidth: 20}]}>
              {rooms}间{adults + children}人
            </Text>
          </TouchableOpacity>
          {/* 搜索框 */}
          <View style={styles.searchBoxContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchBox}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                placeholder="酒店/品牌"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsSortFilterVisible(true)}>
          <Text style={[styles.filterBtnText, styles.filterBtnTextActive]}>
            {sortType === 'default'
              ? '默认排序'
              : sortType === 'price_low'
              ? '低价优先'
              : sortType === 'price_high'
              ? '高价优先'
              : '高星优先'}
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
          onPress={() => setIsPriceStarFilterVisible(true)}>
          <Text
            style={[
              styles.filterBtnText,
              (isPriceStarFilterVisible ||
                selectedPrice !== null ||
                selectedStars.length > 0) &&
                styles.filterBtnTextActive,
            ]}>
            价格/星级
          </Text>
          {(selectedPrice !== null || selectedStars.length > 0) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {(selectedPrice !== null ? 1 : 0) + selectedStars.length}
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.filterArrow,
              isPriceStarFilterVisible && styles.filterArrowUp,
              (isPriceStarFilterVisible ||
                selectedPrice !== null ||
                selectedStars.length > 0) &&
                styles.filterArrowActive,
            ]}>
            {isPriceStarFilterVisible ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsAdvancedFilterVisible(true)}>
          <Text
            style={[
              styles.filterBtnText,
              (isAdvancedFilterVisible ||
                advancedFilters.hotFilters.length > 0 ||
                advancedFilters.accommodationTypes.length > 0 ||
                advancedFilters.hotelFeatures.length > 0 ||
                advancedFilters.roomFeatures.length > 0) &&
                styles.filterBtnTextActive,
            ]}>
            筛选
          </Text>
          {(advancedFilters.hotFilters.length > 0 ||
            advancedFilters.accommodationTypes.length > 0 ||
            advancedFilters.hotelFeatures.length > 0 ||
            advancedFilters.roomFeatures.length > 0) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {advancedFilters.hotFilters.length +
                  advancedFilters.accommodationTypes.length +
                  advancedFilters.hotelFeatures.length +
                  advancedFilters.roomFeatures.length}
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.filterArrow,
              isAdvancedFilterVisible && styles.filterArrowUp,
              (isAdvancedFilterVisible ||
                advancedFilters.hotFilters.length > 0 ||
                advancedFilters.accommodationTypes.length > 0 ||
                advancedFilters.hotelFeatures.length > 0 ||
                advancedFilters.roomFeatures.length > 0) &&
                styles.filterArrowActive,
            ]}>
            {isAdvancedFilterVisible ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 酒店列表（支持上滑加载） */}
      <FlatList
        data={sortedHotels}
        renderItem={renderHotelItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              暂无符合条件的酒店，修改条件可重新查询
            </Text>
          </View>
        )}
        ListFooterComponent={() => {
          if (sortedHotels.length === 0) return null;
          return (
            <View style={styles.loadMoreFooter}>
              <Text style={styles.loadMoreText}>———我也是有底线的哦———</Text>
            </View>
          );
        }}
      />

      {/* 顶部固定的蒙层弹窗 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalContent}>
                {/* 位置选择 */}
                <View style={styles.locationModalContent}>
                  <LocationSelector
                    value={location}
                    onChange={setLocation}
                    placeholder="输入城市"
                  />
                </View>
                <View style={styles.horizontalDivider} />

                {/* 日期选择 */}
                <View style={styles.searchItem}>
                  <DateSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateSelect={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                  />
                </View>

                {/* 横线分隔符 */}
                <View style={styles.horizontalDivider} />

                {/* 客房和人数统计 */}
                <TouchableOpacity
                  style={styles.searchItem}
                  onPress={() => setIsGuestModalVisible(true)}>
                  <Text style={styles.searchLabel}>👥</Text>
                  <View style={styles.guestInfoContainer}>
                    <Text style={styles.guestInfoText}>
                      {rooms}间房 · {adults}成人 · {children}儿童
                    </Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setIsModalVisible(false);
                  searchHotels();
                }}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 选择客房和入住人数弹窗 */}
      <Modal
        visible={isGuestModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGuestModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBottom}
          activeOpacity={1}
          onPress={() => setIsGuestModalVisible(false)}>
          <View style={styles.guestModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择客房和入住人数</Text>
                <TouchableOpacity onPress={() => setIsGuestModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <GuestSelector
                  rooms={rooms}
                  adults={adults}
                  children={children}
                  onRoomsChange={setRooms}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setIsGuestModalVisible(false)}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 数字选择弹窗 */}
      <Modal
        visible={isNumberModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNumberModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsNumberModalVisible(false)}>
          <View style={styles.numberModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentSelectType === 'rooms'
                    ? '选择房间数量'
                    : currentSelectType === 'adults'
                    ? '选择成人数量'
                    : '选择儿童数量'}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsNumberModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.numberGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numberGridItem}
                    onPress={() => {
                      if (currentSelectType === 'rooms') {
                        setRooms(num);
                      } else if (currentSelectType === 'adults') {
                        setAdults(num);
                      } else if (currentSelectType === 'children') {
                        setChildren(num);
                      }
                      setIsNumberModalVisible(false);
                    }}>
                    <Text style={styles.numberGridItemText}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.numberGridItem}
                  onPress={() => {
                    // 显示输入弹窗
                    setInputNumber('');
                    setIsInputModalVisible(true);
                  }}>
                  <Text style={styles.numberGridItemText}>更多</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 输入数字弹窗 */}
      <Modal
        visible={isInputModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsInputModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsInputModalVisible(false)}>
          <View style={styles.inputModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentSelectType === 'rooms'
                    ? '输入房间数量'
                    : currentSelectType === 'adults'
                    ? '输入成人数量'
                    : '输入儿童数量'}
                </Text>
                <TouchableOpacity onPress={() => setIsInputModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputModalContent}>
                <TextInput
                  style={styles.inputField}
                  value={inputNumber}
                  onChangeText={setInputNumber}
                  placeholder="请输入数量"
                  keyboardType="numeric"
                  autoFocus={true}
                />
                <Text style={styles.inputHint}>请输入1-999之间的数字</Text>
              </View>

              <View style={styles.inputModalFooter}>
                <TouchableOpacity
                  style={[
                    styles.inputModalButton,
                    styles.inputModalCancelButton,
                  ]}
                  onPress={() => setIsInputModalVisible(false)}>
                  <Text
                    style={[
                      styles.inputModalButtonText,
                      styles.inputModalCancelButtonText,
                    ]}>
                    取消
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.inputModalButton,
                    styles.inputModalConfirmButton,
                  ]}
                  onPress={() => {
                    const num = parseInt(inputNumber);
                    if (num >= 1 && num <= 999) {
                      if (currentSelectType === 'rooms') {
                        setRooms(num);
                      } else if (currentSelectType === 'adults') {
                        setAdults(num);
                      } else if (currentSelectType === 'children') {
                        setChildren(num);
                      }
                      setIsInputModalVisible(false);
                      setIsNumberModalVisible(false);
                    }
                  }}>
                  <Text
                    style={[
                      styles.inputModalButtonText,
                      styles.inputModalConfirmButtonText,
                    ]}>
                    确认
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 排序筛选弹窗 */}
      <SortFilter
        visible={isSortFilterVisible}
        onClose={() => setIsSortFilterVisible(false)}
        onSortChange={setSortType}
        currentSort={sortType}
      />

      {/* 价格/星级筛选弹窗 */}
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

      {/* 综合筛选弹窗 */}
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

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import type {
  RouteType,
  HotelType,
  SearchRouteParams,
  ListRouteParams,
  DetailRouteParams,
} from '../../types';
import LoadingModal from '../../components/LoadingModal';
import LocationSelector from '../../components/LocationSelector';
import DateSelector from '../../components/DateSelector';
import GuestModal from '../../components/GuestModal';
import PriceStarFilter from '../../components/PriceStarFilter';
import {formatDate} from '../../utils/dateUtils';
import {getHotelList} from '../../utils/api';
import {amenitiesMap, QUICK_TAGS, getPriceRangeLabel} from '../../utils/mappings';
import {styles} from './styles';
import {init} from 'react-native-amap-geolocation';
import {useBannerHotel} from '../../hooks/useBannerHotel';
import {useSearchForm} from '../../hooks/useSearchForm';

const SkeletonBanner = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.bannerContainer}>
      <Animated.View style={[styles.bannerSkeleton, {opacity}]}>
        <View style={styles.bannerSkeletonContent}>
          <View style={styles.bannerSkeletonTitle} />
          <View style={styles.bannerSkeletonSubtitle} />
        </View>
      </Animated.View>
    </View>
  );
};

type NavigateFunction = (route: RouteType, params?: ListRouteParams | DetailRouteParams) => void;

const HotelSearchPage = ({
  navigateTo,
  routeParams,
}: {
  navigateTo: NavigateFunction;
  routeParams: SearchRouteParams;
}) => {
  const {bannerHotel, bannerLoading} = useBannerHotel();
  
  const {
    formState,
    setLocation,
    setKeyword,
    setRooms,
    setAdults,
    setChildren,
    setSelectedPrice,
    setSelectedStars,
    handleDateSelect,
    buildSearchParams,
  } = useSearchForm(routeParams);

  const [loading] = useState<boolean>(false);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      init({
        ios: '',
        android: '81583f4cae74715f049663264b247f14',
      });
    }
    return () => {};
  }, []);

  const handleSearch = async () => {
    try {
      const searchParams = buildSearchParams();
      console.log('搜索参数:', searchParams);
      
      const response = await getHotelList({
        ...searchParams,
        page: 1,
        limit: 15,
      });
      console.log('获取酒店列表成功:', response);
      
      navigateTo('list', {
        location: formState.location,
        keyword: formState.keyword,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        rooms: formState.rooms,
        adults: formState.adults,
        children: formState.children,
        hotels: response?.data || [],
        selectedPrice: formState.selectedPrice,
        selectedStars: formState.selectedStars,
      });
    } catch (error) {
      console.error('获取酒店列表失败:', error);
      Alert.alert('查询失败', '获取酒店列表时出现错误，请稍后重试');
    }
  };

  const handleBannerPress = () => {
    if (!bannerHotel) return;
    navigateTo('detail', {
      hotelId: bannerHotel.id,
      hotelDetail: bannerHotel,
      startDate: formatDate(formState.startDate),
      endDate: formatDate(formState.endDate),
      rooms: formState.rooms,
      adults: formState.adults,
      children: formState.children,
      location: formState.location,
      keyword: formState.keyword,
      selectedPrice: formState.selectedPrice,
      selectedStars: formState.selectedStars,
      fromRoute: 'search',
    });
  };

  const renderFilterText = () => {
    if (!formState.selectedPrice && formState.selectedStars.length === 0) {
      return '价格/星级';
    }
    
    const parts: string[] = [];
    if (formState.selectedPrice) {
      const label = getPriceRangeLabel(formState.selectedPrice);
      if (label) parts.push(label);
    }
    if (formState.selectedStars.length > 0) {
      parts.push(formState.selectedStars.map(star => `${star}星`).join(', '));
    }
    return parts.join(' · ');
  };

  return (
    <ScrollView style={styles.pageContainer}>
      {bannerLoading ? (
        <SkeletonBanner />
      ) : bannerHotel ? (
        <TouchableOpacity
          style={styles.bannerContainer}
          onPress={handleBannerPress}>
          <ImageBackground
            source={{uri: bannerHotel.photos?.[0]?.url || 'https://img.cdn1.vip/i/699dc7d46e039_1771947988.webp'}}
            style={styles.bannerImage}>
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{bannerHotel.name}</Text>
              <View style={styles.bannerTagsContainer}>
                {(bannerHotel.amenities?.slice(0, 5)).map((amenity: string, index: number) => (
                  <View key={index} style={styles.bannerTag}>
                    <Text style={styles.bannerTagText}>{amenitiesMap[amenity] || amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ) : null}

      <View style={styles.searchContainer}>
        <View style={styles.locationSearchItem}>
          <View style={styles.locationContainer}>
            <View style={styles.floatingLabelInputContainer}>
              {formState.location ? <Text style={styles.floatingLabel}>位置</Text> : null}
              <View style={styles.searchInputWrapper}>
                <LocationSelector
                  value={formState.location}
                  onChange={setLocation}
                  placeholder="位置"
                />
              </View>
            </View>
          </View>
          <View style={styles.horizontalDivider} />
        </View>

        <View style={styles.searchItem}>
          <Text style={[styles.searchLabel,{marginRight: 0}]}>🔍</Text>
          <View style={styles.floatingLabelInputContainer}>
            {formState.keyword ? (
              <Text style={[styles.floatingLabel, {left: 6}]}>酒店/品牌</Text>
            ) : null}
            <TextInput
              style={[
                styles.searchInput,
                formState.keyword ? styles.searchInputWithText : null,
              ]}
              value={formState.keyword}
              onChangeText={setKeyword}
              placeholder={!formState.keyword ? '酒店/品牌' : ''}
              autoCapitalize="none"
              keyboardType="default"
              autoCorrect={false}
            />
            {formState.keyword ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setKeyword('')}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.horizontalDivider} />

        <View style={styles.searchItem}>
          <DateSelector
            startDate={formState.startDate}
            endDate={formState.endDate}
            onDateSelect={handleDateSelect}
          />
        </View>
        <View style={styles.horizontalDivider} />

        <TouchableOpacity
          style={styles.searchItem}
          onPress={() => setIsGuestModalVisible(true)}>
          <Text style={styles.searchLabel}>👥</Text>
          <View style={styles.guestInfoContainer}>
            <Text style={styles.guestInfoText}>
              {formState.rooms}间房 · {formState.adults}成人 · {formState.children}儿童
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.horizontalDivider} />

        <TouchableOpacity
          style={styles.searchItem}
          onPress={() => setIsFilterModalVisible(true)}>
          <Text style={styles.searchLabel} />
          <View style={styles.guestInfoContainer}>
            <Text
              style={[
                styles.guestInfoText,
                !formState.selectedPrice && formState.selectedStars.length === 0 && styles.greyText,
              ]}>
              {renderFilterText()}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.horizontalDivider} />

        <View style={styles.tagsContainer}>
          <View style={styles.tagsContent}>
            {QUICK_TAGS.map(tag => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.quickTag,
                  formState.keyword === tag.name && styles.quickTagActive,
                ]}
                onPress={() => setKeyword(tag.name)}>
                <Text
                  style={[
                    styles.quickTagText,
                    formState.keyword === tag.name && styles.quickTagTextActive,
                  ]}>
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>查询酒店</Text>
        </TouchableOpacity>
      </View>

      <LoadingModal visible={loading} message="紧急定位ing~" />

      <GuestModal
        visible={isGuestModalVisible}
        onClose={() => setIsGuestModalVisible(false)}
        onConfirm={() => {}}
        rooms={formState.rooms}
        adults={formState.adults}
        children={formState.children}
        onRoomsChange={setRooms}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
      />

      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}>
          <View style={styles.filterModalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择价格/星级</Text>
                <TouchableOpacity
                  onPress={() => setIsFilterModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <PriceStarFilter
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onFilterChange={(price, stars) => {
                  setSelectedPrice(price);
                  setSelectedStars(stars);
                }}
                currentPrice={formState.selectedPrice}
                currentStars={formState.selectedStars}
                onRealTimeChange={(price, stars) => {
                  setSelectedPrice(price);
                  setSelectedStars(stars);
                }}
                standalone={false}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default HotelSearchPage;

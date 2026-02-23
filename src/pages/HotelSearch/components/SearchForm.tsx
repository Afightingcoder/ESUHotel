import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LocationSelector from '../../../components/LocationSelector';
import DateSelector from '../../../components/DateSelector';
import GuestSelector from '../../../components/GuestSelector';
import ModalBase from '../../../components/ModalBase';
import QuickTags from './QuickTags';
import {priceOptions} from '../../../constants/quickTags';

interface SearchFormProps {
  location: string;
  setLocation: (location: string) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  startDate: string;
  endDate: string;
  onDateSelect: (start: string, end: string) => void;
  rooms: number;
  adults: number;
  children: number;
  setRooms: (rooms: number) => void;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  selectedPrice: number | null;
  selectedStars: number[];
  isGuestModalVisible: boolean;
  setIsGuestModalVisible: (visible: boolean) => void;
  isFilterModalVisible: boolean;
  setIsFilterModalVisible: (visible: boolean) => void;
  onSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  location,
  setLocation,
  keyword,
  setKeyword,
  startDate,
  endDate,
  onDateSelect,
  rooms,
  adults,
  children,
  setRooms,
  setAdults,
  setChildren,
  selectedPrice,
  selectedStars,
  isGuestModalVisible,
  setIsGuestModalVisible,
  isFilterModalVisible,
  setIsFilterModalVisible,
  onSearch,
}) => {
  const getFilterLabel = () => {
    const priceLabel = selectedPrice
      ? priceOptions.find(item => item.value === selectedPrice)?.label
      : '';
    const starLabels = selectedStars.map(star => `${star}星`).join(', ');
    if (!priceLabel && !starLabels) return '价格/星级';
    return `${priceLabel}${priceLabel && starLabels ? ' · ' : ''}${starLabels}`;
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.locationSearchItem}>
        <View style={styles.locationContainer}>
          <View style={styles.floatingLabelInputContainer}>
            {location ? <Text style={styles.floatingLabel}>位置</Text> : null}
            <View
              style={[
                styles.searchInput,
                location ? styles.searchInputWithValue : undefined,
              ]}>
              <LocationSelector
                value={location}
                onChange={setLocation}
                placeholder="位置"
              />
            </View>
          </View>
        </View>
        <View style={styles.horizontalDivider} />
      </View>

      <View style={styles.searchItem}>
        <Text style={styles.searchLabel}>🔍</Text>
        <View style={styles.floatingLabelInputContainer}>
          {keyword ? <Text style={styles.floatingLabel}>酒店/品牌</Text> : null}
          <TextInput
            style={[
              styles.searchInput,
              keyword ? styles.searchInputWithValue : undefined,
            ]}
            value={keyword}
            onChangeText={setKeyword}
            placeholder={!keyword ? '酒店/品牌' : ''}
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
          />
          {keyword ? (
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
          startDate={startDate}
          endDate={endDate}
          onDateSelect={onDateSelect}
        />
      </View>
      <View style={styles.horizontalDivider} />

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
      <View style={styles.horizontalDivider} />

      <TouchableOpacity
        style={styles.searchItem}
        onPress={() => setIsFilterModalVisible(true)}>
        <Text style={styles.searchLabel} />
        <View style={styles.guestInfoContainer}>
          <Text
            style={[
              styles.guestInfoText,
              !selectedPrice && selectedStars.length === 0 && styles.greyText,
            ]}>
            {getFilterLabel()}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalDivider} />

      <QuickTags keyword={keyword} onTagPress={setKeyword} />
      <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
        <Text style={styles.searchBtnText}>查询酒店</Text>
      </TouchableOpacity>

      <ModalBase
        visible={isGuestModalVisible}
        onClose={() => setIsGuestModalVisible(false)}
        title="选择客房和入住人数">
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
      </ModalBase>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  locationSearchItem: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  searchLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  horizontalDivider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#eee',
    marginTop: 8,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  floatingLabelInputContainer: {
    flex: 1,
    position: 'relative',
    height: 44,
  },
  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 12,
    fontSize: 12,
    color: '#999',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  searchInputWithValue: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{translateY: -10}],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  guestInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestInfoText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  greyText: {
    color: '#999',
  },
  searchBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#1890ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default SearchForm;

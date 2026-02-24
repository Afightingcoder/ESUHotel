import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import LocationSelector from '../../components/LocationSelector';
import DateSelector from '../../components/DateSelector';
import GuestModal from '../../components/GuestModal';
import {styles} from './styles';

interface SearchModalProps {
  visible: boolean;
  location: string;
  startDate: string;
  endDate: string;
  rooms: number;
  adults: number;
  children: number;
  isGuestModalVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onLocationChange: (location: string) => void;
  onDateSelect: (start: string, end: string) => void;
  onGuestModalOpen: () => void;
  onGuestModalClose: () => void;
  onRoomsChange: (rooms: number) => void;
  onAdultsChange: (adults: number) => void;
  onChildrenChange: (children: number) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  location,
  startDate,
  endDate,
  rooms,
  adults,
  children,
  isGuestModalVisible,
  onClose,
  onConfirm,
  onLocationChange,
  onDateSelect,
  onGuestModalOpen,
  onGuestModalClose,
  onRoomsChange,
  onAdultsChange,
  onChildrenChange,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalContent}>
              <View style={styles.locationModalContent}>
                <LocationSelector
                  value={location}
                  onChange={onLocationChange}
                  placeholder="输入城市"
                />
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
                onPress={onGuestModalOpen}>
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
              onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>确认</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <GuestModal
        visible={isGuestModalVisible}
        onClose={onGuestModalClose}
        onConfirm={() => {}}
        rooms={rooms}
        adults={adults}
        children={children}
        onRoomsChange={onRoomsChange}
        onAdultsChange={onAdultsChange}
        onChildrenChange={onChildrenChange}
      />
    </Modal>
  );
};

export default SearchModal;

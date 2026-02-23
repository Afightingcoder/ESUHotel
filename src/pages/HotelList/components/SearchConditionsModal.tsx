import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import LocationSelector from '../../../components/LocationSelector';
import DateSelector from '../../../components/DateSelector';
import GuestSelector from '../../../components/GuestSelector';
import {styles} from '../styles';

interface SearchConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  location: string;
  startDate: string;
  endDate: string;
  rooms: number;
  adults: number;
  children: number;
  onLocationChange: (location: string) => void;
  onDateChange: (start: string, end: string) => void;
  onGuestChange: (rooms: number, adults: number, children: number) => void;
  onConfirm: () => void;
}

export const SearchConditionsModal: React.FC<SearchConditionsModalProps> = ({
  visible,
  onClose,
  location,
  startDate,
  endDate,
  rooms,
  adults,
  children,
  onLocationChange,
  onDateChange,
  onGuestChange,
  onConfirm,
}) => {
  const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);

  return (
    <>
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
                    onDateSelect={onDateChange}
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
              </View>

              <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmButtonText}>确认</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
                  onRoomsChange={(r) => onGuestChange(r, adults, children)}
                  onAdultsChange={(a) => onGuestChange(rooms, a, children)}
                  onChildrenChange={(c) => onGuestChange(rooms, adults, c)}
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
    </>
  );
};

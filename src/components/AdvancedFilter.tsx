import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface AdvancedFilterProps {
  visible: boolean;
  onClose: () => void;
  onFilterChange: (filters: {
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  }) => void;
  currentFilters: {
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  };
  onRealTimeChange?: (filters: {
    hotFilters: string[];
    accommodationTypes: string[];
    hotelFeatures: string[];
    roomFeatures: string[];
  }) => void;
}

const filterOptions = {
  hotFilters: [
    {key: 'breakfast', label: '含早餐'},
    {key: 'cancel', label: '免费取消'},
    {key: 'double', label: '双床房'},
    {key: 'parking', label: '免费停车'},
  ],
  accommodationTypes: [
    {key: 'hotel', label: '酒店'},
    {key: 'apartment', label: '公寓'},
    {key: 'homestay', label: '民宿'},
    {key: 'hostel', label: '青旅'},
  ],
  hotelFeatures: [
    {key: 'pool', label: '泳池'},
    {key: 'gym', label: '健身房'},
    {key: 'spa', label: '水疗'},
    {key: 'restaurant', label: '餐厅'},
    {key: 'bar', label: '酒吧'},
  ],
  roomFeatures: [
    {key: 'family_theme', label: '亲子主题房'},
    {key: 'loft', label: '复式LOFT房'},
    {key: 'movie', label: '影音房'},
  ],
};

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  visible,
  onClose,
  onFilterChange,
  currentFilters,
  onRealTimeChange,
}) => {
  const [hotFilters, setHotFilters] = useState<string[]>(currentFilters.hotFilters);
  const [accommodationTypes, setAccommodationTypes] = useState<string[]>(currentFilters.accommodationTypes);
  const [hotelFeatures, setHotelFeatures] = useState<string[]>(currentFilters.hotelFeatures);
  const [roomFeatures, setRoomFeatures] = useState<string[]>(currentFilters.roomFeatures);

  const toggleFilter = (key: string, list: string[], setList: (arr: string[]) => void) => {
    let newList: string[];
    if (list.includes(key)) {
      newList = list.filter(item => item !== key);
    } else {
      newList = [...list, key];
    }
    setList(newList);
    
    if (onRealTimeChange) {
      const newFilters = {
        hotFilters: list === hotFilters ? newList : hotFilters,
        accommodationTypes: list === accommodationTypes ? newList : accommodationTypes,
        hotelFeatures: list === hotelFeatures ? newList : hotelFeatures,
        roomFeatures: list === roomFeatures ? newList : roomFeatures,
      };
      onRealTimeChange(newFilters);
    }
  };

  const handleConfirm = () => {
    onFilterChange({
      hotFilters,
      accommodationTypes,
      hotelFeatures,
      roomFeatures,
    });
    onClose();
  };

  const handleClear = () => {
    setHotFilters([]);
    setAccommodationTypes([]);
    setHotelFeatures([]);
    setRoomFeatures([]);
    if (onRealTimeChange) {
      onRealTimeChange({
        hotFilters: [],
        accommodationTypes: [],
        hotelFeatures: [],
        roomFeatures: [],
      });
    }
  };

  const renderFilterSection = (
    title: string,
    options: {key: string; label: string}[],
    selectedList: string[],
    setList: (arr: string[]) => void,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tagsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.tagItem,
              selectedList.includes(option.key) && styles.tagItemActive,
            ]}
            onPress={() => toggleFilter(option.key, selectedList, setList)}>
            <Text
              style={[
                styles.tagText,
                selectedList.includes(option.key) && styles.tagTextActive,
              ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.checkMark,
              !selectedList.includes(option.key) && styles.checkMarkHidden,
            ]}>✓</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.topArea} />
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 热门筛选 */}
              {renderFilterSection('热门筛选', filterOptions.hotFilters, hotFilters, setHotFilters)}

              {/* 住宿类型 */}
              {renderFilterSection('住宿类型', filterOptions.accommodationTypes, accommodationTypes, setAccommodationTypes)}

              {/* 酒店特色 */}
              {renderFilterSection('酒店特色', filterOptions.hotelFeatures, hotelFeatures, setHotelFeatures)}

              {/* 客房特色 */}
              {renderFilterSection('客房特色', filterOptions.roomFeatures, roomFeatures, setRoomFeatures)}

              {/* 底部按钮 */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClear}>
                  <Text style={styles.clearButtonText}>清空</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}>
                  <Text style={styles.confirmButtonText}>完成</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.bottomArea} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  topArea: {
    height: 110,
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'hidden',
    maxHeight: '70%',
  },
  bottomArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  tagItemActive: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  tagText: {
    fontSize: 13,
    color: '#333',
  },
  tagTextActive: {
    color: '#1890ff',
  },
  checkMark: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    fontSize: 10,
    color: '#1890ff',
  },
  checkMarkHidden: {
    color: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
});

export default AdvancedFilter;

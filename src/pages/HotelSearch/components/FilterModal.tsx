import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ModalBase from '../../../components/ModalBase';
import {priceOptions, starOptions} from '../../../constants/quickTags';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPrice: number | null;
  setSelectedPrice: (price: number | null) => void;
  selectedStars: number[];
  setSelectedStars: (stars: number[]) => void;
  setFilters: (filters: {star: number[]; priceRange: number[]}) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedPrice,
  setSelectedPrice,
  selectedStars,
  setSelectedStars,
  setFilters,
}) => {
  const handleConfirm = () => {
    setFilters({
      star: selectedStars,
      priceRange: selectedPrice ? [selectedPrice] : [],
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedPrice(null);
    setSelectedStars([]);
  };

  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter(s => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  return (
    <ModalBase visible={visible} onClose={onClose} title="选择价格/星级">
      <View style={styles.filterModalContent}>
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>价格</Text>
          <View style={styles.filterOptions}>
            {priceOptions.map(item => (
              <TouchableOpacity
                key={`price_${item.id}`}
                style={[
                  styles.filterOptionItem,
                  selectedPrice === item.value && styles.filterOptionItemActive,
                ]}
                onPress={() => setSelectedPrice(item.value)}>
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedPrice === item.value && styles.filterOptionTextActive,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>星级/钻级</Text>
          <View style={styles.filterOptions}>
            {starOptions.map(item => (
              <TouchableOpacity
                key={`star_${item.id}`}
                style={[
                  styles.filterOptionItem,
                  selectedStars.includes(item.value) && styles.filterOptionItemActive,
                ]}
                onPress={() => toggleStar(item.value)}>
                <View>
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStars.includes(item.value) && styles.filterOptionTextActive,
                    ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.filterOptionDesc}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.filterModalFooter}>
        <TouchableOpacity
          style={[styles.filterModalButton, styles.filterModalClearButton]}
          onPress={handleClear}>
          <Text style={styles.filterModalClearButtonText}>清空</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterModalButton, styles.filterModalConfirmButton]}
          onPress={handleConfirm}>
          <Text style={styles.filterModalConfirmButtonText}>完成</Text>
        </TouchableOpacity>
      </View>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  filterModalContent: {
    padding: 16,
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    minWidth: 120,
  },
  filterOptionItemActive: {
    borderColor: '#1890ff',
    backgroundColor: 'rgba(24, 144, 255, 0.05)',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextActive: {
    color: '#1890ff',
    fontWeight: '500',
  },
  filterOptionDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  filterModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  filterModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalClearButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8,
  },
  filterModalClearButtonText: {
    fontSize: 16,
    color: '#333',
  },
  filterModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterModal;

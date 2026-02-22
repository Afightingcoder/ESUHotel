import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface PriceStarFilterProps {
  visible: boolean;
  onClose: () => void;
  onFilterChange: (price: number | null, stars: number[]) => void;
  currentPrice: number | null;
  currentStars: number[];
  onRealTimeChange?: (price: number | null, stars: number[]) => void;
}

const priceRanges = [
  {key: 200, label: '￥200以下'},
  {key: 350, label: '￥200-￥350'},
  {key: 400, label: '￥350-￥400'},
  {key: 500, label: '￥400-￥500'},
  {key: 900, label: '￥500-￥900'},
  {key: 1400, label: '￥900-￥1400'},
  {key: 1401, label: '￥1400以上'},
];

const starOptions = [
  {key: 2, label: '2星及以下', desc: '经济'},
  {key: 3, label: '3星', desc: '舒适'},
  {key: 4, label: '4星', desc: '高档'},
  {key: 5, label: '5星', desc: '豪华'},
];

const PriceStarFilter: React.FC<PriceStarFilterProps> = ({
  visible,
  onClose,
  onFilterChange,
  currentPrice,
  currentStars,
  onRealTimeChange,
}) => {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(currentPrice);
  const [selectedStars, setSelectedStars] = useState<number[]>(currentStars);

  const handlePriceSelect = (price: number) => {
    const newPrice = selectedPrice === price ? null : price;
    setSelectedPrice(newPrice);
    if (onRealTimeChange) {
      onRealTimeChange(newPrice, selectedStars);
    }
  };

  const handleStarToggle = (star: number) => {
    let newStars: number[];
    if (selectedStars.includes(star)) {
      newStars = selectedStars.filter(s => s !== star);
    } else {
      newStars = [...selectedStars, star];
    }
    setSelectedStars(newStars);
    if (onRealTimeChange) {
      onRealTimeChange(selectedPrice, newStars);
    }
  };

  const handleConfirm = () => {
    onFilterChange(selectedPrice, selectedStars);
    onClose();
  };

  const handleClear = () => {
    setSelectedPrice(null);
    setSelectedStars([]);
    if (onRealTimeChange) {
      onRealTimeChange(null, []);
    }
  };

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
              {/* 价格部分 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>价格</Text>
                <View style={styles.tagsContainer}>
                  {priceRanges.map(option => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.tagItem,
                        selectedPrice === option.key && styles.tagItemActive,
                      ]}
                      onPress={() => handlePriceSelect(option.key)}>
                      <Text
                        style={[
                          styles.tagText,
                          selectedPrice === option.key && styles.tagTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 星级部分 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>星级/钻级</Text>
                <View style={styles.tagsContainer}>
                  {starOptions.map(option => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.tagItem,
                        selectedStars.includes(option.key) && styles.tagItemActive,
                      ]}
                      onPress={() => handleStarToggle(option.key)}>
                      <View style={styles.starTagContent}>
                        <Text
                          style={[
                            styles.tagText,
                            selectedStars.includes(option.key) && styles.tagTextActive,
                          ]}>
                          {option.label}
                        </Text>
                        <Text
                          style={[
                            styles.tagDesc,
                            selectedStars.includes(option.key) && styles.tagTextActive,
                          ]}>
                          {option.desc}
                        </Text>
                      </View>
                      {selectedStars.includes(option.key) && (
                        <Text style={styles.checkMark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagItemActive: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#1890ff',
  },
  tagText: {
    fontSize: 13,
    color: '#333',
  },
  tagTextActive: {
    color: '#1890ff',
  },
  tagDesc: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  starTagContent: {
    flexDirection: 'column',
  },
  checkMark: {
    fontSize: 14,
    color: '#1890ff',
    marginLeft: 6,
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

export default PriceStarFilter;

import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {formatDate} from '../../../utils/dateUtils';
import {styles} from '../styles';

interface ListFilterHeaderProps {
  location: string;
  startDate: string;
  endDate: string;
  rooms: number;
  adults: number;
  children: number;
  searchKeyword: string;
  onFilterPress: () => void;
  onSearchChange: (text: string) => void;
  onBack: () => void;
}

export const ListFilterHeader: React.FC<ListFilterHeaderProps> = ({
  location,
  startDate,
  endDate,
  rooms,
  adults,
  children,
  searchKeyword,
  onFilterPress,
  onSearchChange,
  onBack,
}) => {
  return (
    <View style={styles.listFilterHeader}>
      <View style={styles.headerLeftContent}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerInfoItem} onPress={onFilterPress}>
          <Text style={styles.headerInfoText} numberOfLines={2}>
            {location}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerInfoItem} onPress={onFilterPress}>
          <Text style={styles.headerInfoText} numberOfLines={2}>
            {`住 ${formatDate(startDate)} 离 ${formatDate(endDate)}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerInfoItem} onPress={onFilterPress}>
          <Text style={[styles.headerInfoText, {maxWidth: 20}]}>
            {rooms}间{adults + children}人
          </Text>
        </TouchableOpacity>
        <View style={styles.searchBoxContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchBox}
              value={searchKeyword}
              onChangeText={onSearchChange}
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
  );
};

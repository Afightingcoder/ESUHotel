import React from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {formatDate} from '../../utils/dateUtils';
import {styles} from './styles';

interface ListHeaderProps {
  location: string;
  startDate: string;
  endDate: string;
  rooms: number;
  adults: number;
  children: number;
  searchKeyword: string;
  onBackPress: () => void;
  onHeaderInfoPress: () => void;
  onSearchKeywordChange: (keyword: string) => void;
  onSearchSubmit: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({
  location,
  startDate,
  endDate,
  rooms,
  adults,
  children,
  searchKeyword,
  onBackPress,
  onHeaderInfoPress,
  onSearchKeywordChange,
  onSearchSubmit,
}) => {
  return (
    <View style={styles.listFilterHeader}>
      <View style={styles.headerLeftContent}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <Image
            source={{uri: 'https://img.cdn1.vip/i/699dc8eabcd80_1771948266.png'}}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfoItem}
          onPress={onHeaderInfoPress}>
          <Text style={styles.headerInfoText} numberOfLines={2}>
            {location || '暂无位置信息'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfoItem}
          onPress={onHeaderInfoPress}>
          <Text style={styles.headerInfoText} numberOfLines={2}>
            {`住 ${formatDate(startDate)} 离 ${formatDate(endDate)}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfoItem}
          onPress={onHeaderInfoPress}>
          <Text style={styles.headerInfoText}>
            {rooms}间{adults + children}人
          </Text>
        </TouchableOpacity>
        <View style={styles.searchBoxContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchBox}
              value={searchKeyword}
              onChangeText={onSearchKeywordChange}
              placeholder="酒店/品牌"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="default"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={onSearchSubmit}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ListHeader;

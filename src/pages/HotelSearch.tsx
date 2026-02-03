import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet
} from 'react-native';
import type { RouteType } from '../types';
import Calendar from '../components/Calendar';

const HotelSearchPage = ({ navigateTo }: { navigateTo: (route: RouteType, params?: any) => void }) => {
  const [location, setLocation] = useState<string>('上海');
  const [keyword, setKeyword] = useState<string>('');
  const [filters, setFilters] = useState<{ star: number[]; priceRange: number[] }>({
    star: [],
    priceRange: []
  });

  // 快捷标签数据
  const quickTags = [
    { id: 'tag_01', name: '亲子友好' },
    { id: 'tag_02', name: '豪华酒店' },
    { id: 'tag_03', name: '免费停车' },
    { id: 'tag_04', name: '近地铁' },
    { id: 'tag_05', name: '含早餐' },
    { id: 'tag_06', name: '江景房' }
  ];

  // 筛选条件处理
  const handleFilterChange = (type: 'star' | 'price', value: number) => {
    setFilters(prev => {
      const propertyName = type === 'price' ? 'priceRange' : type;
      const currentValues = prev[propertyName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [propertyName]: newValues };
    });
  };

  // 提交查询
  const handleSearch = () => {
    navigateTo('list', {
      location,
      keyword,
      filters,
      checkDate: '2026-03-10 至 2026-03-11'
    });
  };

  return (
    <ScrollView style={styles.pageContainer}>
      {/* 顶部Banner */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={() => navigateTo('detail', { hotelId: 'hotel_001' })}
      >
        <ImageBackground
          source={{ uri: 'https://picsum.photos/id/1031/1200/300' }}
          style={styles.bannerImage}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>上海陆家嘴玥酒店</Text>
            <Text style={styles.bannerSubtitle}>豪华体验 · 近东方明珠 · 限时8折</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* 核心查询区域 */}
      <View style={styles.searchContainer}>
        {/* 当前地点 */}
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>当前地点</Text>
          <TextInput
            style={styles.searchInput}
            value={location}
            onChangeText={setLocation}
            placeholder="输入城市"
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
          />
        </View>

        {/* 关键字搜索 */}
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>关键字</Text>
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="酒店名称/商圈"
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
          />
        </View>

        {/* 日期选择 */}
        <View style={styles.searchItem}>
          <Text style={styles.searchLabel}>入住日期</Text>
          <Calendar />
        </View>

        {/* 筛选条件（星级+价格） */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>筛选条件</Text>
          <View style={styles.filterContent}>
            <View style={styles.starFilter}>
              <Text style={styles.filterSubLabel}>星级：</Text>
              {[2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={`star_${star}`}
                  style={[
                    styles.filterTag,
                    filters.star.includes(star) && styles.filterTagActive
                  ]}
                  onPress={() => handleFilterChange('star', star)}
                >
                  <Text style={styles.filterTagText}>{star}星</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.priceFilter}>
              <Text style={styles.filterSubLabel}>价格：</Text>
              {
                [
                  { id: 1, label: '≤300', value: 300 },
                  { id: 2, label: '300-600', value: 600 },
                  { id: 3, label: '600-1000', value: 1000 },
                  { id: 4, label: '≥1000', value: 1001 }
                ].map(item => (
                  <TouchableOpacity
                    key={`price_${item.id}`}
                    style={[
                      styles.filterTag,
                      filters.priceRange.includes(item.value) && styles.filterTagActive
                    ]}
                    onPress={() => handleFilterChange('price', item.value)}
                  >
                    <Text style={styles.filterTagText}>{item.label}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
          </View>
        </View>

        {/* 快捷标签 */}
        <View style={styles.tagsContainer}>
          <Text style={styles.filterLabel}>快捷标签</Text>
          <View style={styles.tagsContent}>
            {quickTags.map(tag => (
              <TouchableOpacity key={tag.id} style={styles.quickTag}>
                <Text style={styles.quickTagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 查询按钮 */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>查询酒店</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  // 首页Banner样式
  bannerContainer: {
    width: '100%',
    height: 180,
    marginBottom: 16
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  bannerOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff'
  },
  // 搜索区域样式
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    height: 44
  },
  searchLabel: {
    width: 60,
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14
  },
  // 筛选条件样式
  filterContainer: {
    marginBottom: 12
  },
  filterLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8
  },
  filterContent: {
    gap: 12
  },
  starFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  priceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  filterSubLabel: {
    fontSize: 14,
    color: '#666'
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  filterTagActive: {
    borderColor: '#1890ff',
    backgroundColor: 'rgba(24,144,255,0.1)'
  },
  filterTagText: {
    fontSize: 12,
    color: '#333'
  },
  // 快捷标签样式
  tagsContainer: {
    marginBottom: 16
  },
  tagsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  quickTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5fafe',
    borderRadius: 20
  },
  quickTagText: {
    fontSize: 12,
    color: '#1890ff'
  },
  // 搜索按钮样式
  searchBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#1890ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  }
});

export default HotelSearchPage;

// 酒店设施映射关系
export const amenitiesMap: Record<string, string> = {
  WiFi: "WiFi",
  Parking: "免费停车",
  Breakfast: "免费早餐",
  Family: "亲子友好",
  Gym: "健身房",
  Pool: "泳池",
  Pets: "可带宠物",
  Airport: "机场接送",
  pool: "泳池",
  gym: "健身房",
  spa: "水疗",
  restaurant: "餐厅",
  bar: "特色酒吧",
  hotel: "豪华酒店",
  apartment: "公寓",
  homestay: "主题民宿",
  hostel: "经济型青旅",
};

// 房型设施标签映射关系
export const roomTagsMap: Record<string, string> = {
  cancel: "免费取消",
  wifi: "免费WiFi",
  window: "有窗户",
  breakfast: "含早餐",
  bathroom: "独立卫浴",
  family_theme: "亲子主题房",
  loft: "复式LOFT房",
  movie: "影音房",
};

// 床型映射关系
export const bedTypeMap: Record<string, string> = {
  big: "大床",
  double: "双床",
  single: "单床",
  queen: "大床(1.8m)",
  king: "特大床(2.0m)",
};

// 热门筛选关键词映射（中文 -> 英文key）
export const hotFiltersMap: Record<string, string> = {
  '含早餐': 'breakfast',
  '免费取消': 'cancel',
  '免费WiFi': 'wifi',
  '免费停车': 'parking',
  '近地铁': 'subway',
  '亲子友好': 'family',
  '豪华酒店': 'hotel',
};

// 住宿类型关键词映射（中文 -> 英文key）
export const accommodationTypesMap: Record<string, string> = {
  '豪华酒店': 'hotel',
  '公寓': 'apartment',
  '主题民宿': 'homestay',
  '经济型青旅': 'hostel',
};

// 酒店特色关键词映射（中文 -> 英文key）
export const hotelFeaturesMap: Record<string, string> = {
  '泳池': 'pool',
  '健身房': 'gym',
  '水疗': 'spa',
  '餐厅': 'restaurant',
  '特色酒吧': 'bar',
};

// 客房特色关键词映射（中文 -> 英文key）
export const roomFeaturesMap: Record<string, string> = {
  '亲子主题房': 'family_theme',
  '复式LOFT房': 'loft',
  '影音房': 'movie',
};

// 工具函数：将映射转换为选项数组
const mapToOptions = (map: Record<string, string>) => 
  Object.entries(map).map(([label, key]) => ({ key, label }));

// 获取所有筛选关键词（中文）
export const getAllFilterKeywords = (): string[] => {
  return [
    ...Object.keys(hotFiltersMap),
    ...Object.keys(accommodationTypesMap),
    ...Object.keys(hotelFeaturesMap),
    ...Object.keys(roomFeaturesMap),
  ];
};

// 从列表页keyword中移除所有的filterOptions
export const removeFilterKeywords = (keyword: string): string => {
  const allKeywords = getAllFilterKeywords();
  let result = keyword;
  allKeywords.forEach(key => {
    result = result.replace(new RegExp(key, 'g'), '').replace(/\s+/g, ' ').trim();
  });
  return result;
};

// 解析keyword中的筛选关键词，返回对应的key列表
export const parseKeywordFilters = (keyword: string) => {
  const filters = {
    hotFilters: [] as string[],
    accommodationTypes: [] as string[],
    hotelFeatures: [] as string[],
    roomFeatures: [] as string[],
  };
  
  Object.entries(hotFiltersMap).forEach(([label, key]) => {
    if (keyword.includes(label)) {
      filters.hotFilters.push(key);
    }
  });
  
  Object.entries(accommodationTypesMap).forEach(([label, key]) => {
    if (keyword.includes(label)) {
      filters.accommodationTypes.push(key);
    }
  });
  
  Object.entries(hotelFeaturesMap).forEach(([label, key]) => {
    if (keyword.includes(label)) {
      filters.hotelFeatures.push(key);
    }
  });
  
  Object.entries(roomFeaturesMap).forEach(([label, key]) => {
    if (keyword.includes(label)) {
      filters.roomFeatures.push(key);
    }
  });
  
  return filters;
};

// 筛选选项配置（用于AdvancedFilter组件，从映射关系生成）
export const filterOptions = {
  hotFilters: mapToOptions(hotFiltersMap),
  accommodationTypes: mapToOptions(accommodationTypesMap),
  hotelFeatures: mapToOptions(hotelFeaturesMap),
  roomFeatures: mapToOptions(roomFeaturesMap),
};

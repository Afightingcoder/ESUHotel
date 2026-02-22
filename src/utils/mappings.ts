// 酒店设施映射关系
export const amenitiesMap: Record<string, string> = {
  WiFi: "WiFi",
  Parking: "停车场",
  Breakfast: "早餐",
  Family: "亲子友好",
  Gym: "健身房",
  Pool: "泳池",
  Pets: "可带宠物",
  Airport: "机场接送",
};

// 房型设施标签映射关系
export const roomTagsMap: Record<string, string> = {
  cancel: "免费取消",
  wifi: "免费WiFi",
  window: "有窗户",
  breakfast: "含早餐",
  parking: "免费停车",
  gym: "健身房",
};

// 床型映射关系
export const bedTypeMap: Record<string, string> = {
  big: "大床",
  double: "双床",
  single: "单床",
  queen: "大床(1.8m)",
  king: "特大床(2.0m)",
};

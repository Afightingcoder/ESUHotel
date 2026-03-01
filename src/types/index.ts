// 路由类型
export type RouteType = 'search' | 'list' | 'detail';

// 房型类型
export type RoomType = {
  _id: {
    $oid: string;
  };
  name: string;
  price: number;
  stock: number;
  capacity: number;
  bedType: string;
  tags: string[];
  photos: {
    url: string;
    isPrimary: boolean;
  }[];
  unavailableReason?: string;
};

// 酒店类型
export type HotelType = {
  id: string;
  name: string;
  nameEn: string;
  star: number;
  address: string;
  openingDate: string;
  photos: {
    url: string;
    isPrimary: boolean;
  }[];
  amenities: string[];
  status: string;
  rejectReason: string;
  isActive: boolean;
  isDeleted: boolean;
  ownerId: string;
  roomTypes: RoomType[] | {
    available: RoomType[];
    unavailable: RoomType[];
  };
  createTime: {
    $date: string;
  };
  updateTime: {
    $date: string;
  };
  __v: number;
};

// 高级筛选类型
export interface AdvancedFilters {
  hotFilters: string[];
  accommodationTypes: string[];
  hotelFeatures: string[];
  roomFeatures: string[];
}

// 基础搜索参数（多页面共用）
export interface BaseSearchParams {
  location?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  rooms?: number;
  adults?: number;
  children?: number;
}

// 首页路由参数
export interface SearchRouteParams extends BaseSearchParams {
  selectedPrice?: number | null;
  selectedStars?: number[];
}

// 列表页路由参数
export interface ListRouteParams extends BaseSearchParams {
  hotels?: HotelType[];
  selectedPrice?: number | null;
  selectedStars?: number[];
  advancedFilters?: AdvancedFilters;
  sortType?: string;
  updatedData?: {
    startDate?: string;
    endDate?: string;
    rooms?: number;
    adults?: number;
    children?: number;
    hotels?: HotelType[];
    location?: string;
  };
}

// 详情页路由参数
export interface DetailRouteParams extends BaseSearchParams {
  hotelId: string;
  hotelDetail?: HotelType;
  hotels?: HotelType[];
  selectedPrice?: number | null;
  selectedStars?: number[];
  advancedFilters?: AdvancedFilters;
  sortType?: string;
  fromRoute?: RouteType;
}

// 路由参数联合类型
export type RouteParams = SearchRouteParams | ListRouteParams | DetailRouteParams;

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// 酒店详情响应
export interface HotelDetailResponse {
  data: HotelType;
  message?: string;
}

// FlatList 事件类型
export interface FlatListScrollEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
      y: number;
    };
    contentSize?: {
      width: number;
      height: number;
    };
    layoutMeasurement?: {
      width: number;
      height: number;
    };
  };
}

// getItemLayout 返回类型
export interface ItemLayout {
  length: number;
  offset: number;
  index: number;
}

// 照片类型
export interface Photo {
  url: string;
  isPrimary: boolean;
}

// 酒店搜索参数（API请求用）
export interface HotelSearchParams {
  location?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  rooms?: number;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  page?: number;
  limit?: number;
}

// 酒店详情参数（API请求用）
export interface HotelDetailParams {
  startDate?: string;
  endDate?: string;
  rooms?: number;
  guests?: number;
}

// 分页信息
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// 酒店列表响应（带分页）
export interface HotelListResponse {
  success: boolean;
  data: HotelType[];
  pagination: Pagination;
}

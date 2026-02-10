// 路由类型
export type RouteType = 'search' | 'list' | 'detail';

// 酒店类型
export type HotelType = {
  id: string;
  name: string;
  nameEn: string;
  star: number;
  address: string;
  openingDate: string;
  photos: string[];
  nearbyInfo: string;
  status: string;
  rejectReason: string;
  isActive: boolean;
  isDeleted: boolean;
  ownerId: string;
  roomTypes: {
    id: string;
    name: string;
    price: number;
    stock: number;
    photos: string[];
  }[];
  createTime: {
    $date: string;
  };
  updateTime: {
    $date: string;
  };
  __v: number;
};

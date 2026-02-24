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

// 路由类型
export type RouteType = 'search' | 'hotelSearch' | 'list' | 'detail';

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
  roomTypes: {
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
  }[];
  createTime: {
    $date: string;
  };
  updateTime: {
    $date: string;
  };
  __v: number;
};

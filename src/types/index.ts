// 路由类型
export type RouteType = 'search' | 'list' | 'detail';

// 酒店类型
export type HotelType = {
  id: string;
  name: { cn: string; en: string };
  star: number;
  address: string;
  price: number;
  score: number;
  tags: string[];
  mainImage: string;
  images: string[];
  facilities: string[];
  roomTypes: {
    id: string;
    name: string;
    price: number;
    desc: string;
  }[];
};

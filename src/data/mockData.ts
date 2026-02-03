import type { HotelType } from '../types';

// 模拟酒店数据（实际项目从后端接口获取）
export const mockHotels: HotelType[] = [
  {
    id: 'hotel_001',
    name: { cn: '上海陆家嘴玥酒店', en: 'Shanghai Lujiazui Yue Hotel' },
    star: 4,
    address: '上海市浦东新区陆家嘴环路1288号',
    price: 936,
    score: 4.8,
    tags: ['豪华', '免费停车场', '近地铁'],
    mainImage: 'https://picsum.photos/id/1031/800/400',
    images: [
      'https://picsum.photos/id/1031/800/400',
      'https://picsum.photos/id/1039/800/400',
      'https://picsum.photos/id/1040/800/400'
    ],
    facilities: ['免费Wi-Fi', '自助早餐', '健身房', '游泳池'],
    roomTypes: [
      { id: 'rt_001', name: '经典双床房', price: 936, desc: '2张1.2米床，含双早，面积25㎡' },
      { id: 'rt_002', name: '豪华大床房', price: 1088, desc: '1张1.8米床，含双早，面积30㎡' },
      { id: 'rt_003', name: '行政套房', price: 1688, desc: '1张2.0米床，含双早+下午茶，面积45㎡' }
    ]
  },
  {
    id: 'hotel_002',
    name: { cn: '艺龙安悦酒店', en: 'Elong Anyue Hotel' },
    star: 3,
    address: '上海市浦东新区浦东大道歌浦路地铁站旁',
    price: 199,
    score: 4.5,
    tags: ['高性价比', '近地铁', '亲子友好'],
    mainImage: 'https://picsum.photos/id/1048/800/400',
    images: [
      'https://picsum.photos/id/1048/800/400',
      'https://picsum.photos/id/1054/800/400'
    ],
    facilities: ['免费Wi-Fi', '停车场', '24小时前台'],
    roomTypes: [
      { id: 'rt_004', name: '经济大床房', price: 199, desc: '1张1.5米床，无早，面积18㎡' },
      { id: 'rt_005', name: '家庭房', price: 299, desc: '1张1.8米床+1张1.2米床，含双早，面积22㎡' }
    ]
  },
  {
    id: 'hotel_003',
    name: { cn: '上海滨江精品酒店', en: 'Shanghai Riverside Boutique Hotel' },
    star: 3,
    address: '上海市徐汇区滨江大道567号',
    price: 588,
    score: 4.6,
    tags: ['江景房', '文艺', '免费早餐'],
    mainImage: 'https://picsum.photos/id/1067/800/400',
    images: [
      'https://picsum.photos/id/1067/800/400',
      'https://picsum.photos/id/1069/800/400'
    ],
    facilities: ['免费Wi-Fi', '自助早餐', '江景露台', '停车场'],
    roomTypes: [
      { id: 'rt_006', name: '江景大床房', price: 588, desc: '1张1.8米床，含双早，面积28㎡' },
      { id: 'rt_007', name: '江景套房', price: 888, desc: '1张2.0米床，含双早+晚餐，面积40㎡' }
    ]
  }
];

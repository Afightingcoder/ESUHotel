import type {HotelType} from '../types';

// 模拟酒店数据（实际项目从后端接口获取）
export const mockHotels: HotelType[] = [
  {
    id: 'hotel_001',
    name: '上海陆家嘴玥酒店',
    nameEn: 'Shanghai Lujiazui Yue Hotel',
    star: 4,
    address: '上海市浦东新区陆家嘴环路1288号',
    openingDate: '2026-02-17',
    photos: [
      'https://picsum.photos/id/1031/800/400',
      'https://picsum.photos/id/1039/800/400',
      'https://picsum.photos/id/1040/800/400',
    ],
    nearbyInfo: '距离陆家嘴地铁站500米',
    status: 'approved',
    rejectReason: '',
    isActive: true,
    isDeleted: false,
    ownerId: 'owner_001',
    roomTypes: [
      {
        id: 'rt_001',
        name: '经典双床房',
        price: 936,
        stock: 10,
        photos: [
          'https://picsum.photos/id/1031/800/400'
        ],
      },
      {
        id: 'rt_002',
        name: '豪华大床房',
        price: 1088,
        stock: 5,
        photos: [
          'https://picsum.photos/id/1039/800/400'
        ],
      },
      {
        id: 'rt_003',
        name: '行政套房',
        price: 1688,
        stock: 2,
        photos: [
          'https://picsum.photos/id/1040/800/400'
        ],
      },
    ],
    createTime: {
      $date: '2026-02-08T09:05:15.663Z'
    },
    updateTime: {
      $date: '2026-02-08T09:39:44.564Z'
    },
    __v: 0
  },
  {
    id: 'hotel_002',
    name: '艺龙安悦酒店',
    nameEn: 'Elong Anyue Hotel',
    star: 3,
    address: '上海市浦东新区浦东大道歌浦路地铁站旁',
    openingDate: '2026-02-17',
    photos: [
      'https://picsum.photos/id/1048/800/400',
      'https://picsum.photos/id/1054/800/400',
    ],
    nearbyInfo: '距离歌浦路地铁站100米',
    status: 'approved',
    rejectReason: '',
    isActive: true,
    isDeleted: false,
    ownerId: 'owner_002',
    roomTypes: [
      {
        id: 'rt_004',
        name: '经济大床房',
        price: 199,
        stock: 20,
        photos: [
          'https://picsum.photos/id/1048/800/400'
        ],
      },
      {
        id: 'rt_005',
        name: '家庭房',
        price: 299,
        stock: 10,
        photos: [
          'https://picsum.photos/id/1054/800/400'
        ],
      },
    ],
    createTime: {
      $date: '2026-02-08T09:05:15.663Z'
    },
    updateTime: {
      $date: '2026-02-08T09:39:44.564Z'
    },
    __v: 0
  },
  {
    id: 'hotel_003',
    name: '上海滨江精品酒店',
    nameEn: 'Shanghai Riverside Boutique Hotel',
    star: 3,
    address: '上海市徐汇区滨江大道567号',
    openingDate: '2026-02-17',
    photos: [
      'https://picsum.photos/id/1067/800/400',
      'https://picsum.photos/id/1069/800/400',
    ],
    nearbyInfo: '距离滨江大道步行5分钟',
    status: 'approved',
    rejectReason: '',
    isActive: true,
    isDeleted: false,
    ownerId: 'owner_003',
    roomTypes: [
      {
        id: 'rt_006',
        name: '江景大床房',
        price: 588,
        stock: 8,
        photos: [
          'https://picsum.photos/id/1067/800/400'
        ],
      },
      {
        id: 'rt_007',
        name: '江景套房',
        price: 888,
        stock: 3,
        photos: [
          'https://picsum.photos/id/1069/800/400'
        ],
      },
    ],
    createTime: {
      $date: '2026-02-08T09:05:15.663Z'
    },
    updateTime: {
      $date: '2026-02-08T09:39:44.564Z'
    },
    __v: 0
  },
];

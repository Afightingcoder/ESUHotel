// API封装文件
import {mockHotels} from '../data/mockData';
import {mockHotels} from '../data/mockData';

// 服务器基础地址
const SERVER_BASE = 'http://192.168.10.6:3000';

// API基地址
export const BASE_URL = `${SERVER_BASE}/api`;

// 图片URL处理函数
export const getImageUrl = (url: string): string => {
  if (!url) return '';

  // 如果是完整URL且包含localhost，替换为服务器IP
  if (url.includes('localhost:3000')) {
    return url.replace('localhost:3000', '192.168.10.6:3000');
  }

  // 如果是相对路径，添加服务器基础地址
  if (url.startsWith('/uploads')) {
    return `${SERVER_BASE}${url}`;
  }

  return url;
};
// 服务器基础地址
const SERVER_BASE = 'http://192.168.10.6:3000';

// API基地址
export const BASE_URL = `${SERVER_BASE}/api`;

// 图片URL处理函数
export const getImageUrl = (url: string): string => {
  if (!url) return '';

  // 如果是完整URL且包含localhost，替换为服务器IP
  if (url.includes('localhost:3000')) {
    return url.replace('localhost:3000', '192.168.10.6:3000');
  }

  // 如果是相对路径，添加服务器基础地址
  if (url.startsWith('/uploads')) {
    return `${SERVER_BASE}${url}`;
  }

  return url;
};

// 酒店搜索参数类型
export interface HotelSearchParams {
  location?: string; // 位置
  keyword?: string; // 酒店/品牌关键词
  startDate?: string; // 入住日期
  endDate?: string; // 离店日期
  rooms?: number; // 房间数
  guests?: number; // 总人数（成人+儿童）
  minPrice?: number; // 最低价格
  maxPrice?: number; // 最高价格
  stars?: number[]; // 星级数组
}

// 酒店详情参数类型
export interface HotelDetailParams {
  startDate?: string;       // 入住日期
  endDate?: string;         // 离店日期
  rooms?: number;           // 房间数
  guests?: number;          // 总人数（成人+儿童）
}

/**
 * 通用fetch请求函数
 * @param url 请求路径
 * @param options 请求选项
 * @returns Promise<any> 请求结果
 */
async function fetchApi(url: string, options: RequestInit = {}): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * 获取酒店列表（支持搜索参数）
 * @param params 搜索参数
 * @returns Promise<any> 酒店列表数据
 */
export const getHotelList = async (
  params?: HotelSearchParams,
): Promise<any> => {
export const getHotelList = async (
  params?: HotelSearchParams,
): Promise<any> => {
  // 构建查询字符串
  const queryParams = new URLSearchParams();


  if (params) {
    if (params.location) queryParams.append('location', params.location);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.rooms) queryParams.append('rooms', params.rooms.toString());
    if (params.guests) queryParams.append('guests', params.guests.toString());
    if (params.minPrice)
      queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.minPrice)
      queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.stars && params.stars.length > 0) {
      queryParams.append('stars', params.stars.join(','));
    }
  }


  const queryString = queryParams.toString();
  const url = queryString
    ? `/admin/hotels/published?${queryString}`
    : '/admin/hotels/published';

  const url = queryString
    ? `/admin/hotels/published?${queryString}`
    : '/admin/hotels/published';

  return fetchApi(url);
};

/**
 * 获取单个酒店详情
 * @param hotelId 酒店ID
 * @param params 查询参数（入住日期、离店日期、房间数、人数）
 * @returns Promise<any> 酒店详情数据
 */
export const getHotelDetail = async (hotelId: string, params?: HotelDetailParams): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.rooms) queryParams.append('rooms', params.rooms.toString());
    if (params.guests) queryParams.append('guests', params.guests.toString());
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/hotels/detail/${hotelId}?${queryString}` : `/hotels/detail/${hotelId}`;
  
  return fetchApi(url);
};

/**
 * 发送数据到指定接口
 * @param url 请求路径
 * @param data 发送的数据
 * @returns Promise<any> 请求结果
 */
export const postData = async (url: string, data: any): Promise<any> => {
  return fetchApi(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

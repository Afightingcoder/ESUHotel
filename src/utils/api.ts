// API封装文件

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
  location?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  rooms?: number;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
}

// 酒店详情参数类型
export interface HotelDetailParams {
  startDate?: string;
  endDate?: string;
  rooms?: number;
  guests?: number;
}

/**
 * 通用fetch请求函数
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
 */
export const getHotelList = async (
  params?: HotelSearchParams,
): Promise<any> => {
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
    if (params.stars && params.stars.length > 0) {
      queryParams.append('stars', params.stars.join(','));
    }
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `/admin/hotels/published?${queryString}`
    : '/admin/hotels/published';

  return fetchApi(url);
};

/**
 * 获取单个酒店详情
 */
export const getHotelDetail = async (
  hotelId: string,
  params?: HotelDetailParams,
): Promise<any> => {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.rooms) queryParams.append('rooms', params.rooms.toString());
    if (params.guests) queryParams.append('guests', params.guests.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `/hotels/detail/${hotelId}?${queryString}`
    : `/hotels/detail/${hotelId}`;

  return fetchApi(url);
};

/**
 * 发送数据到指定接口
 */
export const postData = async (url: string, data: any): Promise<any> => {
  return fetchApi(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// API封装文件

import type {
  HotelType,
  HotelSearchParams,
  HotelDetailParams,
  HotelListResponse,
  HotelDetailResponse,
} from '../types';

// 基地址
export const BASE_URL = 'https://easystay-admin-production.up.railway.app/api';

// API 错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 类型守卫：检查是否为有效响应
function isValidResponse<T>(response: unknown, requiredFields: string[]): response is T {
  if (typeof response !== 'object' || response === null) {
    return false;
  }
  const obj = response as Record<string, unknown>;
  return requiredFields.every(field => field in obj);
}

// 类型守卫：检查是否为酒店详情响应
export function isHotelDetailResponse(response: unknown): response is HotelDetailResponse {
  return isValidResponse<HotelDetailResponse>(response, ['data']);
}

// 类型守卫：检查是否为酒店列表
export function isHotelList(response: unknown): response is HotelListResponse {
  return Array.isArray(response);
}

/**
 * 通用fetch请求函数
 */
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        response.statusText
      );
    }
    
    const data: unknown = await response.json();
    console.log('API response:', data);
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * 获取酒店列表（支持搜索参数）
 */
export const getHotelList = async (params?: HotelSearchParams): Promise<HotelListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.location) queryParams.append('location', params.location);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.rooms) queryParams.append('rooms', params.rooms.toString());
    if (params.guests) queryParams.append('guests', params.guests.toString());
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.stars && params.stars.length > 0) {
      queryParams.append('stars', params.stars.join(','));
    }
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/admin/hotels/published?${queryString}` : '/admin/hotels/published';
  
  return fetchApi<HotelListResponse>(url);
};

/**
 * 获取单个酒店详情
 */
export const getHotelDetail = async (
  hotelId: string,
  params?: HotelDetailParams
): Promise<HotelDetailResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.rooms) queryParams.append('rooms', params.rooms.toString());
    if (params.guests) queryParams.append('guests', params.guests.toString());
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/hotels/public/${hotelId}?${queryString}` : `/hotels/public/${hotelId}`;
  
  return fetchApi<HotelDetailResponse>(url);
};

/**
 * 发送数据到指定接口
 */
export const postData = async <TRequest, TResponse>(
  url: string,
  data: TRequest
): Promise<TResponse> => {
  return fetchApi<TResponse>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 重新导出类型供其他模块使用
export type { HotelSearchParams, HotelDetailParams };

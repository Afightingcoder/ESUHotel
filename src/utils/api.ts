// API封装文件

// 基地址
export const BASE_URL = 'http://192.168.10.109:3000/api'; // 需要替换为本机ipv4地址, localhost移动端无法访问

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
 * 获取酒店列表
 * @returns Promise<any> 酒店列表数据
 */
export const getHotelList = async (): Promise<any> => {
  return fetchApi('/admin/hotels/published');
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

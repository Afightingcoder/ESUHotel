import { useState, useEffect } from 'react';
import type { HotelType } from '../types';
import { getHotelList, getHotelDetail } from '../utils/api';

interface UseBannerHotelResult {
  bannerHotel: HotelType | null;
  bannerLoading: boolean;
}

export const useBannerHotel = (): UseBannerHotelResult => {
  const [bannerHotel, setBannerHotel] = useState<HotelType | null>(null);
  const [bannerLoading, setBannerLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBannerHotel = async () => {
      try {
        setBannerLoading(true);
        const response = await getHotelList({ page: 1, limit: 1 });
        if (response.data && response.data.length > 0) {
          const firstHotel = response.data[0];
          if (firstHotel.id) {
            const detailResponse = await getHotelDetail(firstHotel.id);
            if (detailResponse && detailResponse.data) {
              setBannerHotel(detailResponse.data);
            } else {
              setBannerHotel(firstHotel);
            }
          } else {
            setBannerHotel(firstHotel);
          }
        }
      } catch (error) {
        console.error('获取banner酒店数据失败:', error);
      } finally {
        setBannerLoading(false);
      }
    };
    
    fetchBannerHotel();
  }, []);

  return { bannerHotel, bannerLoading };
};

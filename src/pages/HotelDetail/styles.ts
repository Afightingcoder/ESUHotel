import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    width: 60,
    marginRight: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  emptyView: {
    width: 60,
  },
  bannerContainer: {
    position: 'relative',
  },
  detailBanner: {
    width: SCREEN_WIDTH,
    height: 220,
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hotelBaseInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  baseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  hotelInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hotelStarLarge: {
    fontSize: 12,
  },
  openingDate: {
    fontSize: 12,
    color: '#b8860b',
    backgroundColor: '#ffd700',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotelAddressLarge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  facilitiesContainer: {
    marginBottom: 8,
  },
  facilityLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityText: {
    fontSize: 14,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  calendarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roomNightContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  roomNightContent: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  roomNightLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  roomNightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roomNightText: {
    fontSize: 14,
    color: '#333',
  },
  roomTypesContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  roomTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  roomTypeLeftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  roomTypeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  roomTypeInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  roomTypeDetailText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  roomTypeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roomTypeTagText: {
    fontSize: 11,
    color: '#1890ff',
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roomTypeRightContent: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    minWidth: 140,
  },
  stockText: {
    fontSize: 12,
    color: '#ff9500',
    marginBottom: 8,
  },
  priceAndBookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roomPriceSymbol: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: '500',
  },
  roomPrice: {
    fontSize: 22,
    color: '#1890ff',
    fontWeight: '700',
  },
  bookBtn: {
    width: 72,
    height: 32,
    backgroundColor: '#1890ff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  unavailableDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    fontSize: 13,
    color: '#999',
    paddingHorizontal: 12,
  },
  unavailableReason: {
    fontSize: 12,
    color: '#ff4d4f',
    marginTop: 4,
  },
});

export {SCREEN_WIDTH};

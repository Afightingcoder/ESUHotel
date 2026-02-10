import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // 列表页筛选头样式
  listFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backBtn: {
    // width: 60,
    marginRight: 8,
  },
  backBtnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterHeaderText: {
    fontSize: 12,
    color: '#333',
    flexWrap: 'wrap',
    width: '20%',
  },
  filterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    alignSelf: 'flex-end', 
  },
  filterBtnText: {
    fontSize: 12,
    color: '#333',
  },
  headerInfoItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 0,
  },
  headerInfoText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'left' as const,
    maxWidth: 50
  },
  searchBoxContainer: {
    marginLeft: 8,
    flex: 1,
    maxWidth: 200,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 12,
    color: '#999',
    marginRight: 6,
  },
  searchBox: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    padding: 0,
  },
  // 酒店列表项样式
  hotelItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  hotelImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  hotelInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  hotelNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    maxWidth: '80%',
  },
  hotelStar: {
    fontSize: 12,
    color: '#ff9500',
    borderWidth: 1,
    borderColor: '#ff9500',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  hotelAddress: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  hotelTags: {
    flexDirection: 'row',
    gap: 6,
  },
  hotelTagText: {
    fontSize: 10,
    color: '#1890ff',
    backgroundColor: 'rgba(24,144,255,0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  hotelPriceContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  hotelScore: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '500',
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hotelPriceSymbol: {
    fontSize: 12,
    color: '#ff4d4f',
    fontWeight: '500',
  },
  hotelPrice: {
    fontSize: 18,
    color: '#ff4d4f',
    fontWeight: '600',
  },
  hotelPriceDesc: {
    fontSize: 10,
    color: '#666',
  },
  // 加载更多样式
  loadMoreFooter: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    color: '#666',
  },
  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    marginTop: 66,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '80%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modalContent: {
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  locationModalContent: {
    // 位置选择内容样式
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44,
  },
  locationInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  verticalDivider: {
    width: 0.5,
    height: '60%',
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 20,
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1890ff',
  },
  horizontalDivider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#eee',
    marginTop: 8,
    marginBottom: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  searchLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  guestInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  guestInfoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  guestModalContent: {
    // 客房和人数选择内容样式
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // 客房和人数选择样式
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestRowLabel: {
    fontSize: 14,
    color: '#333',
  },
  numberControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  numberButtonDisabled: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  numberButtonText: {
    fontSize: 18,
    color: '#1890ff',
    fontWeight: '600',
  },
  numberButtonTextDisabled: {
    color: '#999',
  },
  numberValue: {
    minWidth: 40,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  numberValueText: {
    fontSize: 14,
    color: '#333',
  },
  // 间人数量容器
  modalBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  guestModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  numberModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  inputModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  // 数字选择弹窗样式
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  numberGridItem: {
    width: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberGridItemText: {
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 40,
    textAlign: 'center',
  },
  // 输入数字弹窗样式
  inputModalContent: {
    padding: 16,
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  inputModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputModalCancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  inputModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8,
  },
  inputModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputModalCancelButtonText: {
    color: '#333',
  },
  inputModalConfirmButtonText: {
    color: '#fff',
  },
});

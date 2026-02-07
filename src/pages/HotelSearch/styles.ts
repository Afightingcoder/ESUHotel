import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // 首页Banner样式
  bannerContainer: {
    width: '100%',
    height: 180,
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  // 搜索区域样式
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  locationSearchItem: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  searchLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  verticalDivider: {
    width: 0.5,
    height: '60%',
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  horizontalDivider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#eee',
    marginTop: 8,
    marginBottom: 8,
  },
  // 当前地点容器样式
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  locationInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  locationArrow: {
    fontSize: 14,
    color: '#999',
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
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1890ff',
  },
  // 筛选条件样式
  filterContainer: {
    marginBottom: 12,
  },
  filterContent: {
    gap: 12,
  },
  starFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterSubLabel: {
    fontSize: 14,
    color: '#666',
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filterTagActive: {
    borderColor: '#1890ff',
    backgroundColor: 'rgba(24,144,255,0.1)',
  },
  filterTagText: {
    fontSize: 12,
    color: '#333',
  },
  // 快捷标签样式
  tagsContainer: {
    marginBottom: 16,
  },
  tagsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  quickTagActive: {
    backgroundColor: '#e6f7ff',
  },
  quickTagText: {
    fontSize: 12,
    color: '#333',
  },
  quickTagTextActive: {
    color: '#1890ff',
  },
  // 搜索按钮样式
  searchBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#1890ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // 浮动标签样式
  floatingLabelInputContainer: {
    flex: 1,
    position: 'relative',
    height: 44,
  },
  floatingLabel: {
    position: 'absolute',
    top: -8,
    left: 12,
    fontSize: 12,
    color: '#999',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  searchInputWithValue: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  // 清除按钮样式
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{translateY: -10}],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  // 客房和人数统计样式
  guestInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestInfoText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  greyText: {
    color: '#999',
  },
  // 弹窗样式
  modalOverlay: {
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
    marginLeft: 16,
    marginRight: -10,
  },
  numberValueText: {
    fontSize: 14,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
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
  inputModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
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
  inputModalCancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  inputModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // 筛选弹窗样式
  filterModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  filterModalContent: {
    padding: 16,
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    minWidth: 120,
  },
  filterOptionItemActive: {
    borderColor: '#1890ff',
    backgroundColor: 'rgba(24, 144, 255, 0.05)',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextActive: {
    color: '#1890ff',
    fontWeight: '500',
  },
  filterOptionDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 16,
    color: '#1890ff',
    fontWeight: '600',
  },
  filterModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  filterModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalClearButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  filterModalConfirmButton: {
    backgroundColor: '#1890ff',
    marginLeft: 8,
  },
  filterModalClearButtonText: {
    fontSize: 16,
    color: '#333',
  },
  filterModalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

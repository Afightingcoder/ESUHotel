// 日期处理工具函数

/**
 * 创建日期选择处理函数
 * @param setStartDate 设置开始日期的函数
 * @param setEndDate 设置结束日期的函数
 * @returns 符合DateSelector组件期望的日期选择处理函数
 */
export const createDateSelectHandler = (setStartDate: (date: string) => void, setEndDate: (date: string) => void) => {
  return (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
};

/**
 * 处理日期选择
 * @param start 开始日期
 * @param end 结束日期
 * @returns 用于直接传递给组件的函数（需要在组件中绑定setState函数）
 */
export const handleDateSelect = (start: string, end: string) => {
  // 这个函数需要在组件中绑定setState函数使用
  // 例如：onDateSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
};

/**
 * 格式化日期为 MM-DD 格式
 * @param dateStr 日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const month = parts[1];
    const day = parts[2];
    return `${month}-${day}`;
  }
  return dateStr;
};

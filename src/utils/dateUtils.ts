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

/**
 * 计算两个日期之间的天数差（晚数）
 * @param startDate 开始日期字符串 (YYYY-MM-DD 或 MM-DD)
 * @param endDate 结束日期字符串 (YYYY-MM-DD 或 MM-DD)
 * @returns 晚数
 */
export const calculateNights = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 1;
  
  const currentYear = new Date().getFullYear();
  
  const parseDate = (dateStr: string): Date => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
    } else if (parts.length === 2) {
      return new Date(`${currentYear}-${parts[0]}-${parts[1]}`);
    }
    return new Date(dateStr);
  };
  
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

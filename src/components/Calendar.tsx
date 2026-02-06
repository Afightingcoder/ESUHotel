import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView
} from 'react-native';

interface CalendarProps {
  onDateSelect: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

// 获取今天的日期，格式为YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// 获取明天的日期，格式为YYYY-MM-DD
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
};

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  initialStartDate = getTodayDate(),
  initialEndDate = getTomorrowDate()
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 当前月份
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // 当前年份

  // 生成当月日期数组
  const generateDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // 计算居住晚数
  const calculateNights = () => {
    const start = new Date(startDate || initialStartDate);
    const end = new Date(endDate || initialEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // 处理日期选择
  const handleDateSelect = (day: number) => {
    const selectedDate = formatDate(currentYear, currentMonth, day);
    if (!startDate || (startDate && endDate)) {
      // 第一次选择或已选择了两个日期，重置为新的开始日期
      setStartDate(selectedDate);
      setEndDate('');
    } else if (startDate && !endDate) {
      // 已选择开始日期，选择结束日期
      if (new Date(selectedDate) < new Date(startDate)) {
        // 如果选择的日期早于开始日期，交换
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  // 处理完成按钮点击
  const handleComplete = () => {
    if (startDate && endDate) {
      onDateSelect(startDate, endDate);
      setIsVisible(false);
    }
  };

  // 切换月份
  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // 生成日期显示
  const renderDays = () => {
    const days = generateDays();
    return days.map(day => {
      const dateString = formatDate(currentYear, currentMonth, day);
      const isStartDate = dateString === startDate;
      const isEndDate = dateString === endDate;
      const isInRange = startDate && endDate && 
        dateString > startDate && dateString < endDate;

      return (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayItem,
            isStartDate && styles.startDate,
            isEndDate && styles.endDate,
            isInRange && styles.rangeDate
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text style={[
            styles.dayText,
            (isStartDate || isEndDate) && styles.selectedDayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  // 月份名称
  const monthNames = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // 格式化日期为显示格式
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 重置时间部分，只比较日期
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    // 获取月份和日期
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 检查是否是今天或明天
    if (compareDate.getTime() === today.getTime()) {
      return `${month}月${day}日 今天`;
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return `${month}月${day}日 明天`;
    } else {
      // 正常日期格式：x月x日 周x
      const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      return `${month}月${day}日 周${weekDay}`;
    }
  };

  return (
    <>
      {/* 日期显示和选择按钮 */}
      <TouchableOpacity
        style={styles.calendarContainer}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.dateDisplayContainer}>
          <Text style={styles.dateDisplayText}>
            <Text style={styles.datePart}>{formatDisplayDate(startDate || initialStartDate).split(' ')[0]}</Text>
            {formatDisplayDate(startDate || initialStartDate).split(' ')[1] && (
              <Text style={styles.weekPart}> {formatDisplayDate(startDate || initialStartDate).split(' ')[1]}</Text>
            )}
            {' - '}
            <Text style={styles.datePart}>{formatDisplayDate(endDate || initialEndDate).split(' ')[0]}</Text>
            {formatDisplayDate(endDate || initialEndDate).split(' ')[1] && (
              <Text style={styles.weekPart}> {formatDisplayDate(endDate || initialEndDate).split(' ')[1]}</Text>
            )}
          </Text>
          <Text style={styles.nightsDisplay}>共 {calculateNights()} 晚</Text>
        </View>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {/* 日历模态框 */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 模态框头部 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择入住和离店日期</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 月份导航 */}
            <View style={styles.monthNavigation}>
              <TouchableOpacity onPress={() => changeMonth('prev')}>
                <Text style={styles.navButton}>←</Text>
              </TouchableOpacity>
              <Text style={styles.currentMonth}>
                {currentYear}年 {monthNames[currentMonth]}
              </Text>
              <TouchableOpacity onPress={() => changeMonth('next')}>
                <Text style={styles.navButton}>→</Text>
              </TouchableOpacity>
            </View>

            {/* 星期标题 */}
            <View style={styles.weekHeader}>
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            {/* 日期网格 */}
            <View style={styles.daysGrid}>
              {renderDays()}
            </View>

            {/* 选择信息和完成按钮 */}
            <View style={styles.footer}>
              <View style={styles.dateInfo}>
                <Text style={styles.dateInfoText}>
                  入住: {startDate || '未选择'}
                </Text>
                <Text style={styles.dateInfoText}>
                  离店: {endDate || '未选择'}
                </Text>
                {startDate && endDate && (
                  <Text style={styles.nightsInfo}>
                    共 {calculateNights()} 晚
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  (!startDate || !endDate) && styles.completeButtonDisabled
                ]}
                onPress={handleComplete}
                disabled={!startDate || !endDate}
              >
                <Text style={styles.completeButtonText}>完成</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  calendarText: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  calendarIcon: {
    fontSize: 18
  },
  dateDisplayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateDisplayText: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  datePart: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  weekPart: {
    fontSize: 14,
    color: '#666'
  },
  nightsDisplay: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    fontSize: 24,
    color: '#666'
  },
  // 月份导航
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  navButton: {
    fontSize: 20,
    padding: 8
  },
  currentMonth: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  // 星期标题
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  // 日期网格
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  dayItem: {
    width: '14.28%', // 7 days per week
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2
  },
  dayText: {
    fontSize: 14,
    color: '#333'
  },
  startDate: {
    backgroundColor: '#1890ff',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  endDate: {
    backgroundColor: '#1890ff',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rangeDate: {
    backgroundColor: 'rgba(24, 144, 255, 0.2)'
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '500'
  },
  // 底部信息和按钮
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16
  },
  dateInfo: {
    marginBottom: 16
  },
  dateInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4
  },
  nightsInfo: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: '500',
    marginTop: 4
  },
  completeButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  completeButtonDisabled: {
    backgroundColor: '#ccc'
  },
  completeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  }
});

export default Calendar;
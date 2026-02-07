/**
 * 易宿酒店预订平台 - 用户端移动端入口
 * 核心流程：酒店查询页（首页）→ 酒店列表页 → 酒店详情页
 */
import React, {useState} from 'react';
import {SafeAreaView, useColorScheme, StatusBar} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// 导入页面组件
import HotelSearch from './src/pages/HotelSearch/HotelSearch';
import HotelList from './src/pages/HotelList/HotelList';
import HotelDetail from './src/pages/HotelDetail';

// 导入类型定义
import type {RouteType} from './src/types';

// 主应用组件（路由控制核心）
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentRoute, setCurrentRoute] = useState<RouteType>('search');
  const [routeParams, setRouteParams] = useState<any>({});

  // 路由跳转方法
  const navigateTo = (route: RouteType, params?: any) => {
    setRouteParams(params || {});
    setCurrentRoute(route);
  };

  // 返回上一页
  const navigateBack = () => {
    if (currentRoute === 'list') {
      navigateTo('search');
    }
    if (currentRoute === 'detail') {
      navigateTo('list', routeParams);
    }
  };

  // 根据当前路由渲染对应页面
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'search':
        return <HotelSearch navigateTo={navigateTo} />;
      case 'list':
        return <HotelList navigateTo={navigateTo} routeParams={routeParams} />;
      case 'detail':
        return (
          <HotelDetail navigateBack={navigateBack} routeParams={routeParams} />
        );
      default:
        return <HotelSearch navigateTo={navigateTo} />;
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {renderCurrentPage()}
    </SafeAreaView>
  );
};

export default App;

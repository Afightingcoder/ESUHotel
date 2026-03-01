/**
 * 易宿酒店预订平台 - 用户端移动端入口
 * 核心流程：酒店查询页（首页）→ 酒店列表页 → 酒店详情页
 */
import React, {useState} from 'react';
import {SafeAreaView, useColorScheme, StatusBar} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import HotelSearch from './src/pages/HotelSearch/HotelSearch';
import HotelList from './src/pages/HotelList/HotelList';
import HotelDetail from './src/pages/HotelDetail/HotelDetail';
import PageTransition from './src/components/PageTransition';

import type {
  RouteType,
  RouteParams,
  SearchRouteParams,
  ListRouteParams,
  DetailRouteParams,
} from './src/types';

const routeOrder: RouteType[] = ['search', 'list', 'detail'];

type NavigateFunction = (route: RouteType, params?: RouteParams) => void;
type NavigateBackFunction = (params?: Partial<DetailRouteParams>) => void;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentRoute, setCurrentRoute] = useState<RouteType>('search');
  const [routeParams, setRouteParams] = useState<RouteParams>({} as SearchRouteParams);
  const [previousRoute, setPreviousRoute] = useState<RouteType | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const navigateTo: NavigateFunction = (route, params) => {
    setRouteParams(params ?? ({} as SearchRouteParams));
    setPreviousRoute(currentRoute);
    setCurrentRoute(route);
    setAnimationKey(prev => prev + 1);
  };

  const navigateBack: NavigateBackFunction = (params) => {
    const detailParams = routeParams as DetailRouteParams;
    const targetRoute = detailParams?.fromRoute ?? previousRoute ?? 'search';
    
    if (targetRoute === 'search') {
      navigateTo('search', params as SearchRouteParams);
    } else if (targetRoute === 'list') {
      const listParams: ListRouteParams = {
        ...params,
        ...detailParams,
      };
      navigateTo('list', listParams);
    } else {
      navigateTo('search', params as SearchRouteParams);
    }
  };

  const getDirection = (): 'forward' | 'back' => {
    if (!previousRoute) return 'forward';
    const currentIndex = routeOrder.indexOf(currentRoute);
    const previousIndex = routeOrder.indexOf(previousRoute);
    return currentIndex < previousIndex ? 'back' : 'forward';
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'search':
        return (
          <HotelSearch
            navigateTo={navigateTo}
            routeParams={routeParams as SearchRouteParams}
          />
        );
      case 'list':
        return (
          <HotelList
            navigateTo={navigateTo}
            routeParams={routeParams as ListRouteParams}
          />
        );
      case 'detail':
        return (
          <HotelDetail
            navigateBack={navigateBack}
            routeParams={routeParams as DetailRouteParams}
          />
        );
      default:
        return (
          <HotelSearch
            navigateTo={navigateTo}
            routeParams={routeParams as SearchRouteParams}
          />
        );
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
      <PageTransition direction={getDirection()} trigger={animationKey}>
        {renderCurrentPage()}
      </PageTransition>
    </SafeAreaView>
  );
};

export default App;

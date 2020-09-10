import React, { FC } from 'react';
import _ from 'lodash';
import TopSectionItem from './TopSectionItem';
import config from '../../config';
import { getLocationSrv } from '@grafana/runtime';

const CN_Menu_Mapping: any = {
  create: '搜索',
  dashboard: '仪表盘',
  folder: '文件夹',
  import: '导入',
  dashboards: '仪表盘',
  home: '主页',
  divider: '分隔器',
  'manage-dashboards': '管理仪表盘',
  playlists: '播放列表',
  snapshots: '快照',
  explore: '探索',
  alerting: '告警',
  'alert-list': '告警规则',
  channels: '通知渠道',
  cfg: '配置',
  datasources: '数据源',
  users: '用户',
  teams: '团队',
  plugins: '插件',
  'org-settings': '组织设置',
  apikeys: 'API 密钥',
  admin: '服务器管理',
  'global-users': '全局用户',
  'global-orgs': '全局组织',
  'server-settings': '服务设置',
  'server-stats': '服务状态',
  upgrading: '升级',
};

const getCnMenuList = (menuList: any[]) => {
  if (menuList instanceof Array && menuList.length > 0) {
    for (let mn of menuList) {
      let lowerKey = mn.id || mn.text.toLowerCase();
      // console.log(lowerKey);
      if (Reflect.has(CN_Menu_Mapping, lowerKey)) {
        mn.text = CN_Menu_Mapping[lowerKey];
      }
      if (mn.children instanceof Array) {
        getCnMenuList(mn.children);
      }
    }
  }
};

const TopSection: FC<any> = () => {
  const navTree = _.cloneDeep(config.bootData.navTree);
  const mainLinks = _.filter(navTree, item => !item.hideFromMenu);
  getCnMenuList(mainLinks);
  // console.log(mainLinks);

  const searchLink = {
    text: '搜索',
    icon: 'search',
  };

  const onOpenSearch = () => {
    getLocationSrv().update({ query: { search: 'open' }, partial: true });
  };

  return (
    <div className="sidemenu__top">
      <TopSectionItem link={searchLink} onClick={onOpenSearch} />
      {mainLinks.map((link, index) => {
        return <TopSectionItem link={link} key={`${link.id}-${index}`} />;
      })}
    </div>
  );
};

export default TopSection;

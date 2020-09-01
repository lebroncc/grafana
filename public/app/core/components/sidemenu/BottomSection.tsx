import React from 'react';
import _ from 'lodash';
import SignIn from './SignIn';
import BottomNavLinks from './BottomNavLinks';
import { contextSrv } from 'app/core/services/context_srv';
import config from '../../config';
import { NavModelItem } from '@grafana/data';

const CN_Menu_Mapping: any = {
  profile: '管理员',
  'profile-settings': '设置',
  'change-password': '修改密码',
  'sign-out': '退出',
  help: '帮助',
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

export default function BottomSection() {
  const navTree: NavModelItem[] = _.cloneDeep(config.bootData.navTree);
  const bottomNav: NavModelItem[] = _.filter(navTree, item => item.hideFromMenu);
  const isSignedIn = contextSrv.isSignedIn;
  const user = contextSrv.user;

  if (user && user.orgCount > 1) {
    const profileNode: any = _.find(bottomNav, { id: 'profile' });
    if (profileNode) {
      profileNode.showOrgSwitcher = true;
    }
  }
  getCnMenuList(bottomNav);
  // console.log(bottomNav);

  return (
    <div className="sidemenu__bottom">
      {!isSignedIn && <SignIn />}
      {bottomNav.map((link, index) => {
        return <BottomNavLinks link={link} user={user} key={`${link.url}-${index}`} />;
      })}
    </div>
  );
}

import React from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import style from './App.module.css';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('加密解密', 'sub1', null, [
    getItem('RSA密钥生成', 'rsa', null),
    getItem('SSL证书生成', 'ssl', null),
  ]),
  { type: 'divider' },
  getItem('网络通信', 'sub2', null, [
    getItem('Socket', 'socket', null),
  ]),
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout hasSider>
      <Sider>
        <Menu
          onClick={onClick}
          style={{ width: 200, height: '100vh', userSelect: 'none', left: 0 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Content className={style.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
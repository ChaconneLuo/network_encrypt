import React from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

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
  getItem('加密解密', 'sub1', <MailOutlined />, [
    getItem('RSA密钥生成', 'rsa', null),
    getItem('SSL证书生成', 'ssl', null),
  ]),
  { type: 'divider' },
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <div className='container'>
      <Menu
        onClick={onClick}
        style={{ width: 200, height: '100vh', userSelect: 'none', left: 0 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
      <div className='content'>
        <Outlet />
      </div>
    </div >
  );
};

export default App;
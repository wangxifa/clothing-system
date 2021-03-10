import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

const layout = (props) => {
  return (
    <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">出入库管理</Menu.Item>
      </Menu>
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
      <div className="site-layout-background" style={{ padding: '24px 0', minHeight: 600 }}>
        {props.children}
      </div>
    </Content>
  </Layout>
  );
}

export default layout;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BlockOutlined
} from '@ant-design/icons';

import Companies from '../Companies/Companies'
import SearchHeader from '../../components/SearchHeader/SearchHeader'

import 'antd/dist/antd.css'
import classes from './Landing.module.css'

import myLogo from '../../assets/images/techinc.png'

const { Header, Sider, Content } = Layout;

const Landing = (props) => {
    const [collapsed, setCollapsed] = useState(false)

    // Company Page Header search filters
    const [companySearchByName, setCompanySearchByName] = useState(null)

    const toggle = () => {
        setCollapsed(!collapsed)
    }

    return (
        <Layout>

            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ height:'100vh' }}>

                    <Menu.Item key="1" icon={<BlockOutlined style={{fontSize:'16px'}}/>}>
                        <Link to="/">Companies</Link>
                    </Menu.Item>

                </Menu>
            </Sider>

            <Layout className={classes.SiteLayout}>
                <Header className={classes.SiteLayoutBackgroundHeader}>
                    <div className={classes.HeaderContent}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: classes.Trigger,
                        onClick: toggle,
                        })}
                        
                        <SearchHeader
                            collapsed={collapsed}
                            placeholder='by company name...'
                            setFilter={setCompanySearchByName}
                        />
                    </div>
                    <div className={classes.MyLogo}>
                        <img width='90%' height='90%' src={myLogo} />
                    </div>    

                </Header>

                <Content className={classes.SiteLayoutBackgroundContent}>
                    <Companies
                        {...props} 
                        filter={companySearchByName}
                        setCompany2Dash={props.setCompany2Dash}
                    />                  
                </Content>
            </Layout>

        </Layout>
    );
};

export default Landing;
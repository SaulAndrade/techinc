import React, {useState } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Layout, Menu, } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  StarOutlined,
  ClusterOutlined,
} from '@ant-design/icons';

import Home from '../Home/Home'
import Users from '../Users/Users'
import Units from '../Units/Units'
import Assets from '../Assets/Assets'
import SearchHeader from '../../components/SearchHeader/SearchHeader'
import StatusSearchHeader from '../../components/StatusSearchHeader/StatusSearchHeader'

import 'antd/dist/antd.css'
import classes from './Dashboard.module.css'

import DASHBOARD_ROUTES from './routes'

import myLogo from '../../assets/images/techinc.png'

const { Header, Sider, Content } = Layout;

const Dashboard = (props) => {
    const [collapsed, setCollapsed] = useState(false)
    const [company, setCompany] = useState({...props.company2Dash})

    //Header search filters
    const [unitSearchByName, setUnitSearchByName] = useState(null)
    const [userSearchByName, setUserSearchByName] = useState(null)
    const [assetSearchByStatus, setAssetSearchByStatus] = useState(null)

    const toggle = () => {
        setCollapsed(!collapsed)
    }

    const logoClasses = collapsed?classes.Logo_invisible:classes.Logo
    return (
        <Layout>

            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className={logoClasses}>{company.name}</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ height:'100vh' }}>
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to={props.match.path}>Home</Link>
                    </Menu.Item>

                    <Menu.Item key="2" icon={<ClusterOutlined style={{fontSize:'16px'}}/>}>
                        <Link to={props.match.path+DASHBOARD_ROUTES.units}>Units</Link>
                    </Menu.Item>

                    <Menu.Item key="3" icon={<StarOutlined />}>
                        <Link to={props.match.path+DASHBOARD_ROUTES.assets}>Assets</Link>
                    </Menu.Item>

                    <Menu.Item key="4" icon={<UserOutlined />}>
                        <Link to={props.match.path+DASHBOARD_ROUTES.users}>Users</Link>
                    </Menu.Item>

                    <Menu.Item key="5" icon={<ArrowLeftOutlined />}>
                        <Link to="/">Voltar</Link>
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

                        <Switch>
                            <Route path={props.match.path+DASHBOARD_ROUTES.assets} 
                                render={ props => {return (
                                        <StatusSearchHeader 
                                            {...props}   
                                            setFilter={setAssetSearchByStatus}
                                        />
                                )}}
                            />
                            <Route path={props.match.path+DASHBOARD_ROUTES.users} 
                                render={ props => {return (
                                        <SearchHeader 
                                            {...props}  
                                            collapsed={collapsed}
                                            placeholder='by user name' 
                                            setFilter={setUserSearchByName}
                                        /> 
                                )}}
                            />

                            <Route path={props.match.path+DASHBOARD_ROUTES.units} 
                                render={ props => {return (
                                        <SearchHeader 
                                            {...props}  
                                            collapsed={collapsed}
                                            placeholder='by unit name' 
                                            setFilter={setUnitSearchByName}
                                        /> 
                                )}}
                            />

                            <Route path={props.match.path} 
                                render={ props => {return (
                                       null 
                                )}}
                            />
                        </Switch>
                    </div>
                    <div className={classes.MyLogo}>
                        <img width='90%' height='90%' src={myLogo} />
                    </div>
                </Header>

                <Content className={classes.SiteLayoutBackgroundContent}>
                    <Switch>

                        <Route path={props.match.path+DASHBOARD_ROUTES.users} 
                               render={ props => {return (
                                    <Users {...props}  company={company} filter={userSearchByName}/> 
                               )}}
                        />

                        <Route path={props.match.path+DASHBOARD_ROUTES.units} 
                               render={ props => {return (
                                    <Units {...props} company={company} filter={unitSearchByName}/> 
                               )}}
                        />

                        <Route path={props.match.path+DASHBOARD_ROUTES.assets} 
                               render={ props => {return (
                                    <Assets {...props} company={company} filter={assetSearchByStatus}/>
                               )}}
                        />

                        <Route path={props.match.path} 
                               render={ props => {return (
                                    <Home {...props} /> 
                               )}}
                        />
                    </Switch>
                </Content>
            </Layout>

        </Layout>
    );
};

export default Dashboard;
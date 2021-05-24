import React, {useState} from 'react';
import { Switch, Route } from 'react-router-dom'
import axios from 'axios'

import Dashboard from './containers/Dashboard/Dashboard'
import Landing from './containers/Landing/Landing'

import classes from './App.module.css'

export const DASHBOARD_URL = '/dashboard'
export const axiosInstance = axios.create({
  baseURL:"https://my-json-server.typicode.com/tractian/fake-api"
})

//delays all requests to the API for 1s to show loading processes
axiosInstance.interceptors.request.use((req)=>{
  return new Promise (resolve => setTimeout(() => resolve(req), 500)) 
})

const App = () => {
  const [company2Dash, setCompany2Dash] = useState({id:null, name:null})

  return (
    <div className={classes.App}>
      <Switch>
        <Route path={DASHBOARD_URL} render={(props)=><Dashboard {...props} company2Dash={company2Dash} />} />
        <Route path='/' render={(props)=><Landing {...props} setCompany2Dash={setCompany2Dash}/>} />
      </Switch>
    </div>
  );
};

export default App;
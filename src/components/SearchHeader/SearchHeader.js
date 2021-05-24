import React from 'react';
import { Input } from 'antd';

import classes from './SearchHeader.module.css'

const { Search } = Input;

const CompanyHeader = (props) => {
    const mainSearchVisibilityClass = [classes.Search]
    const collapsedClass = !props.collapsed?classes.NotCollapsed:null
    

    if(collapsedClass) {
        mainSearchVisibilityClass.push(collapsedClass)
    }

    return (
        <div className={classes.Container}>
            <Search className={mainSearchVisibilityClass.join(" ")} 
                    placeholder={props.placeholder} 
                    onSearch={(searchParam)=>{props.setFilter(searchParam)}}
                    allowClear
                    enterButton 
            />
        </div>
    );
};

export default CompanyHeader;
import React from 'react';

import classes from './StatusSearchHeader.module.css'

const StatusSearchHeader = (props) => {
    return (
        <div className={classes.Container}>
            <div className={[classes.Badge, classes.Badge_inOp].join(' ')} onClick={()=>{props.setFilter('inOperation')}}>
                Em Operação
            </div>
            <div className={[classes.Badge, classes.Badge_inAl].join(' ')} onClick={()=>{props.setFilter('inAlert')}}>
                Em Alerta
            </div>
            <div className={[classes.Badge, classes.Badge_inDt].join(' ')} onClick={()=>{props.setFilter('inDowntime')}}>
                Parada
            </div>
            <div className={classes.ClearProp} onClick={()=>{props.setFilter(null)}}>
                x
            </div>
        </div>
    );
};

export default StatusSearchHeader;
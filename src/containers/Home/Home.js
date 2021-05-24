import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

import { axiosInstance } from '../../App'
import Piechart from '../../components/Piechart/Piechart'

import classes from './Home.module.css'

const GRAPH_COLORS = {
    total: '#0A3252',
    inOperation: '#137AA4',
    inAlert: '#A8BE38',
    inDowntime: '#85AEBA'
}

const Home = (props) => {
    const [loadingData, setLoadingData] = useState(false)
    const [totalHealthAvg, setTotalHealthAvg] = useState(null)
    const [inOpHealthAvg, setInOpHealthAvg] = useState(null)
    const [inAlHealthAvg, setInAlHealthAvg] = useState(null)
    const [inDtHealthAvg, setInDtHealthAvg] = useState(null)
    const [totalCount, setTotalCount] = useState(null)
    const [inOpCount, setInOpCount] = useState(null)
    const [inAlCount, setInAlCount] = useState(null)
    const [inDtCount, setInDtCount] = useState(null)

    useEffect(()=>{
        getData()
    }, [])

    const getData = async() => {
        setLoadingData(true)
        try {
            const res = await axiosInstance.get('/assets')
            const inOpHealths = []
            const inAlHealths = []
            const inDtHealths = []
            
            res.data.forEach(asset => {
                switch (asset.status){
                    case 'inAlert':
                        inAlHealths.push(parseFloat(asset.healthscore))
                        break

                    case 'inOperation':
                        inOpHealths.push(parseFloat(asset.healthscore))
                        break

                    case 'inDowntime':
                        inDtHealths.push(parseFloat(asset.healthscore))
                        break
                }    
            })

            const totalHealths = [...inOpHealths, ...inAlHealths, ...inDtHealths]

            setTotalHealthAvg( (totalHealths.reduce((prev,cur)=>prev+cur,0)/totalHealths.length) )
            setInOpHealthAvg( (inOpHealths.reduce((prev,cur)=>prev+cur,0)/inOpHealths.length) )
            setInAlHealthAvg( (inAlHealths.reduce((prev,cur)=>prev+cur,0)/inAlHealths.length) )
            setInDtHealthAvg( (inDtHealths.reduce((prev,cur)=>prev+cur,0)/inDtHealths.length) )

            setInOpCount(inOpHealths.length)
            setInAlCount(inAlHealths.length)
            setInDtCount(inDtHealths.length)
            setTotalCount(totalHealths.length)
        }
        catch(e) {
            message.error('não foi possível se comunicar com o servidor')
            console.error(e)
        }
        finally {
            setLoadingData(false)
        } 
    }

    return (
        <div className={classes.Container} >

            <div className={classes.Row}>

                <div className={classes.InfoContainer}>

                    <div className={classes.NumberContainer}>
                        <h1 className={classes.Total_text}>TOTAL de<br/>ATIVOS</h1>
                        <h2 className={classes.Total_text}>{totalCount?totalCount:0}</h2>
                    </div>

                    <hr className={classes.InfoDivider} />

                    <div className={classes.GraphContainer}>
                        {!loadingData
                            ?<Piechart 
                                colorsArray={[GRAPH_COLORS.total]} 
                                titleFontSize='30px' 
                                legend='saúde média - total de ativos(%)'
                                stringHealthscore={totalHealthAvg?`${totalHealthAvg.toFixed(2)}%`:''}
                                data={totalHealthAvg}
                            />
                            :<div style={{textAlign:'center'}}>
                                <Spin 
                                    indicator={<LoadingOutlined style={{ fontSize:150, color:GRAPH_COLORS.total }} />}
                                    spinning
                                />
                            </div>
                        }
                    </div>

                </div>

                <div className={classes.InfoContainer}>

                    <div className={classes.NumberContainer}>
                        <h1 className={classes.InOperation_text}>EM OPERAÇÃO</h1>
                        <h2 className={classes.InOperation_text}>{inOpCount?inOpCount:0}</h2>
                    </div>

                    <hr className={classes.InfoDivider} />

                    <div className={classes.GraphContainer}>
                        {!loadingData
                            ?<Piechart 
                                colorsArray={[GRAPH_COLORS.inOperation]} 
                                titleFontSize='30px' 
                                legend='saúde média - ativos em operação(%)'
                                stringHealthscore={inOpHealthAvg?`${inOpHealthAvg.toFixed(2)}%`:''}
                                data={inOpHealthAvg}
                            />
                            :<div style={{textAlign:'center'}}>
                                <Spin 
                                    indicator={<LoadingOutlined style={{ fontSize:150, color:GRAPH_COLORS.inOperation }} />}
                                    spinning
                                />
                            </div>
                        }
                    </div>
                    
                </div>

            </div>


            <div className={classes.Row}>

                <div className={classes.InfoContainer}>

                    <div className={classes.NumberContainer}>
                        <h1 className={classes.InDowntime_text}>EM PARADA</h1>
                        <h2 className={classes.InDowntime_text}>{inDtCount?inDtCount:0}</h2>
                    </div>

                    <hr className={classes.InfoDivider} />

                    <div className={classes.GraphContainer}>
                        {!loadingData
                            ?<Piechart 
                                colorsArray={[GRAPH_COLORS.inDowntime]} 
                                titleFontSize='30px' 
                                legend='saúde média - ativos em parada(%)'
                                stringHealthscore={inDtHealthAvg?`${inDtHealthAvg.toFixed(2)}%`:''}
                                data={inDtHealthAvg}
                            />
                            :<div style={{textAlign:'center'}}>
                                <Spin 
                                    indicator={<LoadingOutlined style={{ fontSize:150, color:GRAPH_COLORS.inDowntime }} />}
                                    spinning
                                />
                            </div>
                        }
                    </div>

                </div>

                <div className={classes.InfoContainer}>

                    <div className={classes.NumberContainer}>
                        <h1 className={classes.InAlert_text}>EM ALERTA</h1>
                        <h2 className={classes.InAlert_text}>{inAlCount?inAlCount:0}</h2>
                    </div>

                    <hr className={classes.InfoDivider} />

                    <div className={classes.GraphContainer}>
                        {!loadingData
                            ?<Piechart 
                                colorsArray={[GRAPH_COLORS.inAlert]} 
                                titleFontSize='30px' 
                                legend='saúde média - ativos em alerta(%)'
                                stringHealthscore={inAlHealthAvg?`${inAlHealthAvg.toFixed(2)}%`:''}
                                data={inAlHealthAvg}
                            />
                            :<div style={{textAlign:'center'}}>
                                <Spin 
                                    indicator={<LoadingOutlined style={{ fontSize:150, color:GRAPH_COLORS.inAlert }} />}
                                    spinning
                                />
                            </div>
                        }
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Home
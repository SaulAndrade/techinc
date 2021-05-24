import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Card, Skeleton, Row, Col, Button, Alert, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { axiosInstance } from '../../App'
import Asset, { AssetAddForm, AssetSwapForm, AssetEditForm } from './Asset/Asset'

import classes from './Assets.module.css'

const Assets = (props) => {
  const editForm = useRef(null)
  const swapForm = useRef(null)
  
  const [assets, setAssets] = useState(null)
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [units, setUnits] = useState(null)
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [opLoading, setOpLoading] = useState(false)
  const [popConfirmVisibility, setPopConfirmVisibility] = useState({id:null})
  const [editModalVisibility, setEditModalVisibility] = useState(false)
  const [swapModalVisibility, setSwapModalVisibility] = useState(false)
  const [addModalVisibility, setAddModalVisibility] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)
  const [swapingAsset, setSwapingAsset] = useState(null)

  useEffect(()=>{
    if (props.company && props.company.id!==null){
        getAssets(props.company.id)
        getUnits(props.company.id)
    }

  }, [props.company])

  useEffect(()=>{
    if (swapingAsset&&swapingAsset.id !==null) {
        swapForm.current.setFieldsValue({assetUnitId:swapingAsset.unitId})
    }

}, [swapingAsset])

  useEffect(()=>{
    if (editingAsset&&editingAsset.id !==null) {
        editForm.current.setFieldsValue({
          assetModel:editingAsset.model,
          assetName:editingAsset.name,
          assetImgUrl:editingAsset.image,
          assetUnitId:editingAsset.unitId,
          assetMaxTemp:editingAsset.specifications.maxTemp,
          assetPower:editingAsset.specifications.power,
          assetFreq:editingAsset.specifications.rpm,
          assetSensors:editingAsset.sensors.join(',')
        })
    }

}, [editingAsset])

  const showPopConfirmHandler = (assetId) => {
      setPopConfirmVisibility({id:assetId})
  }

  const cancelPopConfirmHandler = () => {
      setPopConfirmVisibility({id:null})
  }

  const showEditModalHandler = (asset) => {
      cancelPopConfirmHandler()
      setEditingAsset({...asset})
      setEditModalVisibility(true)
      
  }

  const hideEditModalHandler = () => {
      setEditModalVisibility(false)
      setEditingAsset(null)
  }

  const showSwapModalHandler = (asset) => {
      cancelPopConfirmHandler()
      setSwapingAsset({...asset})
      setSwapModalVisibility(true)
  }

  const hideSwapModalHandler = () => {
      setSwapModalVisibility(false)
      setSwapingAsset(null)
  }

  const showAddModalhandler = () => {
      cancelPopConfirmHandler()
      setAddModalVisibility(true)
  }

  const hideAddModalHandler = () => {
      setAddModalVisibility(false)
  }

  const backgroundClickedHandler = () => {
    hideAddModalHandler()
    hideEditModalHandler()
    hideSwapModalHandler()
    cancelPopConfirmHandler()
  }

  const getUnits = async(companyId) => {
    setLoadingUnits(true)
    try {
        const res = await axiosInstance.get('/units')
        const filteredUnits = res.data.filter(unt=>unt.companyId==companyId)
        setUnits(filteredUnits)
    }
    catch(e) {
        setUnits([])
        message.error('não foi possível se comunicar com o servidor')
        console.error(e)
    }
    finally {
        setLoadingUnits(false)
    } 
   }

  const getAssets = async(companyId) => {
    setLoadingAssets(true)
        try {
            const res = await axiosInstance.get('/assets')
            const filteredAssets = res.data.filter(asset=>asset.companyId==companyId)
            setAssets(filteredAssets)
        }
        catch(e) {
            setAssets([])
            message.error('não foi possível se comunicar com o servidor')
            console.error(e)
        }
        finally {
            setLoadingAssets(false)
        } 
  }

  const deleteAssetHandler = async(assetId, assetName) => {
    setOpLoading(true)
    try {
        const res = await axiosInstance.delete(`/assets/${assetId}`)
        const filteredAssets = assets.filter(asset=>asset.id!=assetId)
        setAssets(filteredAssets)
        message.success(`${assetName} - excluído`)
        
    }
    catch(e) {
        message.error('Recurso não excluído')
        console.error(e)
    }
    finally {
        setOpLoading(false)
        cancelPopConfirmHandler()
    }
  
  }
  
  const editAssetHandler = async(formValues) => {
    setOpLoading(true)
    try {
        const payload = {
          model:formValues.assetModel, 
          name:formValues.assetName,
          image:formValues.assetImgUrl,
          specifications:
          {
            maxTemp:formValues.assetMaxTemp,
            power:formValues.assetPower,
            rpm:formValues.assetFreq
          },
          sensors:formValues.assetSensors.split(','),
          companyId:props.company.id,
          unitId:formValues.assetUnitId
        }
        const res = await axiosInstance.patch(`/assets/${editingAsset.id}`, payload)
       
        const updatedAssets = assets.map(asset=>{
            if (asset.id!=editingAsset.id){
                return asset
            }
            else {
                return res.data
            }
        })
        
        setAssets(updatedAssets)
        message.success(`${editingAsset.name} - alterado`)
    }
    catch(e) {
        message.error('recurso não alterada')
        console.error(e)
    }
    finally {
        hideEditModalHandler()
        setOpLoading(false)
    } 
  }

  const swapAssetHandler = async(formValues) => {
    setOpLoading(true)
    try {
        const res = await axiosInstance.patch(`/assets/${swapingAsset.id}`, { unitId:formValues.assetUnitId})
       
        const updatedAssets = assets.map(asset=>{
            if (asset.id!=swapingAsset.id){
                return asset
            }
            else {
                return res.data
            }
        })
        
        setAssets(updatedAssets)
        message.success(`${swapingAsset.name} - alterado`)
    }
    catch(e) {
        message.error('recurso não alterada')
        console.error(e)
    }
    finally {
        hideSwapModalHandler()
        setOpLoading(false)
    } 
  }
  
  const addAssetHandler = async(formValues) => {
    setOpLoading(true)
    try {
      const payload = {
          model:formValues.assetModel, 
          name:formValues.assetName,
          image:formValues.assetImgUrl,
          specifications:
          {
            maxTemp:formValues.assetMaxTemp,
            power:formValues.assetPower,
            rpm:formValues.assetFreq
          },
          sensors:formValues.assetSensors.split(','),
          companyId:props.company.id,
          unitId:formValues.assetUnitId
        }

        const res = await axiosInstance.post(`/assets`, payload)
        const updatedAssets = [...assets]
        updatedAssets.push(res.data)
        setAssets(updatedAssets)
        message.success(`${formValues.assetName} - cadastrado`)
    }
    catch(e) {
        message.error('recurso não cadastrado')
        console.error(e)
    }
    finally {
        hideAddModalHandler()
        setOpLoading(false)
    }
  }

  if (!(props.company && props.company.id)){
    return <Redirect to='/'/>
  }

  let content = (
    <Alert type='warning' message='Não constam recursos.' style={{textAlign:'center'}} />
  )

  let assetsToView = assets
  if (assets && assets.length>0){
      if (props.filter){
          assetsToView = assets.filter(asset => asset.status===props.filter)
      }

      const assetsEl = assetsToView.map(asset => {
          return (
              //24 sections are antd default values, only applies if there are enough elements
              <Col key={'asset-'+asset.id}
                  xs={(assetsToView.length>=1)?{span:24/1}:null}
                  sm={(assetsToView.length>=2)?{span:24/2}:null}
                  md={(assetsToView.length>=3)?{span:24/3}:null}
                  lg={(assetsToView.length>=4)?{span:24/4}:null}
              >
                  <Asset
                      company={props.company}
                      units={units || []} 
                      asset={asset}
                      popConfirmVisibility = {popConfirmVisibility} 
                      showEditModal={showEditModalHandler}
                      deleteAsset={deleteAssetHandler}
                      showPopConfirm={showPopConfirmHandler}
                      cancelPopConfirm = {cancelPopConfirmHandler}
                      showSwapModal = {showSwapModalHandler}
                      getAssets = {getAssets}
                      opLoading={opLoading}
                  />
              </Col>
          )
      })

      content = (
          <div className={classes.GridContainer}>
              <Row gutter={[16, 16]} style={{width:'100%'}}>
                  {assetsEl}
              </Row>
          </div>   
      )
    }
    else{
      content =  <Alert type='warning' message='Não constam recursos.' style={{textAlign:'center'}} />
    } 

  return (
      <Space direction='vertical' style={{width:"100%", height:"100%"}} >
                
          <button className={classes.AddButton} onClick={()=>{showAddModalhandler()}}>
                  <PlusOutlined /> Recurso
          </button>

          <div className={classes.Background} onClick={()=>{backgroundClickedHandler()}}></div>

          {editingAsset&&editingAsset.name?
          <Modal
              visible={editModalVisibility}
              title={`Alterar Dados: ${editingAsset.name}`}
              onCancel={()=>{hideEditModalHandler()}}
              footer={null}>
                  
                      <AssetEditForm
                          reference={editForm} 
                          units={units || []} 
                          onFinish={(vals)=>{editAssetHandler(vals)}}
                          opLoading={opLoading}
                      />
          </Modal> :null}

          <Modal 
              visible={addModalVisibility}
              title={`Cadastrar recurso:`}
              onCancel={()=>{hideAddModalHandler()}}
              footer={null}>
              <AssetAddForm
                  onFinish={(vals)=>{addAssetHandler(vals)}}
                  units={units || []}
                  opLoading={opLoading}
              />
          </Modal>

          <Modal 
              visible={swapModalVisibility}
              title={`Transferir recurso:`}
              onCancel={()=>{hideSwapModalHandler()}}
              footer={null}>
              <AssetSwapForm
                  reference={swapForm}
                  onFinish={(vals)=>{swapAssetHandler(vals)}}
                  units={units || []}
                  opLoading={opLoading}
              />
          </Modal>

          <Skeleton loading={loadingAssets} active >
            {content}
          </Skeleton>
      </Space>
    )
}



export default Assets
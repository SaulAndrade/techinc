import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom';
import { Modal, Card, Skeleton, Row, Col, Button, Alert, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import Unit, { UnitEditForm, UnitAddForm } from './Unit/Unit'
import { axiosInstance } from '../../App'

import classes from './Units.module.css';



const Units = (props) => {
    const editForm = useRef(null)

    const [units, setUnits] = useState(null)
    const [loadingUnits, setLoadingUnits] = useState(false)
    const [opLoading, setOpLoading] = useState(false)
    const [popConfirmVisibility, setPopConfirmVisibility] = useState({id:null})
    const [editModalVisibility, setEditModalVisibility] = useState(false)
    const [addModalVisibility, setAddModalVisibility] = useState(false)
    const [editingUnit, setEditingUnit] = useState({id: null, name: null, companyId:null})

    useEffect(()=>{
        if (props.company && props.company.id!==null){
            getUnits(props.company.id)
        }

    }, [])

    useEffect(()=>{
        if (editingUnit.id !==null) {
            editForm.current.setFieldsValue({unitName:editingUnit.name})
        }

    }, [editingUnit])

    const showPopConfirmHandler = (unitId) => {
        setPopConfirmVisibility({id:unitId})
    }

    const cancelPopConfirmHandler = () => {
        setPopConfirmVisibility({id:null})
    }

    const showEditModalHandler = (unit) => {
        cancelPopConfirmHandler()
        setEditingUnit({...unit})
        setEditModalVisibility(true)
        
    }

    const hideEditModalHandler = () => {
        setEditModalVisibility(false)
        setEditingUnit({id: null, name: null, companyId:null})
    }

    const showAddModalhandler = () => {
        cancelPopConfirmHandler()
        setAddModalVisibility(true)
    }

    const hideAddModalHandler = () => {
        setAddModalVisibility(false)
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

    const deleteUnitHandler = async(unitId, unitName) => {
        if (units.length == 1){
            message.error('Necessário existir ao menos 1 unidade')
            cancelPopConfirmHandler()
            return
        }

        setOpLoading(true)
        try {
            const res = await axiosInstance.delete(`/users/${unitId}`)
            const filteredUnits = units.filter(unit=>unit.id!=unitId)
            setUnits(filteredUnits)
            message.success(`unidade - ${unitName} - excluída`)
            
        }
        catch(e) {
            message.error('unidade não excluída')
            console.error(e)
        }
        finally {
            setOpLoading(false)
            cancelPopConfirmHandler()
        }

    }

    const editUnitHandler = async(formValues) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.patch(`/users/${editingUnit.id}`, { name:formValues.unitName})
           
            const updatedUnits = units.map(unit=>{
                if (unit.id!=editingUnit.id){
                    return unit
                }
                else {
                    return res.data
                }
            })
            
            setUnits(updatedUnits)
            message.success(`unidade - ${editingUnit.name} - alterada`)
        }
        catch(e) {
            message.error('unidade não alterada')
            console.error(e)
        }
        finally {
            hideEditModalHandler()
            setOpLoading(false)
        } 
    }

    const addUnitHandler = async(formValues) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.post(`/units`, { name:formValues.unitName })
            const updatedUnits = [...units]
            updatedUnits.push(res.data)
            setUnits(updatedUnits)
            message.success(`unidade - ${formValues.unitName} - cadastrada`)
        }
        catch(e) {
            message.error('unidade não cadastrada')
            console.error(e)
        }
        finally {
            hideAddModalHandler()
            setOpLoading(false)
        }
    }

    const backgroundClickedHandler = () => {
        hideAddModalHandler()
        hideEditModalHandler()
        cancelPopConfirmHandler()
    }

    if (!(props.company&&props.company.id)){
        return <Redirect to='/' />
    }

    let content = (
        <Card style={{ width: '300px', marginTop: 16}} >
            <Skeleton loading={loadingUnits} avatar active />
        </Card>
    )

    let unitsToView = units
    if (units && units.length>0){
        if (props.filter){
            const searchParam = RegExp(String.raw`${props.filter}`, "i")
            unitsToView = units.filter(unit => unit.name.match(searchParam))
        }

        const unitsEl = unitsToView.map(unit => {
            return (
                //24 sections are antd default values, only applies if there are enough elements
                <Col key={'unit-'+unit.id}
                    xs={(unitsToView.length>=1)?{span:24/1}:null}
                    sm={(unitsToView.length>=2)?{span:24/2}:null}
                    md={(unitsToView.length>=3)?{span:24/3}:null}
                    lg={(unitsToView.length>=4)?{span:24/4}:null}
                >
                    <Unit
                        company={props.company}
                        unit={unit}
                        popConfirmVisibility = {popConfirmVisibility} 
                        showEditModal={showEditModalHandler}
                        deleteUnit={deleteUnitHandler}
                        showPopConfirm={showPopConfirmHandler}
                        cancelPopConfirm = {cancelPopConfirmHandler}
                        opLoading={opLoading}
                    />
                </Col>
            )
        })

        content = (
            <div className={classes.GridContainer}>
                <Row gutter={[16, 8]} style={{width:'100%'}}>
                    {unitsEl}
                </Row>
            </div>   
        )
    } 
    else if (units && units.length == 0){
        content = <Alert 
                    type='warning' 
                    message='Unidades não localizadas' 
                    style={{textAlign:'center'}}
                  />
    }

    return (
        <Space direction='vertical' style={{width:"100%", height:"100%"}} >
            
            <button className={classes.AddButton} onClick={()=>{showAddModalhandler()}}>
                    <PlusOutlined /> Unidade
            </button>

            <div className={classes.Background} onClick={()=>{backgroundClickedHandler()}}></div>

            <Modal
                visible={editModalVisibility}
                title={`Alterar Dados: ${editingUnit.name}`}
                onCancel={()=>{hideEditModalHandler()}}
                footer={null}>
                    {editingUnit.name?
                        <UnitEditForm 
                            reference={editForm} 
                            unit={editingUnit} 
                            onFinish={(vals)=>{editUnitHandler(vals)}}
                            opLoading={opLoading}
                        />
                        :null
                    }
            </Modal>

            <Modal 
                visible={addModalVisibility}
                title={`Cadastrar unidade:`}
                onCancel={()=>{hideAddModalHandler()}}
                footer={null}>
                <UnitAddForm
                    onFinish={(vals)=>{addUnitHandler(vals)}}
                    opLoading={opLoading}
                />
            </Modal>

            {content}

        </Space>
    
    );
};

export default Units
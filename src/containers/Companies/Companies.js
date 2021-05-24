import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, message, Modal, Button, Space, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import Company, { CompanySkeleton, CompanyAddForm, CompanyEditForm } from './Company/Company'

import { axiosInstance } from '../../App'

import classes from './Companies.module.css';

const Companies = (props) => {
    const editForm = useRef(null)

    const [companies, setCompanies] = useState(null)
    const [loadingCompanies, setLoadingCompanies] = useState(false)
    const [opLoading, setOpLoading] = useState(false)
    const [popVisible, setPopVisible] = useState({id:null})
    const [changeModalVisibility, setChangeModalVisibility] = useState(false)
    const [addModalVisibility, setAddModalVisibility] = useState(false)
    const [editingCompany, setEditingCompany] = useState({name:null})

    useEffect(()=>{
        getCompanies()
    }, [])

    useEffect(()=>{
        if(editingCompany.name !== null){
            editForm.current.setFieldsValue({companyName:editingCompany.name})        
        }

    }, [editingCompany])

    const getCompanies = async() => {
        setLoadingCompanies(true)
        try {
            const res = await axiosInstance.get('/companies')
            setCompanies(res.data)
        }
        catch(e) {
            setCompanies([])
            message.error('não foi possível se comunicar com o servidor')
            console.error(e)
        }
        finally {
            setLoadingCompanies(false)
        } 
    
    }

    const checkPopHandler = (company_id) => {
        let visible = false
        if(popVisible.id && popVisible.id==company_id){
            visible = true
        }
        return visible      
    }

    const showPopHandler = (company_id) => {
        setPopVisible({id:company_id})
    }

    const hidePopHandler = () => {
        setPopVisible({id:null})
    }

    const showModalHandler = (company_id, company_name) => {
        hidePopHandler()
        setEditingCompany({id:company_id, name:company_name})
        setChangeModalVisibility(true)
    }

    const hideModalHandler = () => {
        setEditingCompany({id:null, name:null})
        setChangeModalVisibility(false)
    }

    const showAddModalHandler = () => {
        hidePopHandler()
        setAddModalVisibility(true)
    }

    const hideAddModalHandler = () => {
        setAddModalVisibility(false)
    }

    const backgroundClickedHandler = () => {
        hidePopHandler()
        hideModalHandler()
        hideAddModalHandler()
    }

    const alterCompanyHandler = async(formValues) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.patch(`/companies/${editingCompany.id}`, { name:formValues.companyName})
           
            const updatedCompanies = companies.map(company=>{
                if (company.id!=editingCompany.id){
                    return company
                }
                else {
                    return res.data
                }
            })
            
            setCompanies(updatedCompanies)
            message.success(`empresa - ${editingCompany.name} - alterada`)
        }
        catch(e) {
            message.error('empresa não alterada')
            console.error(e)
        }
        finally {
            hideModalHandler()
            setOpLoading(false)
        }
    }

    const addCompanyHandler = async(formValues) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.post(`/companies`, { name:formValues.companyName })
            const updatedCompanies = [...companies]
            updatedCompanies.push(res.data)
            setCompanies(updatedCompanies)
            message.success(`empresa - ${formValues.companyName} - cadastrada`)
        }
        catch(e) {
            message.error('empresa não cadastrada')
            console.error(e)
        }
        finally {
            hideAddModalHandler()
            setOpLoading(false)
        }
    }

    const deleteCompanyHandler = async(id) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.delete(`/companies/${id}`)
            const filteredCompanies = companies.filter(company=>company.id!=id)
            setCompanies(filteredCompanies)
            message.success(`empresa excluída`)
            
        }
        catch(e) {
            message.error('empresa não excluída')
            console.error(e)
        }
        finally {
            setOpLoading(false)
            hidePopHandler()
        }
    }

    let companyEls = (
        <CompanySkeleton showSkeleton={loadingCompanies} />
    )

    if (companies && companies.length>0){
        let companiesToView = companies
        if (props.filter){
            const searchParam = RegExp(String.raw`${props.filter}`, "i")
            companiesToView = companies.filter(company => company.name.match(searchParam))
        }
        companyEls = companiesToView.map(company => {
            return (
                //24 sections are antd default values, only applies if there are enough elements
                <Col key={'company-'+company.id} 
                    xs={(companiesToView.length>=1)?{span:24/1}:null}
                    sm={(companiesToView.length>=2)?{span:24/2}:null}
                    md={(companiesToView.length>=3)?{span:24/3}:null}
                    lg={(companiesToView.length>=4)?{span:24/4}:null}>

                    <Company
                        {...props}
                        company_id={company.id}
                        company_name={company.name}
                        isVisible={checkPopHandler(company.id)}
                        deleted={deleteCompanyHandler}
                        canceled={hidePopHandler}
                        showPop={showPopHandler}
                        opLoading={opLoading}
                        showSkeleton={loadingCompanies}
                        showChangeModal={showModalHandler}
                        setCompany2Dash={props.setCompany2Dash}
                    />
                </Col>
            )
        })
    }

    return (
        <Space direction='vertical' style={{width:"100%", height:"100%"}} >

            <button className={classes.AddButton}
                onClick={()=>{showAddModalHandler()}}>
                    <PlusOutlined /> Empresa
            </button>
            
            <div className={classes.Background} onClick={()=>{backgroundClickedHandler()}}></div>

            <Modal
                visible={changeModalVisibility}
                title={`Alterar Dados: ${editingCompany.name}`}
                confirmLoading={opLoading}
                onCancel={()=>{hideModalHandler()}}
                footer={null}>
                    {editingCompany.name?
                        <CompanyEditForm 
                            reference={editForm}
                            onFinish={(vals)=>{alterCompanyHandler(vals)}}
                            opLoading={opLoading}
                        />:null
                    }
            </Modal>

            <Modal
                visible={addModalVisibility}
                title="Cadastrar Empresa"
                confirmLoading={opLoading}
                onCancel={()=>{hideAddModalHandler()}}
                footer={null}>
                    <CompanyAddForm
                        onFinish={(vals=>{addCompanyHandler(vals)})}
                        opLoading={opLoading}
                    />
            </Modal>


            {!companies || (companies && companies.length>0)?
                <div className={classes.GridContainer}>
                    <Row gutter={[16, 8]} style={{width:'100%'}}>
                        {companyEls}
                    </Row>
                </div>:null
            }

            {companies && companies.length==0?
                <Alert 
                    type='warning'
                    message='Não constam empresas'
                    style={{textAlign:'center'}}
                />:null
            }        

        </Space>
    );
};

export default Companies;
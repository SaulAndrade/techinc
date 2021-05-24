import React, {useState, useEffect, useRef} from 'react'
import { Redirect } from 'react-router-dom'
import { List, Skeleton, message, Space, Button, Alert, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import User, {UserEditForm, UserAddForm} from './User/User'
import { axiosInstance } from '../../App'

import classes from './Users.module.css'

const Users = (props) => {
    const editForm = useRef(null)

    const [users, setUsers] = useState(null)
    const [units, setUnits] = useState(null)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [loadingUnits, setLoadingUnits] = useState(false)
    const [opLoading, setOpLoading] = useState(false)
    const [popConfirmVisibility, setPopConfirmVisibility] = useState({id:null})
    const [editModalVisibility, setEditModalVisibility] = useState(false)
    const [addModalVisibility, setAddModalVisibility] = useState(false)
    const [editingUser, setEditingUser] = useState({id: null, name: null, email:null, unitId:null})

    useEffect(()=>{
        if (props.company && props.company.id!==null){
            getUsers(props.company.id)
            getUnits(props.company.id)
        }

    }, [props.company])

    useEffect(()=>{
        if (editingUser.id !== null){
            editForm.current.setFieldsValue({
                username:editingUser.name, 
                email:editingUser.email, 
                unit:editingUser.unitId
            })
        }
    }, [editingUser])

    const showPopConfirmHandler = (userId) => {
        setPopConfirmVisibility({id:userId})
    }

    const cancelPopConfirmHandler = () => {
        setPopConfirmVisibility({id:null})
    }

    const showEditModalHandler = (userId, userName, userMail, userUnitId) => {
        cancelPopConfirmHandler()
        setEditingUser({id:userId, name:userName, email:userMail, unitId:userUnitId})
        setEditModalVisibility(true)
        
    }

    const hideEditModalHandler = () => {
        setEditModalVisibility(false)
        setEditingUser({id: null, name: null, email:null, unitId:null})
    }

    const showAddModalhandler = () => {
        cancelPopConfirmHandler()
        setAddModalVisibility(true)
    }

    const hideAddModalHandler = () => {
        setAddModalVisibility(false)
    }

    const getUsers = async(companyId) => {
        setLoadingUsers(true)
        try {
            const res = await axiosInstance.get('/users')
            const filteredUsers = res.data.filter(usr=>usr.companyId==companyId)
            setUsers(filteredUsers)
        }
        catch(e) {
            setUsers([])
            message.error('não foi possível se comunicar com o servidor')
            console.error(e)
        }
        finally {
            setLoadingUsers(false)
        } 
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

    const deleteUserHandler = async(userId, userName) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.delete(`/users/${userId}`)
            const filteredUsers = users.filter(user=>user.id!=userId)
            setUsers(filteredUsers)
            message.success(`usuário - ${userName} - excluído`)
            
        }
        catch(e) {
            message.error('usuário não excluído')
            console.error(e)
        }
        finally {
            setOpLoading(false)
            setPopConfirmVisibility({id:null})
        }

    }

    const editUserHandler = async(formValues) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.patch(`/users/${editingUser.id}`, 
                {
                    name:formValues.username, 
                    email:formValues.email, 
                    unitId:formValues.unit})
           
            const updatedUsers = users.map(user=>{
                if (user.id!=editingUser.id){
                    return user
                }
                else {
                    return res.data
                }
            })
            
            setUsers(updatedUsers)
            message.success(`usuário - ${editingUser.name} - alterado`)
        }
        catch(e) {
            message.error('usuário não alterado')
            console.error(e)
        }
        finally {
            hideEditModalHandler()
            setOpLoading(false)
        } 
    }

    const addUserHandler = async(formValues) => {
        setOpLoading(true)
        try {
            const res = await axiosInstance.post(`/users`, {
                name:formValues.username, 
                email:formValues.email, 
                unitId:formValues.unit,
                companyId: props.company.id,
            })

            const updatedUsers = [...users]
            updatedUsers.push(res.data)
            setUsers(updatedUsers)
            message.success(`usuário - ${formValues.username} - cadastrado`)
        }
        catch(e) {
            message.error('usuário não criado')
            console.error(e)
        }
        finally {
            hideAddModalHandler()
            setOpLoading(false)
        }
    }

    const backgroudClickHandler = () => {
        cancelPopConfirmHandler()
    }

    //Will redirect to the company selection page
    if (props.company.id===null){
        return <Redirect to='/' />
    }

    let usersToView = users
    if (props.filter){
        const searchParam = RegExp(String.raw`${props.filter}`, "i")
        usersToView = users.filter(user => user.name.match(searchParam))
    }
  
    const userList = (
        <List
            itemLayout="horizontal"
            size="large"
            pagination={
            {
                onChange: page => {
                    console.log(page);
                },
                pageSize: 10,
            }}
            dataSource={usersToView}
            renderItem={item => (
                <User 
                    id={item.id}
                    unitId={item.unitId}
                    units={units || []} 
                    name={item.name} 
                    email={item.email}
                    popConfirmVisibility = {popConfirmVisibility} 
                    showEditModal={showEditModalHandler}
                    deleteUser={deleteUserHandler}
                    showPopConfirm={showPopConfirmHandler}
                    cancelPopConfirm = {cancelPopConfirmHandler}
                    opLoading={opLoading}
                />
            )}
            
        />
    )

    let content = (
        <List>
            <Skeleton loading={loadingUsers || loadingUnits} avatar active />
        </List>
    )

    if (users) {
        content = (
            <React.Fragment>      
                <Space direction='vertical' style={{width:"100%"}}>            
                    <Modal 
                        visible={editModalVisibility}
                        title={`Alterar Dados: ${editingUser.name}`}
                        onCancel={()=>{hideEditModalHandler()}}
                        footer={null
                    }>
                            {editingUser.name && units?
                                <UserEditForm
                                    reference={editForm} 
                                    units={units || []} 
                                    editingUser={editingUser}
                                    onFinish={(vals)=>{editUserHandler(vals)}}
                                    opLoading={opLoading}
                                />:null}
                    </Modal>

                    <Modal 
                        visible={addModalVisibility}
                        title={`Cadastrar usuário:`}
                        onCancel={()=>{hideAddModalHandler()}}
                        footer={null
                    }>
                        <UserAddForm 
                            units={units || []} 
                            onFinish={(vals)=>{addUserHandler(vals)}}
                            opLoading={opLoading}
                        />
                    </Modal>

                    <button className={classes.AddButton} onClick={()=>{showAddModalhandler()}}>
                        <PlusOutlined /> Usuário
                    </button>

                    {users.length>0? userList : <Alert 
                                                type='warning' 
                                                message='Usuários não localizados' 
                                                style={{textAlign:'center'}}
                                                />
                    }
                </Space>
                <div className={classes.Background} onClick={()=>{backgroudClickHandler()}}></div>
            </React.Fragment>
        )
    }

    return (
        content
    )
}

export default Users
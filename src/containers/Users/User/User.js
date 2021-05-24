import React from 'react';
import { List, Space, Avatar, Popconfirm, Form, Input, Button, Select } from 'antd'
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import userAvatar from '../../../assets/images/user_avatar.png'

const { Option } = Select

const User = (props) => {
    const userUnit = props.units.filter(unit=>unit.id==props.unitId)
    const unitName = userUnit.length?userUnit[0].name:'não alocado'
    return (
        <List.Item
            actions={[
                <a key="list-edit" onClick={()=>{
                    props.showEditModal(props.id, props.name, props.email, props.unitId)}}>
                    <Space>
                        <EditOutlined />
                        edit
                    </Space>
                </a>,

                <Popconfirm 
                    title={`Excluir ${props.name}`}
                    visible={props.popConfirmVisibility.id==props.id} 
                    icon={ <QuestionCircleOutlined style={{ color: 'red' }} /> }
                    onConfirm={()=>{props.deleteUser(props.id, props.name)}}
                    onCancel={()=>{props.cancelPopConfirm()}}
                    okButtonProps={{loading:props.opLoading}}>
                    <a key="list-delete" onClick={()=>{props.showPopConfirm(props.id)}}>
                        <Space>
                            <DeleteOutlined />
                            delete
                        </Space>
                    </a>
                </Popconfirm>
            ]}>

                <List.Item.Meta
                    avatar={
                    <Avatar src={userAvatar} />
                    }
                    title={props.name}
                    description={props.email}
                />

                <p>{unitName}</p>

        </List.Item>
    );
};

export const UserEditForm = (props) => {
    const [form] = Form.useForm()

    const onClean = () => {
        form.resetFields()
    }

    return (
        <Form
            ref={props.reference}
            form={form}
            name={`edit-user-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}
            onFinishFailed={()=>{console.log('finish failed')}}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Por favor, insira o nome de usuário' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{ required: true, message: 'Por favor, insira o email de usuário' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="unit" label="Unidade" rules={[{ required: true, message: 'Por favor, selecione uma Unidade' }]}>
                    <Select
                        placeholder="Selecione a unidade desejada"
                    >
                        {props.units.map(unit=><Option value={unit.id} key={`unit-opt-${unit.name}`}>{unit.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={ {offset: 8, span: 16} }>
                    <Button type="primary" htmlType="submit" loading={props.opLoading}>
                        alterar
                    </Button>

                    <Button type="ghost" onClick={onClean}>
                        limpar
                    </Button>
                </Form.Item>

        </Form>
    )
}

export const UserAddForm = (props) => {
    return (
        <Form
            name={`add-user-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Por favor, insira o nome de usuário' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{ required: true, message: 'Por favor, insira o email de usuário' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="unit" label="Unidade" rules={[{ required: true, message: 'Por favor, selecione uma Unidade' }]}>
                    <Select
                        placeholder="Selecione a unidade desejada"
                    >
                        {props.units.map(unit=><Option value={unit.id} key={`unit-opt-${unit.name}`}>{unit.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={ {offset: 8, span: 16} }>
                    <Button type="primary" htmlType="submit" loading={props.opLoading}>
                        cadastrar
                    </Button>
                </Form.Item>

        </Form>
    )
}


export default User;
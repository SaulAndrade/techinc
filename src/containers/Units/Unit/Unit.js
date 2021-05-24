import React from 'react';
import { Form, Input, Button, Card, Avatar, Skeleton, Popconfirm} from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import unitAvatar from '../../../assets/images/company_avatar.png'

const { Meta } = Card

const Unit = (props) => {
    return (
        <Card 
            hoverable
            bodyStyle={{background: 'linear-gradient(to bottom right, #CCDEE2, white)', borderRadius:'20px'}}
            style={{ 
                width: '100%',
                background: 'linear-gradient(to bottom right, #CCDEE2, white)',
                borderRadius:'20px', 
                maxWidth:'350px', 
                marginTop: 16
            }}
            actions={[
                <EditOutlined key="edit" onClick={()=>{
                    props.showEditModal(props.unit)
                }} />,

                <Popconfirm title={`Delete ${props.unit.name}`}
                            visible={props.popConfirmVisibility.id==props.unit.id} 
                            icon={ <QuestionCircleOutlined style={{ color: 'red' }} /> }
                            onConfirm={()=>{props.deleteUnit(props.unit.id, props.unit.name)}}
                            onCancel={()=>{props.cancelPopConfirm()}}
                            okButtonProps={{loading:props.opLoading}}>
                    <DeleteOutlined key="delete" onClick={()=>{ props.showPopConfirm(props.unit.id)}} />
                </Popconfirm>
            ]}>

            <Skeleton loading={false} avatar active>
                <Meta
                    avatar={
                        <Avatar src={unitAvatar} />
                    }
                    title={props.unit.name}
                    description="This is a fake Unit"/>
            </Skeleton>

        </Card>
    )
}

export const UnitEditForm = (props) => {
    const [form] = Form.useForm()

    const onClean = () => {
        form.resetFields()
    }

    return (
        <Form 
            ref={props.reference}
            form={form}
            name={`edit-unit-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}
            onFinishFailed={()=>{console.log('finish failed')}}>
                <Form.Item
                    label="Nome da Unidade"
                    name="unitName"
                    rules={[{ required: true, message: 'Por favor, insira o nome da unidade' }]}
                >
                    <Input />
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

export const UnitAddForm = (props) => {
    return (
        <Form
            name={`add-unit-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}>
                <Form.Item
                    label="Nome da Unidade"
                    name="unitName"
                    rules={[{ required: true, message: 'Por favor, insira o nome da unidade' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={ {offset: 8, span: 16} }>
                    <Button type="primary" htmlType="submit" loading={props.opLoading}>
                        cadastrar
                    </Button>
                </Form.Item>
        </Form>
    )
}

export default Unit;
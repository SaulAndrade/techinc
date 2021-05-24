import React from 'react';
import { Skeleton, Card, Avatar, Popconfirm, Form, Input, Button } from 'antd';
import { EditOutlined, SettingOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import companyAvatar from '../../../assets/images/company_avatar.png'
import { DASHBOARD_URL } from '../../../App'

const { Meta } = Card;

const Company = (props) => {
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
                <SettingOutlined key="setting" onClick={()=>{
                    props.setCompany2Dash({id:props.company_id, name:props.company_name})
                    props.history.push(DASHBOARD_URL)
                }} 
                />,

                <EditOutlined key="edit" onClick={()=>{
                    props.showChangeModal(props.company_id, props.company_name)
                }} />,

                <Popconfirm title={`Delete ${props.company_name}`}
                            visible={props.isVisible} 
                            icon={ <QuestionCircleOutlined style={{ color: 'red' }} /> }
                            onConfirm={()=>{props.deleted(props.company_id)}}
                            onCancel={()=>{props.canceled()}}
                            okButtonProps={{loading:props.opLoading}}>
                    <DeleteOutlined key="delete" onClick={()=>{props.showPop(props.company_id)}} />
                </Popconfirm>
        ]}>

        <Skeleton loading={props.showSkeleton} avatar active>
            <Meta
                avatar={
                    <Avatar src={companyAvatar} />
                }
                title={props.company_name}
                description="This is a fake Company"/>
        </Skeleton>
    </Card>
    );
};

export const CompanySkeleton = (props) => {
    return (
        <Card
            style={{ width: '300px', marginTop: 16}}
            actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" />,
            ]}
            >
            <Skeleton loading={props.showSkeleton} avatar active />
        </Card>
    )
}

export const CompanyEditForm = (props) => {
    const [form] = Form.useForm()

    const onClean = () => {
        form.resetFields()
    }

    return (
        <Form 
            ref={props.reference}
            form={form}
            name={`edit-company-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}
            onFinishFailed={()=>{console.log('finish failed')}}>
                <Form.Item
                    label="Nome da Empresa"
                    name="companyName"
                    rules={[{ required: true, message: 'Por favor, insira o nome da empresa' }]}
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

export const CompanyAddForm = (props) => {
    return (
        <Form
            name={`add-company-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}>
                <Form.Item
                    label="Nome da Empresa"
                    name="companyName"
                    rules={[{ required: true, message: 'Por favor, insira o nome da empresa' }]}>
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

export default Company;
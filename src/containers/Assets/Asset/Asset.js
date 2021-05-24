import React from 'react'
import { Card, Space, Progress, Tooltip, Popconfirm, Form, Input, Button, Select } from 'antd'
import { EditOutlined, DeleteOutlined, HistoryOutlined, FastForwardOutlined, 
         RocketFilled, HeartFilled, FireOutlined, SyncOutlined, ThunderboltOutlined, 
         CloudUploadOutlined, RobotFilled, SwapOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import classes from './Asset.module.css';

const { Meta } = Card
const { Option } = Select

const number_formatter = (numberString, fixed=2, separator=',', int=false) => {
    if (int){
        return parseInt(numberString).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }

    return parseFloat(numberString).toFixed(fixed).replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

const Asset = (props) => {
    const unit = props.units.filter(unit=>unit.id==props.asset.unitId)
    const unitName = unit.length?unit[0].name:'não alocado'

    let badgeStatusClass = classes.Badge_undef
    let badgeText = 'undef'
    switch (props.asset.status){
        case 'inOperation':
            badgeStatusClass = classes.Badge_inOp
            badgeText='operando'
        break

        case 'inAlert':
            badgeStatusClass = classes.Badge_inAl
            badgeText='alerta'
        break

        case 'inDowntime':
            badgeStatusClass = classes.Badge_inDt
            badgeText='parada'
        break

    }
    const badgeClasses = [classes.Badge, badgeStatusClass].join(' ')

    const specs = props.asset.specifications
    const maxTemp = specs&&specs.maxTemp?number_formatter(specs.maxTemp, 1):null
    const power = specs&&specs.power?number_formatter(specs.power, 1):null
    const rpm = specs&&specs.rpm?number_formatter(specs.rpm, 1):null
    const hasSpecs = maxTemp || power || rpm
 

    const metrics = props.asset.metrics
    const nCollects = metrics&&metrics.totalCollectsUptime?number_formatter(metrics.totalCollectsUptime,2,',',true):null
    const totalTime = metrics&&metrics.totalUptime?number_formatter(metrics.totalUptime):null
    const hasMetrics = nCollects || totalTime

    const lastUpdated = metrics&&metrics.lastUptimeAt?new Date(metrics.lastUptimeAt):null
    const lastUpdatedFormatted = lastUpdated? lastUpdated.toLocaleString():'indisponível'

    const sensors = props.asset.sensors
    const hasSensors = sensors&&sensors.length>0

    return (
        <div className={classes.CardContainer}>
            
            <Card
                hoverable
                style={{ width: '350px' }}
                cover={<img height='350px' alt="example" src={props.asset.image} />}
                actions={[ 
                    <Tooltip title='sync' key='sync' mouseEnterDelay={1}>
                        <SyncOutlined onClick={()=>{props.getAssets(props.company.id)}}/>
                    </Tooltip>,

                    <Tooltip title='editar' key='edit' mouseEnterDelay={1}>
                        <EditOutlined onClick={()=>{props.showEditModal(props.asset)}}/>
                    </Tooltip>,
                    
                    <Tooltip title='realocar' key='swap' mouseEnterDelay={1}>
                        <SwapOutlined onClick={()=>{props.showSwapModal(props.asset)}}/>
                    </Tooltip>,
                    
                    <Popconfirm 
                        title={`Delete ${props.asset.name}`}
                        visible={props.popConfirmVisibility.id==props.asset.id} 
                        icon={ <QuestionCircleOutlined style={{ color: 'red' }} /> }
                        onConfirm={()=>{props.deleteAsset(props.asset.id, props.asset.name)}}
                        onCancel={()=>{props.cancelPopConfirm()}}
                        okButtonProps={{loading:props.opLoading}}>
                            <Tooltip title='excluir' key='del' mouseEnterDelay={1}>
                                <DeleteOutlined onClick={()=>{props.showPopConfirm(props.asset.id)}}/>
                            </Tooltip>
                    </Popconfirm>
                ]}
            >

                <Meta title={`${props.asset.model.toUpperCase()} ( ${unitName} )`} description={props.asset.name} />

                <div className={badgeClasses}>{badgeText}</div>

                <Space direction='vertical'>
   
                    <div className={classes.CardInfoBlock}>
                        <div><HeartFilled /> Saúde:</div>   
                        <Progress
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={parseFloat(props.asset.healthscore)}
                        />
                    </div>

                   
                    <div className={classes.CardInfoBlock}>
                        <div><RocketFilled /> Specs:</div>
                        {hasSpecs ?
                            <ol className={classes.SpecsList}>
                                <li><FireOutlined /> Temp Máx.:  <b>{maxTemp?`${maxTemp} ºC`:'não informado'}</b></li>
                                <li><ThunderboltOutlined />Potência: <b>{power?`${power} kWh`:'não informado'}</b></li>
                                <li><FastForwardOutlined />Frequência: <b>{rpm?`${rpm} rpm`:'não informado'}</b></li>
                            </ol>
                            :'Sem especificações disponíveis'
                        }
                    </div>

                  
                    <div className={classes.CardInfoBlock}>
                        <div><CloudUploadOutlined /> metrics:</div>
                        {hasMetrics ?
                            <ol className={classes.SpecsList}>
                                <li>Total de Coletas: <b>{nCollects}</b></li>
                                <li>Tempo Total Coletado: <b>{totalTime} h</b></li>
                            </ol>
                            :'Sem métricas disponíveis'
                        }'
                    </div>

                    <div className={classes.CardInfoBlock}>
                        <div><RobotFilled /> sensores:</div>
                        {hasSensors ?
                            sensors.map(sensor=><u style={{marginLeft:'8px'}}>{sensor}</u>)
                            :'Sem sensores cadastrados'
                        }
                    </div>

                    <div className={classes.CardInfoBlock}>
                        <div className={classes.LastUpdatedContainer}>
                            <HistoryOutlined /> <b>{lastUpdatedFormatted}</b>
                        </div>
                    </div>
                </Space>

            </Card>
        </div>
    );
};

export const AssetAddForm = (props) => {
    return (
        <Form
            name={`add-asset-form`}
            labelCol= { {span: 12 }}
            wrapperCol= { {span: 24} }
            onFinish={(values)=>{props.onFinish(values)}}>
                <Form.Item
                    label="Modelo"
                    name="assetModel"
                    rules={[{ required: true, message: 'Por favor, insira o modelo do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Nome"
                    name="assetName"
                    rules={[{ required: true, message: 'Por favor, insira o nome do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Foto"
                    name="assetImgUrl"
                    rules={[{ required: true, message: 'Por favor, insira a URL da imagem' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Temperatura Máxima (ºC)"
                    name="assetMaxTemp"
                    rules={[{ required: true, message: 'Por favor, insira a especificação do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Potência (kWh)"
                    name="assetPower"
                    rules={[{ required: true, message: 'Por favor, insira a especificação do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Frequência de Operação (rpm)"
                    name="assetFreq"
                    rules={[{ required: true, message: 'Por favor, insira a especificação do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Sensores"
                    name="assetSensors"
                    rules={[{ 
                        required: true, 
                        message: 'Por favor, insira os sensores separados por ,', 
                        pattern:/^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/ }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item labelCol={{span:8}} name="assetUnitId" label="Unidade" rules={[{ required: true, message: 'Por favor, selecione uma Unidade' }]}>
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

export const AssetEditForm = (props) => {
    const [form] = Form.useForm()

    const onClean = () => {
        form.resetFields()
    }

    return (
        <Form
            ref={props.reference}
            name={`edit-asset-form`}
            form={form}
            labelCol= { {span: 12 }}
            wrapperCol= { {span: 24} }
            onFinish={(values)=>{props.onFinish(values)}}>
                <Form.Item
                    label="Modelo"
                    name="assetModel"
                    rules={[{ required: true, message: 'Por favor, insira o modelo do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Nome"
                    name="assetName"
                    rules={[{ required: true, message: 'Por favor, insira o nome do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Foto"
                    name="assetImgUrl"
                    rules={[{ required: true, message: 'Por favor, insira a URL da imagem' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Temperatura Máxima (ºC)"
                    name="assetMaxTemp"
                    rules={[{ required: true, message: 'Por favor, insira a especificação do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Potência (kWh)"
                    name="assetPower"
                    rules={[{ required: true, message: 'Por favor, insira a especificação do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Frequência de Operação (rpm)"
                    name="assetFreq"
                    rules={[{ required: true, message: 'Por favor, insira a especificação do recurso' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Sensores"
                    name="assetSensors"
                    rules={[{ 
                        required: true, 
                        message: 'Por favor, insira os sensores separados por ,', 
                        pattern:/^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/ }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item labelCol={{span:8}} name="assetUnitId" label="Unidade" rules={[{ required: true, message: 'Por favor, selecione uma Unidade' }]}>
                    <Select
                        placeholder="Selecione a unidade desejada"
                    >
                        {props.units.map(unit=><Option value={unit.id} key={`unit-opt-${unit.name}`}>{unit.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={ {offset: 8, span: 16} }>
                    <Button type="primary" htmlType="submit" loading={props.opLoading}>
                        Editar
                    </Button>

                    <Button type="ghost" onClick={onClean}>
                        limpar
                    </Button>
                </Form.Item>
        </Form>
    )
}

export const AssetSwapForm = (props) => {
    return (
        <Form
            ref={props.reference}
            name={`swap-asset-form`}
            labelCol= { {span: 8 }}
            wrapperCol= { {span: 16} }
            onFinish={(values)=>{props.onFinish(values)}}>
                
                <Form.Item labelCol={{span:8}} name="assetUnitId" label="Unidade" rules={[{ required: true, message: 'Por favor, selecione uma Unidade' }]}>
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
                </Form.Item>
        </Form>
    )
}

export default Asset
import { invoke } from "@tauri-apps/api";
import { Row, Space, Col, InputNumber, Input, Button, Typography, Select } from "antd";
import { useState } from "react";

const { Title, Paragraph } = Typography;

const Socket = () => {
    const [server, setServer] = useState<string>('');
    const [client, setClient] = useState<string>('');
    const [serverMessage, setServerMessage] = useState<string>('');
    const [clientMessage, setClientMessage] = useState<string>('');
    const [serverContent, setServerContent] = useState<string>('');
    const [clientContent, setClientContent] = useState<string>('');
    const [algorithm, setAlgorithm] = useState<string>('AES');

    const options = [{
        value: 'AES',
        label: 'AES',
    },
    {
        value: 'DES',
        label: 'DES',
    },
    {
        value: 'RSA',
        label: 'RSA',
    },
    {
        value: 'SHA1',
        label: 'SHA1',
    },
    {
        value: 'SHA256',
        label: 'SHA256',
    }]


    const runServer = async () => {
        await invoke("run_server", { host: server })
    }

    const runClient = async () => {
        await invoke("run_server", { host: client })
    }

    const handleServer = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServer(e.target.value);
    }

    const handleClient = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClient(e.target.value);
    }

    const handleServerMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServerMessage(e.target.value);
    }

    const handleClientMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientMessage(e.target.value);
    }

    const sendServer = async () => {
        setServerContent(serverContent + algorithm + ':' + serverMessage + '\r\n');
    }

    const sendClient = async () => {
        setClientContent(clientContent + algorithm + ':' + clientMessage + '\r\n');
    }

    const clear = () => {
        setClientContent('');
        setServerContent('');
    }

    return <div >
        <Space direction="vertical" style={{ width: '600px' }}>
            <Row>
                <Col span={3}>
                    服务端：
                </Col>
                <Col span={15}>
                    <Input value={server} onChange={handleServer}></Input>
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={runServer}>运行服务端</Button>
                </Col>
            </Row>
            <Row>
                <Col span={3}>
                    客户端：
                </Col>
                <Col span={15}>
                    <Input value={client} onChange={handleClient}></Input>
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={runClient}>运行客户端</Button>
                </Col>
            </Row>
            <Row>
                <Col span={15} offset={3}>
                    <Input value={serverMessage} onChange={handleServerMessage} />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={sendServer}>发送到服务端</Button>
                </Col>
            </Row>
            <Row>
                <Col span={15} offset={3}>
                    <Input value={clientMessage} onChange={handleClientMessage} />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={sendClient}>发送到客户端</Button>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Select onChange={setAlgorithm} value={algorithm} style={{ width: '70%' }} options={options}></Select>
                    <Button type="primary" onClick={clear}>清空</Button>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Title level={3}>Server</Title>
                    {serverContent && <Paragraph><pre>{serverContent}</pre></Paragraph>}
                </Col>
                <Col span={12}>
                    <Title level={3}>Client</Title>
                    {clientContent && <Paragraph><pre>{clientContent}</pre></Paragraph>}
                </Col>
            </Row>
        </Space>
    </div>
}

export default Socket;
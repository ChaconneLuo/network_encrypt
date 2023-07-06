import { invoke } from "@tauri-apps/api";
import { Row, Space, Col, InputNumber, Input, Button, Typography } from "antd";
import { useState } from "react";

const { Title, Paragraph } = Typography;

const Socket = () => {
    const [server, setServer] = useState<string>('');
    const [client, setClient] = useState<string>('');

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

    return <>
        <Row gutter={16}>
            <Space direction="vertical" style={{ width: '600px' }}>
                <Col span={24}>
                    服务端：<Input value={server} onChange={handleServer}></Input><br />
                </Col>
                <Col span={24}>
                    客户端：<Input value={client} onChange={handleClient}></Input>
                </Col>
                <Col span={24}>
                    <Button onClick={runServer}>运行服务端</Button>
                    <Button onClick={runClient}>运行客户端</Button>
                </Col>
                <Col span={12}>
                    <Title level={3}>Server</Title>
                    <Paragraph><pre></pre></Paragraph>
                </Col>
                <Col span={12}>
                    <Title level={3}>Client</Title>
                    <Paragraph><pre></pre></Paragraph>
                </Col>
            </Space>
        </Row ></>
}

export default Socket;
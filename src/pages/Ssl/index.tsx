import { invoke } from "@tauri-apps/api/tauri";
import { Row, Space, Col, InputNumber, Button, Typography, Input } from "antd";
import { useState } from "react";

const { Title, Paragraph } = Typography;

const Ssl = () => {
    const [pem, setPem] = useState<string>('');
    const [bits, setBits] = useState<number>(1024);
    const [host, setHost] = useState<string>('localhost');
    const [organization, setOrganization] = useState<string>('Chaconne');
    const [serial, setSerial] = useState<number>(1);
    const [days, setDays] = useState<number>(365);

    async function generate_pem() {
        const res = await invoke<string>("generate_509", { bits, host, organization, serial, days });
        setPem(res);
    }
    const clear = () => {
        setPem('');
    }
    const handleBits = (value: number | null) => {
        if (!value) {
            value = 1024;
        }
        setBits(value);
    }
    const handleSerial = (value: number | null) => {
        if (!value) {
            value = 1;
        }
        setSerial(value);
    }

    const handleDays = (value: number | null) => {
        if (!value) {
            value = 1;
        }
        setDays(value);
    }

    const handleHost = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHost(e.target.value);
    }

    const handleOrganization = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrganization(e.target.value);
    }

    return <>
        <Row gutter={16}>
            <Space direction="vertical" style={{ width: '600px' }}>
                <Col span={24}>
                    长度：<InputNumber value={bits} onChange={handleBits} min={1024}></InputNumber>
                    序列号：<InputNumber value={serial} onChange={handleSerial} min={1}></InputNumber>
                    有效期：<InputNumber value={days} onChange={handleDays} min={1}></InputNumber>
                </Col>
                <Col span={24}>
                    主机名：<Input value={host} onChange={handleHost}></Input><br />
                </Col>
                <Col span={24}>
                    组织名：<Input value={organization} onChange={handleOrganization}></Input>
                </Col>
                <Col span={24}>
                    <Button onClick={generate_pem}>生成SSL证书</Button>
                    <Button onClick={clear}>清空</Button>
                </Col>
                <Col span={24}>
                    <Title level={3}>证书</Title>
                    {pem && <Paragraph ><pre>{pem}</pre></Paragraph>}
                </Col>
            </Space>
        </Row ></>
}
export default Ssl;
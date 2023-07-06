import { invoke } from "@tauri-apps/api/tauri"
import { Row, Col, Button, InputNumber, Typography, Space } from "antd";
import { useState } from "react";

const { Paragraph, Title } = Typography;

const Rsa = () => {
    const [key, setKey] = useState<string[]>([]);
    const [bits, setBits] = useState<number>(2048);

    const clear = () => {
        setKey([]);
    }

    const handleBits = (value: number | null) => {
        if (!value) {
            value = 1024;
        }
        setBits(value);
    }

    async function generate_key() {
        const res = await invoke<[string, string, string, string, string, string]>("generate_key", { bits });
        setKey(res);
    }

    return <>
        <Row gutter={16}>
            <Space direction="vertical" style={{ width: '600px' }}>
                <Col span={24}>
                    长度：<InputNumber value={bits} onChange={handleBits} min={1024}></InputNumber>
                    <Button onClick={generate_key}>生成rsa密钥</Button>
                    <Button onClick={clear}>清空</Button>
                </Col>
                <Col span={24}>
                    <Title level={3}>p</Title>
                    {key[0] && <Paragraph ><pre>{key[0]}</pre></Paragraph>}
                </Col>
                <Col span={24}>
                    <Title level={3}>q</Title>
                    {key[1] && <Paragraph ><pre>{key[1]}</pre></Paragraph>}
                </Col>
                <Col span={24}>
                    <Title level={3}>n</Title>
                    {key[2] && <Paragraph ><pre>{key[2]}</pre></Paragraph>}
                </Col>
                <Col span={24}>
                    <Title level={3}>e</Title>
                    {key[3] && <Paragraph ><pre>{key[3]}</pre></Paragraph>}
                </Col>
                <Col span={24}>
                    <Title level={3}>public</Title>
                    {key[4] && <Paragraph ><pre>{key[4]}</pre></Paragraph>}
                </Col>
                <Col span={24}>
                    <Title level={3}>private</Title>
                    {key[5] && <Paragraph ><pre>{key[5]}</pre></Paragraph>}
                </Col>
            </Space>
        </Row >
    </>
}

export default Rsa;
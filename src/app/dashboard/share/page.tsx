'use client';
import React, {useEffect} from "react";
import {
    Button,
    Card,
    Col,
    ConfigProvider,
    Flex,
    Form,
    Input, Popconfirm,
    Row,
    Space,
    Table,
    type TableColumnsType
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {AnyObject} from "antd/es/_util/type";
import {useSearchParams} from "next/navigation";

export default function Page() {
    const [queryForm] = Form.useForm();
    const [accountShareUsers,setAccountShareUsers] = React.useState([]);
    const searchParams = useSearchParams();
    const accountEmail = searchParams.get('accountEmail');

    const fetchData = (queryParam:any) => {
        axios.post('http://localhost:8080/api/accountShareUser/query',queryParam)
            .then(response => {
                const users = response.data.map((item: any) => ({
                    key:item.uniqueName,
                    ...item,

                }));
                setAccountShareUsers(users);
            })
    };

    const columns: TableColumnsType<AnyObject> = [
        { title: '账号', dataIndex: 'accountEmail', key: 'accountEmail' },
        { title: 'UniqueName', dataIndex: 'uniqueName', key: 'uniqueName' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '共享链接', dataIndex: 'shareLink', key: 'shareLink' },
        {title: '操作', key: 'operation', render: (_,record) => (
                <ConfigProvider autoInsertSpaceInButton={false}>
                    <Space.Compact block>
                        <Button icon={<EditOutlined/>}></Button>
                        <Popconfirm
                            placement="left"
                            title={"确定删除此共享用户？"}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button danger icon={<DeleteOutlined />}></Button>
                        </Popconfirm>
                    </Space.Compact>
                </ConfigProvider>
            )},
    ];

    const handleReset = () => {
        queryForm.resetFields();
    }
    const handleQuery = () => {
        queryForm
            .validateFields()
            .then(values=>{
                if(!values.email){

                }else {

                }
            })
    }

    useEffect(() => {
        fetchData({accountEmail:accountEmail});
    },[accountEmail]);

    return(
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Card bordered={false} style={{ width:'100%',height:80}}>
                    <Form form={queryForm}>
                        <Row gutter={[16,0]}>
                            <Col span={8}>
                                <Form.Item label="账号" name="email" initialValue={accountEmail}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="UniqueName" name="uniqueName">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Flex gap="small" justify="flex-end">
                                    <Button onClick={handleReset}>重置</Button>
                                    <Button type={"primary"} onClick={handleQuery}>查询</Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
            <Col span={24}>
                <Card bordered={false} style={{ width: '100%' }} title={"共享列表"}>
                    <Table scroll={{ x: '100%' }} columns={columns} dataSource={accountShareUsers}/>
                </Card>
            </Col>
        </Row>
    )
}
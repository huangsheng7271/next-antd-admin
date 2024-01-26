/*'use client';
import {
    Button,
    Divider,
    Form,
    Input,
    Modal,
    Table,
    Row,
    Col,
    Space,
    Tooltip,
    Popconfirm,
    ConfigProvider,
    Checkbox,
    message,
    Card,
    Flex, Badge
} from "antd";
import {LockOutlined, UserOutlined, CheckCircleTwoTone, InfoCircleTwoTone,QuestionCircleOutlined,PlusOutlined,ShareAltOutlined,EditOutlined,DeleteOutlined,ReloadOutlined,LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import type { TableColumnsType } from 'antd';
import axios from 'axios';
import qs from 'qs';
import { useRouter } from "next/navigation";
import * as process from "process";

interface DataType {
    key: React.Key;
    accountId: string;
    email: string;
    password: string;
    sessionToken: any;
    accessToken: any;
    updateRefreshTime: string;
    shareCount: number;
}

interface ExpandedDataType {
    key: React.Key;
    uniqueName: string;
    shareLink: string;
}

const { TextArea } = Input;
const ButtonGroup = Button.Group;

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [refreshLoadingMap, setRefreshLoadingMap] = useState<{ [key: string]: boolean }>({});
    const [accessToken, setAccessToken] = useState("");
    const [form] = Form.useForm();
    const [shareUserForm] = Form.useForm();
    const [queryForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();




    const fetchData = (queryParam:any) => {
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/account/query`,queryParam)
            .then(response => {
                const accounts = response.data.map((item: any) => ({
                    key:item.accountId,
                    loginStatus: item.sessionToken?.length > 0 && item.accessToken?.length > 0 ? <CheckCircleTwoTone twoToneColor="#14b974"/> : <InfoCircleTwoTone twoToneColor="#ff4d4f"/>,
                    ...item,

                }));
                setAccounts(accounts);
        })
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                setConfirmLoading(true);
                axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/account`, values)
                    .then(response => {
                        messageApi.open({
                            type: 'success',
                            content: '账号新增成功！',
                        });
                        form.resetFields();
                        setIsModalOpen(false);
                        setConfirmLoading(false);
                        fetchData({});

                    })
                    .catch(error => {
                        messageApi.open({
                            type: 'error',
                            content: error.message,
                        });
                    })
            })
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    const handleDelete = (key: React.Key) => {
        // 发送删除请求到后端
        axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/account/${key}`)
            .then(response => {
                // 如果删除成功，从前端数据中删除
                const newAccounts = accounts.filter((item: any) => item.key !== key);
                setAccounts(newAccounts);
                messageApi.open({
                    type: 'success',
                    content: '账号删除成功！',
                });
            })
            .catch(error => {
                messageApi.open({
                    type: 'error',
                    content: error.message,
                });
            });
    };

    const handleAddShare = (record: any, e: any) => {
        setIsShareModalOpen(true);
        setAccessToken(record.accessToken);
        shareUserForm.setFieldsValue({
            accountEmail: record.email,
        });

     }

    const handleShareOk = () => {
        shareUserForm
            .validateFields()
            .then(values => {
                //获取shareToken
                const {uniqueName} = values;
                const data = qs.stringify({
                    'unique_name': uniqueName,
                    'access_token': accessToken,
                    'site_limit': '',
                    'expires_in': '0',
                    'show_conversations': 'false',
                    'show_userinfo': 'false',
                });
                const config = {
                    method: 'post',
                    url: `${process.env.NEXT_PUBLIC_FAKEOPEN_BASE_URL}/token/register`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                };

                axios(config)
                    .then(function (response) {
                        const data={
                            accountEmail:values.accountEmail,
                            uniqueName:values.uniqueName,
                            remark:values.remark,
                            shareToken:response.data["token_key"],
                            expireAt:response.data["expire_at"]
                        }

                        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/accountShareUser`,data)
                            .then(response => {
                                messageApi.open({
                                    type: 'success',
                                    content: '共享用户新增成功！',
                                });
                                shareUserForm.resetFields();
                                setIsShareModalOpen(false)
                                fetchData({})
                            })
                            .catch(error=>{
                                messageApi.open({
                                    type: 'error',
                                    content: error.response.data,
                                });
                            })

                    })
                    .catch(function (error) {
                        messageApi.open({
                            type: 'error',
                            content: error.response.data.detail,
                        });
                    })
            })
    }

    const handleRefreshOk =(record:any) => {
        setRefreshLoadingMap(prevState => ({
            ...prevState,
            [record.key]: true,
        }));
        // 通过账号名和密码获取SessionToken和AccessToken
        const {email, password} = record;
        const data = qs.stringify({
            username: email,
            password: password,
        });
        axios.post(`${process.env.NEXT_PUBLIC_FAKEOPEN_BASE_URL}/auth/login`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then((response) => {
                // 更新SessionToken和AccessToken
                const data = {
                    sessionToken: response.data["session_token"],
                    accessToken: response.data["access_token"],
                };
                axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/account/${record.key}`, data)
                    .then((response) => {
                        messageApi.open({
                            type: 'success',
                            content: '账号刷新成功！',
                        });
                        fetchData({});
                    })
                    .catch((error) => {
                        messageApi.open({
                            type: 'error',
                            content: error.message
                        });
                    })
            })
            .catch((error) => {
                messageApi.open({
                    type: 'error',
                    content: error.response.data.detail
                });
            })
            .finally(() => {
                setRefreshLoadingMap(prevState => ({
                    ...prevState,
                    [record.key]: false,
                }));
            })
    }

    const handleQuery = () => {
        queryForm
            .validateFields()
            .then(values=>{
                if(!values.email){
                    fetchData({});
                }else {
                    fetchData(values);
                }
            })
    }
    const handleReset = () => {
        queryForm.resetFields();
        fetchData({});
    }

    useEffect(() => {
        fetchData({});
    },[]);

    const columns: TableColumnsType<DataType> = [
        { title: '账号', dataIndex: 'email', key: 'email' },
        { title: '密码', dataIndex: 'password', key: 'password' },
        { title: '登陆状态', dataIndex: 'loginStatus', key: 'loginStatus' },
        { title: '备注', dataIndex: 'remark', key: 'remark'},
        {title: '更新时间', dataIndex: 'updateRefreshTime', key: 'updateRefreshTime'},
        {
            title: '共享', dataIndex: 'share', render:(text,record)=>(
            <ConfigProvider autoInsertSpaceInButton={false}>
                <ButtonGroup>
                    <Badge count={record.shareCount} showZero style={{zIndex:10}} offset={[-5,0]}>
                        <Button onClick={()=>router.push(`/dashboard/share?accountEmail=${record.email}`)} icon={<ShareAltOutlined/>}>共享列表</Button>
                    </Badge>
                    <Button onClick={(e)=>handleAddShare(record,e)} icon={<PlusOutlined/>}></Button>
                </ButtonGroup>
            </ConfigProvider>
        )},
        {title: '操作', key: 'operation', render: (_,record) => (
            <ConfigProvider autoInsertSpaceInButton={false}>
                <Space.Compact block>
                    <Popconfirm
                        placement="left"
                        title={"确定刷新此账号？"}
                        description="登陆账号，刷新Token"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={()=>handleRefreshOk(record)}
                    >
                        <Button icon={refreshLoadingMap[record.key]?<LoadingOutlined/>:<ReloadOutlined/>}>刷新</Button>
                    </Popconfirm>
                    <Button icon={<EditOutlined/>}></Button>
                    <Popconfirm
                        placement="left"
                        title={"确定删除此账号？"}
                        okText="确定"
                        cancelText="取消"
                        onConfirm={()=>handleDelete(record.key)}
                    >
                        <Button danger icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                </Space.Compact>
            </ConfigProvider>
        )},
    ];

    return (
        <div>
            {contextHolder}
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Card bordered={false} style={{ width:'100%',height:80}}>
                        <Form form={queryForm}>
                            <Row gutter={[16,0]}>
                                <Col span={8}>
                                    <Form.Item label="账号" name="email">
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
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
                    <Card bordered={false} style={{ width: '100%' }} title={"账号列表"} extra={
                        <Flex gap="small" justify="flex-end">
                            <Button size={"middle"} type={"primary"} onClick={showModal}>新增账号</Button>
                        </Flex>}
                    >
                        <Table
                            scroll={{ x: '100%' }}
                            columns={columns}
                            dataSource={accounts}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={400} centered
                   title={"新增账号"} okText={"确定"} cancelText={"取消"}
                   confirmLoading={confirmLoading} maskClosable={false}>
                <Divider style={{marginTop: 16}}/>
                <Form form={form}>
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: '请输入 ChatGPT 账号'}]}
                    >
                        <Input
                            size={"large"}
                            prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="账号"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请输入 ChatGPT 密码'}]}
                    >
                        <Input.Password
                            size={"large"}
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item name="remark">
                        <TextArea size={"large"} placeholder="备注"/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal open={isShareModalOpen} onOk={handleShareOk} onCancel={()=>setIsShareModalOpen(false)} width={400} centered
                   title={"新增共享用户"} okText={"确定"} cancelText={"取消"}
                   confirmLoading={confirmLoading} maskClosable={false}>
                <Divider style={{marginTop: 16}}/>
                <Form form={shareUserForm}>
                    <Form.Item name="accountEmail" style={{display:"none"}}>
                        <Input size={"large"}/>
                    </Form.Item>
                    <Form.Item name="uniqueName"
                        rules={[{required: true, message: '请输入 UniqueName'}]}
                    >
                        <Input size={"large"} placeholder={"请输入 UniqueName"}/>
                    </Form.Item>
                    <Form.Item name="remark">
                        <Input size={"large"} placeholder="请输入备注"/>
                    </Form.Item>
                    <Form.Item>
                        <Card bodyStyle={{padding:12}}>
                            <Flex justify={"space-between"} align={"center"}>
                                <Checkbox checked>ShareLink</Checkbox>
                                <Tooltip title="根据此共享账号和UniqueName生成ShareLink">
                                    <QuestionCircleOutlined style={{fontSize:15,color:"#8c8c8c"}}/>
                                </Tooltip>
                            </Flex>
                        </Card>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}*/

'use client';
import accountService, {AccountAddReq} from "@/api/services/accountService";
import {Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography} from "antd";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Account, Share} from "@/../types/entity";
import {useAddAccountMutation, useDeleteAccountMutation, useUpdateAccountMutation} from "@/store/accountStore";
import {t} from "i18next";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined,} from "@ant-design/icons";
import {useQuery} from "@tanstack/react-query";
import AuthWrapper from "@/lib/AuthWrapper";

export default function Page() {
    const addAccountMutation = useAddAccountMutation();
    const updateAccountMutation = useUpdateAccountMutation();
    const deleteAccountMutation = useDeleteAccountMutation();

    const [deleteAccountId, setDeleteAccountId] = useState<number | undefined>(-1);

    const [AccountModalPros, setAccountModalProps] = useState<AccountModalProps>( {
        formValue: {
            email: '',
            password: '',
            comment: '',
            custom_type: 'refresh_token',
            custom_token: '',
        },
        title: 'New',
        show: false,
        onOk: (values: AccountAddReq, callback) => {
            if (values.id) {
                updateAccountMutation.mutate(values, {
                    onSuccess: () => {
                        setAccountModalProps((prev) => ({...prev, show: false}))
                    },
                    onSettled: () => callback(false)
                });
            } else {
                addAccountMutation.mutate(values, {
                    onSuccess: () => {
                        setAccountModalProps((prev) => ({...prev, show: false}))
                    },
                    onSettled: () => callback(false)
                });
            }
        },
        onCancel: () => {
            setAccountModalProps((prev) => ({...prev, show: false}));
        },
    });

    const columns: ColumnsType<Account> = [
        {title: t('token.email'), dataIndex: 'email', ellipsis: true, align: 'left',
            render: (text) => (
                <Typography.Text style={{maxWidth: 200}} ellipsis={true}>
                    {text}
                </Typography.Text>
            )
        },
        {title: t('token.password'), dataIndex: 'password', align: 'left',  ellipsis: true,
            render: (text) => (
                <Typography.Text style={{maxWidth: 200}} ellipsis={true}>
                    {text}
                </Typography.Text>
            )
        },
        {title: t('token.comment'), dataIndex: 'comment', align: 'left',  ellipsis: true,
            render: (text) => (
                <Typography.Text style={{whiteSpace:'pre-line'}} ellipsis={true}>
                    {text}
                </Typography.Text>
            )
        },
        {
            title: t('token.action'),
            key: 'operation',
            align: 'center',
            render: (_, record) => (
                <Button.Group>
                    <Button onClick={() => onEdit(record)} icon={<EditOutlined/>}/>
                    <Popconfirm title={t('common.deleteConfirm')} okText="Yes" cancelText="No" placement="left" onConfirm={() => {
                        setDeleteAccountId(record.id);
                        deleteAccountMutation.mutate(record.id,{
                            onSuccess: () => setDeleteAccountId(undefined)
                        })
                    }}>
                        <Button icon={<DeleteOutlined/>} loading={deleteAccountId === record.id} danger/>
                    </Popconfirm>
                </Button.Group>
            ),
        },
    ];

    const {data} = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.searchAccountList('', '')
    })

    const onCreate = () => {
        setAccountModalProps((prev) => ({
            ...prev,
            show: true,
            title: t('token.createNew'),
            formValue: {
                id: undefined,
                email: '',
                password: '',
                comment: '',
                custom_type: 'refresh_token',
                custom_token: '',
            }
        }));
    };

    const onEdit = (record: Account) => {
        setAccountModalProps((prev) => ({
            ...prev,
            show: true,
            title: t('token.edit'),
            formValue: {
                ...prev.formValue,
                id: record.id,
                email: record.email,
                password: record.password,
                comment: record.comment,
            }
        }));
    };

    return(
        <Space direction="vertical" size="large">
                <Card bordered={false}>
                    <Button type="primary" onClick={onCreate}>
                        {t("token.createNew")}
                    </Button>
                </Card>
                <Card bordered={false}>
                    <Table
                        rowKey="id"
                        scroll={{ x: 'max-content' }}
                        pagination={{ pageSize: 10 }}
                        columns={columns}
                        dataSource={data}
                    />
                </Card>
                <AccountModal {...AccountModalPros}/>
            </Space>
    );
}


type AccountModalProps = {
    formValue: AccountAddReq;
    title: string;
    show: boolean;
    onOk: (values: AccountAddReq,setLoading: any) => void;
    onCancel: VoidFunction;
};

function AccountModal({title, show, formValue, onOk, onCancel}: AccountModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation()

    useEffect(() => {
        form.setFieldsValue({...formValue});
    }, [formValue, form]);

    const onModalOk = () => {
        form.validateFields().then((values) => {
            setLoading(true)
            onOk(values, setLoading);
        });
    }

    return (
        <Modal title={title} open={show} onOk={onModalOk} onCancel={() => {
            onCancel();
        }} okButtonProps={{
            loading: loading,
        }} destroyOnClose={false}>
            <Form
                form={form}
                layout="vertical"
                preserve={false}
            >
                <Form.Item<AccountAddReq> name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item<AccountAddReq> label={t("token.email")} name="email">
                    <Input size={"large"}/>
                </Form.Item>
                <Form.Item<AccountAddReq> label={t("token.password")} name="password">
                    <Input.Password size={"large"}/>
                </Form.Item>
                <Form.Item<AccountAddReq> label={t("token.comment")} name="comment">
                    <Input.TextArea size={"large"}/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

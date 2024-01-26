"use client";

import {
    ShareAltOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {Card, MenuProps} from "antd";
import { Layout, Menu, ConfigProvider, theme } from "antd";
import { useRouter,usePathname} from 'next/navigation'
import React, { useEffect, useState } from "react";
import AuthWrapper from "@/lib/AuthWrapper";

const { Header, Content, Sider } = Layout;

const items2: MenuProps["items"] = [
    {
        key: "/dashboard/user",
        label: "用户管理",
        icon: <UserOutlined />,
    },
    {
        key: "/dashboard/account",
        label: "账号管理",
        icon: <SolutionOutlined />,
    },
    {
        key: '/dashboard/share',
        label: '共享管理',
        icon: <ShareAltOutlined />,
    }
];

function generateRandomString(length: number) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const hashClass = "hash-class-" + generateRandomString(10);

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const initialPathname =
        localStorage.getItem("selectedPath") || "/dashboard/user";
    const [pathname, setPathname] = useState(initialPathname);
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        localStorage.setItem("selectedPath", pathname);
    }, [pathname]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <AuthWrapper>
            <div style={{height: "100vh"}}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#14b974",
                            colorLink: "#14b974",
                            borderRadius: 5,
                        },
                        components: {
                            Menu: {
                                subMenuItemBg: "transparent",
                            },
                        },
                    }}
                >
                    <div className="ant-pro-layout-bg-list"></div>
                    <Layout>
                        <Layout>
                            <div className="ad-sider-pp"></div>
                            <Sider
                                className="ad-ant-sider-fixed"
                                width={256}
                                style={{background: "transparent"}}
                            >
                                <Menu
                                    mode="inline"
                                    selectedKeys={[pathName]}
                                    defaultOpenKeys={["1"]}
                                    style={{
                                        height: "100%",
                                        borderRight: 0,
                                        background: "transparent",
                                    }}
                                    items={items2}
                                    onClick={(e) => {
                                        setPathname(e.key || "/dashboard");
                                        router.push(e.key || "/dashboard");
                                    }}
                                />
                            </Sider>

                            <Layout className="ant-pro-layout-container">
                                <Header className="fake-header"></Header>
                                <Header
                                    className="ant-pro-layout-header ant-pro-layout-header-fixed-header "
                                    style={{display: "flex", alignItems: "center"}}
                                ></Header>
                                <Content className={`${hashClass} ant-pro-layout-content`}>
                                    {children}
                                    {/* <div className="ant-pro-card">{children}</div>*/}
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </ConfigProvider>

                <style jsx global>{`
                    :where(.${hashClass}).ant-pro-layout-content {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        background-color: transparent;
                        position: relative;
                        padding-block: 16px;
                        padding-inline: 20px;
                    }
                `}</style>
                <style jsx>{`
                    .ant-pro-card {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        box-sizing: border-box;
                        //width: 100%;
                        margin-block: 0;
                        margin-inline: 0;
                        padding-block: 0;
                        padding-inline: 0;
                        background-color: #ffffff;
                        border-radius: 6px;
                        margin: 0;
                        padding: 0;
                        color: rgba(0, 0, 0, 0.88);
                        font-size: 14px;
                        line-height: 1.5714285714285714;
                        list-style: none;
                    }

                    .ant-pro-card {
                        background: rgb(255, 255, 255);
                        height: 100%;
                        min-height: 85vh;
                        box-shadow: rgba(0, 0, 0, 0.03) 0px 1px 2px 0px,
                        rgba(0, 0, 0, 0.02) 0px 1px 6px -1px,
                        rgba(0, 0, 0, 0.02) 0px 2px 4px 0px;
                        padding: 24px;
                    }
                `}</style>
            </div>
        </AuthWrapper>
    );
}



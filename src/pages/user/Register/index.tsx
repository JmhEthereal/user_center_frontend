import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, useModel} from 'umi';
import {SYSTEM_LOGO} from "@/constants";
import styles from './index.less';

const Register: React.FC = () => {
    const [userLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('account');
    const {initialState, setInitialState} = useModel('@@initialState');
    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            await setInitialState((s) => ({
                ...s,
                currentUser: userInfo,
            }));
        }
    };
    const handleSubmit = async (values: API.RegisterParams) => {
        try {
            const {userPassword, checkPassword} = values;
            if (userPassword != checkPassword) {
                message.error("密码不一致");
            }
            // 注册
            const id = await register(values);
                if (id) {
                    const defaultLoginSuccessMessage = '注册成功！';
                    message.success(defaultLoginSuccessMessage);
                    await fetchUserInfo();
                    /** 此方法会跳转到 redirect 参数所在的位置 */
                    if (!history) return;
                    const {query} = history.location;
                    history.push({
                        pathname: '/user/login',
                        query,
                    });
                    return;
                }
        } catch (error: any) {
            const defaultLoginFailureMessage = '注册失败，请重试！';
            // @ts-ignore
            message.error(error.message??defaultLoginFailureMessage);
        }
    };
    const {status, type: loginType} = userLoginState;
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <LoginForm
                    submitter={{
                        searchConfig: {
                            submitText: '注册'
                        }
                    }
                    }
                    logo={<img alt="logo" src={SYSTEM_LOGO}/>}
                    title="呆毛用户中心"
                    subTitle={<a href="https://github.com/JmhEthereal" target="_blank"
                                 rel="noreferrer">菜鸡呆毛，学习中，github:呆毛</a>}
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.RegisterParams);
                    }}
                >
                    <Tabs activeKey={type} onChange={setType}>
                        <Tabs.TabPane key="account" tab={'账号密码注册'}/>
                    </Tabs>

                    {status === 'error' && loginType === 'account' && (
                        // eslint-disable-next-line react/jsx-no-undef
                        <LoginMessage content={'错误的账户和密码'}/>
                    )}
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="userAccount"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请输入账户'}
                                rules={[
                                    {
                                        required: true,
                                        message: '账户是必填项！',
                                    },
                                    {
                                        min: 4,
                                        type: 'string',
                                        message: '账户长度不能小于4',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="userPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码长度不能小于8',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="checkPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请确认密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '确认密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码长度不能小于8',
                                    },
                                ]}
                            />
                            <ProFormText
                                name="planetCode"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={'请输入星球编号'}
                                rules={[
                                    {
                                        required: true,
                                        message: '星球编号是必填项！',
                                    },
                                ]}
                            />
                        </>
                    )}

                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                    </div>
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};
export default Register;

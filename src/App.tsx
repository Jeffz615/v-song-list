import React, {useState, useEffect} from 'react';
import {SyncOutlined, YoutubeOutlined, SearchOutlined, RocketOutlined} from '@ant-design/icons';
import {Layout, Avatar, Row, Col, Input, Button, BackTop, message, Table, Tag} from 'antd';
import jData from './assets/data.json';
import copy from 'copy-to-clipboard';
import type {ColumnsType} from 'antd/lib/table';
import './App.less';

const {Content} = Layout;

const baseColor = 'pink';
const baseFontSize = '1rem';
const nameFontSize = '2.5rem';

const colorTable = [
    {
        price: 7,
        bgColor: 'rgba(30,136,229,1)',
        fColor: 'rgba(255,255,255,1)',
    },
    {
        price: 14,
        bgColor: 'rgba(0,229,255,1)',
        fColor: 'rgba(0,0,0,1)',
    },
    {
        price: 35,
        bgColor: 'rgba(29,233,182,1)',
        fColor: 'rgba(0,0,0,1)',
    },
    {
        price: 70,
        bgColor: 'rgba(255,202,40,1)',
        fColor: 'rgba(0,0,0,0.87451)',
    },
    {
        price: 140,
        bgColor: 'rgba(245,124,0,1)',
        fColor: 'rgba(255,255,255,0.87451)',
    },
    {
        price: 350,
        bgColor: 'rgba(233,30,99,1)',
        fColor: 'rgba(255,255,255,1)',
    },
    {
        price: 700,
        bgColor: 'rgba(230,33,23,1)',
        fColor: 'rgba(255,255,255,1)',
    },
]

interface IDataType {
    money: number;
    song: string;
    link: string;
    singer: string;
    tags: string[];
    remark: string;
}

const columns: ColumnsType<IDataType> = [
    {
        title: '',
        dataIndex: 'money',
        width: 1,
        render: (money: number) => {
            let bgColor = 'rgba(255,255,255, 1)';
            let fColor = 'rgba(0,0,0,1)';
            for (const color of colorTable) {
                if (money >= color.price) {
                    bgColor = color.bgColor;
                    fColor = color.fColor;
                }
            }
            if (money > 0)
                return (
                    <Tag color={bgColor} key={money} style={{color: fColor, margin: 0}}>
                        ¥{money}
                    </Tag>
                );
            else
                return (
                    <></>
                );
        },
    },
    {
        title: '',
        dataIndex: 'link',
        width: 1,
        render: (link: string) => {
            if (link.length > 0)
                return (
                    <a href={link} target='_blank' rel="noreferrer"><Button shape="circle" icon={<YoutubeOutlined/>}/></a>
                );
            else
                return (<></>);

        }
    },
    {
        title: '歌名',
        dataIndex: 'song',
    },
    {
        title: '歌手',
        dataIndex: 'singer',
    },
    {
        title: '标签',
        dataIndex: 'tags',
        render: (tags: string[]) => (
            <span>
            {tags.map(tag => {
                return (
                    <Tag color={'cyan'} key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                );
            })}
            </span>
        ),
    },
    {
        title: '备注',
        dataIndex: 'remark',
    },
];

const App: React.FC = () => {
    const [data, setData] = useState<IDataType[]>([]);
    const [songNum, setNum] = useState<number>(0);
    const [searchValue, setSearchValue] = useState<string>('');

    const random_a_song = () => {
        let record: IDataType = data[Math.floor(Math.random() * data.length)];
        copy('点歌 ' + record.song);
        message.success('"点歌 ' + record.song + '"成功复制到剪贴板，快去直播间点歌吧~');
    }

    useEffect(() => {
        if (searchValue !== '') {
            setData([]);
            setData(
                jData?.data?.filter(
                    item => {
                        let words: string[] = searchValue.trim().replaceAll(',', ' ').replaceAll('，', ' ').split(' ');
                        for (let word of words) {
                            let lword = word.toUpperCase();
                            if (!(lword.indexOf(item?.money?.toString()) !== -1 ||
                                item?.song?.toUpperCase().indexOf(lword) !== -1 ||
                                item?.singer?.toUpperCase().indexOf(lword) !== -1 ||
                                item?.tags?.indexOf(lword) !== -1 ||
                                item?.remark?.toUpperCase().indexOf(lword) !== -1))
                                return false;
                        }
                        return true;
                    }
                )
            );
        } else {
            setData(jData?.data);
        }
    }, [searchValue]);

    useEffect(() => {
        setNum(data.length);
    }, [data]);

    return (
        <Layout style={{minHeight: '100%', padding: '10px', backgroundColor: '#ffffff7f'}}>
            <Content>
                <Row justify={'center'}>
                    <Col
                        xxl={12} xl={16} lg={18} md={20} sm={22} xs={24} style={{backgroundColor: '#00000050'}}>
                        <Row justify={'center'} style={{marginTop: 10}}>
                            <Avatar
                                className={'bili-avatar'}
                                size={{xs: 100, sm: 150, md: 180, lg: 200, xl: 220, xxl: 250}}
                                src={'https://s2.loli.net/2022/06/03/YuOtwz1mhNpa6sq.jpg'}
                                style={{
                                    border: '3px solid ' + baseColor,
                                    boxShadow: '2px 2px #0000007f',
                                }}
                            />
                        </Row>
                        <Row justify={'center'} style={{marginTop: 10, fontFamily: 'zcool-happy'}}>
                            <span style={{
                                fontSize: nameFontSize,
                                color: baseColor,
                                lineHeight: '1em',
                                textShadow: '2px 2px #0000007f',
                            }}>幽灵车尔尼桑</span>
                        </Row>
                        <Row justify={'center'} style={{fontFamily: 'zcool-happy'}}>
                            <span style={{
                                fontSize: nameFontSize,
                                color: baseColor,
                                lineHeight: '1em',
                                textShadow: '2px 2px #0000007f',
                            }}>带来了她的{songNum}首歌</span>
                        </Row>
                        <Row justify={'center'} style={{fontFamily: 'zcool-happy'}}>
                            <span style={{
                                fontSize: '1rem',
                                color: "white",
                                lineHeight: '1em',
                                textShadow: '2px 2px black',
                            }}>~双击即可复制点歌指令~</span>
                        </Row>
                        <Row style={{padding: 10}}>
                            <Col span={15} style={{paddingRight: 10}}>
                                <Input placeholder={'输入关键字看看有没有你想听的？'}
                                       style={{
                                           fontSize: baseFontSize,
                                           borderRadius: baseFontSize,
                                           fontFamily: 'zcool-happy'
                                       }}
                                       allowClear
                                       prefix={<SearchOutlined/>}
                                       value={searchValue}
                                       onChange={e => {
                                           setSearchValue(e.target.value || '')
                                       }}
                                ></Input>
                            </Col>
                            <Col span={9}>
                                <Button type="primary" shape="round"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            fontSize: baseFontSize,
                                            fontFamily: 'zcool-happy'
                                        }}
                                        icon={<SyncOutlined/>} onClick={random_a_song}>随机一个</Button>
                            </Col>
                        </Row>
                        <Row style={{padding: '0 10px 10px 10px'}}>
                            <div className={'my-table-wrapper'} style={{width: '100%', overflowX: "auto"}}>
                                <div style={{minWidth: '600px', width: '100%'}}>
                                    <Table
                                        dataSource={data}
                                        columns={columns}
                                        pagination={false}
                                        onRow={(record: IDataType) => {
                                            return {
                                                onDoubleClick: () => {
                                                    copy('点歌 ' + record.song);
                                                    message.success('"点歌 ' + record.song + '"成功复制到剪贴板，快去直播间点歌吧~');
                                                },
                                            };
                                        }}
                                        size={"small"}
                                        style={{width: '100%'}}
                                        rowKey={record => record.song}
                                    />
                                </div>
                            </div>
                        </Row>
                    </Col>
                </Row>
                <BackTop>
                    <div><RocketOutlined style={{
                        fontSize: 40,
                        color: "white",
                        backgroundColor: '#00000050',
                        padding: 5
                    }}/>
                    </div>
                </BackTop>
            </Content>
        </Layout>
    );
}

export default App;
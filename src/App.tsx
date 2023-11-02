import React, {useState, useEffect, useRef} from 'react';
import {SyncOutlined, YoutubeOutlined, SearchOutlined} from '@ant-design/icons';
import {
    Layout,
    Avatar,
    Row,
    Col,
    Input,
    Button,
    BackTop,
    message,
    Table,
    Tag,
    Drawer,
    notification
} from 'antd';
import type {ColumnsType} from 'antd/lib/table';
import jData from './assets/data.json';
import copy from 'copy-to-clipboard';
import lblImage from './assets/lbl.jpg';
import avatarImage from './assets/avatar.jpg';
import pixelImage from './assets/pixel.png';
import './App.css';

const mqtt = require("mqtt/dist/mqtt.min");

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
    key: number;
    money: number;
    song: string;
    link: string;
    singer: string;
    tags: string[];
    remark: string;
}

interface IMqAlive {
    alive?: boolean;
    nickname?: string;
    cid?: string;
}

interface IMqNormalMsg {
    msg?: string;
    nickname?: string;
    ts?: number;
}

const TdCell = (props: any) => {
    // onMouseEnter, onMouseLeave在数据量多的时候，会严重阻塞表格单元格渲染，严重影响性能
    const {onMouseEnter, onMouseLeave, ...restProps} = props;
    return <td {...restProps} />;
};

function randomString(e: number) {
    e = e || 32;
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

let g_callbackMap: any = {};
let g_on = false;
let mqClientId = localStorage.getItem('clientId') || (randomString(5) + '_NoName');
if (mqClientId.length < 7) {
    mqClientId = randomString(5) + '_NoName';
}
let nickname = mqClientId.substring(6);
let mqClient: any;
let publish = (topic: string, body: string) => {
    if (mqClient) {
        mqClient.publish(topic, body);
    }
};

function start_listen() {
    if (g_on) {
        return;
    }
    g_on = true;
    // mqtt服务器免费申请：https://cloud-intl.emqx.com/console/deployments/new
    let url = process.env.REACT_APP_MQTT_URL || "wss://broker.emqx.io/mqtt";
    let username = process.env.REACT_APP_USERNAME || "";
    let password = process.env.REACT_APP_PASSWORD || "";
    mqClient = mqtt.connect(url, {
        clientId: mqClientId,
        username: username,
        password: password,
        will: {
            topic: 'u0/alive/' + mqClientId,
            payload: '',
            qos: 0,
            retain: true,
        }
    });
    mqClient.on('connect', () => {
        mqClient.subscribe('u0/alive/+');
        mqClient.subscribe('u0/notice');
        mqClient.subscribe('u0/broadcast');
        mqClient.publish('u0/alive/' + mqClientId, JSON.stringify({
            alive: true,
            nickname: nickname,
        }), {qos: 0, retain: true});
        localStorage.setItem('clientId', mqClientId);
    });
    mqClient.on('message', (topic: string, payload: Uint8Array, packet: any) => {
        try {
            let t = topic.split('/')[1];
            if (t in g_callbackMap) {
                g_callbackMap[t](topic, payload, packet);
            }
        } catch (e) {
        }
    });
}

function registerCallback(topic: string, callback: Function) {
    g_callbackMap[topic] = callback;
}

const decoder = new TextDecoder('utf-8');

const App: React.FC = () => {
    const [data, setData] = useState<IDataType[]>(jData?.data);
    const [songNum, setNum] = useState<number>(jData?.data?.length);
    const [searchValue, setSearchValue] = useState<string>('');
    const [visable, setVisible] = useState<boolean>(false);
    const [notice, setNotice] = useState<string>('');
    const [aliveList, setAlive] = useState<IMqAlive[]>([]);
    const [chatMsg, setMsg] = useState<IMqNormalMsg[]>([]);
    const [MyNickName, setNick] = useState(nickname);
    const [ChatVis, setChatVis] = useState<number>(0);
    const bottomLine = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (bottomLine && bottomLine.current) {
            bottomLine.current.scrollIntoView({behavior: 'auto'});
        }
    }

    const showDrawer = () => {
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    const random_a_song = () => {
        let record: IDataType = data[Math.floor(Math.random() * data.length)];
        copy('点歌 ' + record.song);
        if (record.money !== 0)
            message.success('"点歌 ' + record.song + '"成功复制到剪贴板，快去直播间打' + record.money + '米点歌吧~');
        else
            message.success('"点歌 ' + record.song + '"成功复制到剪贴板，快去直播间点歌吧~');
    }

    const columns: ColumnsType<IDataType> = [
        {
            title: '',
            dataIndex: 'money',
            width: 50,
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
                        <Tag color={bgColor} key={money} style={{color: fColor, margin: 0, cursor: "pointer"}}
                             onClick={() => {
                                 setSearchValue(searchValue + " !M:" + money);
                             }}>
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
            width: 25,
            render: (link: string) => {
                if (link.length > 0)
                    return (
                        <a href={link} target='_blank' rel="noreferrer"><Button shape="circle"
                                                                                icon={<YoutubeOutlined/>}/></a>
                    );
                else
                    return (<></>);

            }
        },
        {
            title: '歌名',
            dataIndex: 'song',
            width: 250,
        },
        {
            title: '歌手',
            dataIndex: 'singer',
            width: 100,
        },
        {
            title: '标签',
            dataIndex: 'tags',
            render: (tags: string[]) => (
                <span>
            {tags.map(tag => {
                return (
                    <Tag color={'cyan'} key={tag} onClick={() => {
                        setSearchValue(searchValue + " !T:" + tag);
                    }} style={{cursor: "pointer"}}>
                        {tag.toUpperCase()}
                    </Tag>
                );
            })}
            </span>
            ),
        },
    ];

    function on_alive(topic: string, payload: Uint8Array, packet: any) {
        let p: IMqAlive = {};
        if (payload.length > 0) {
            p = JSON.parse(decoder.decode(payload));
        }
        if (topic.startsWith('u0/alive/')) {
            const cid = topic.substring('u0/alive/'.length);
            if ("alive" in p && p.alive) {
                console.log(`${cid} 在线，nickname: ${p.nickname}`);
                setAlive(current => [...current.filter(alive => {
                    return alive.cid !== cid;
                }), {
                    nickname: p.nickname ? p.nickname : 'NoName',
                    cid: cid
                }]);
            } else {
                console.log(`${cid} 已下线`);
                setAlive(current => current.filter(alive => {
                    return alive.cid !== cid;
                }));
            }
        }
    }

    function on_notice(topic: string, payload: Uint8Array, packet: any) {
        let p: IMqNormalMsg = {};
        if (payload.length > 0) {
            p = JSON.parse(decoder.decode(payload));
        }
        if (topic === 'u0/notice' && "msg" in p) {
            if ("msg" in p) {
                console.log(`公告：${p.msg ? p.msg : ''}`);
                setNotice(p.msg ? p.msg : '');
            } else {
                setNotice('');
            }
        }
    }

    function on_broadcast(topic: string, payload: Uint8Array, packet: any) {
        let p: IMqNormalMsg = {};
        if (payload.length > 0) {
            p = JSON.parse(decoder.decode(payload));
        }
        if (topic === 'u0/broadcast') {
            if ("msg" in p && "nickname" in p) {
                const nickname = p.nickname ? p.nickname : 'NoName';
                const msg = p.msg ? p.msg : '';
                const ts = p.ts ? p.ts : new Date().getTime();
                console.log(`消息：[${nickname}] => ${msg}`);
                setMsg(current => [...current.filter(x => {
                    return x.nickname !== nickname || x.msg !== msg || x.ts !== ts;
                }), {nickname: nickname, msg: msg, ts: ts}]);
            }
        }
    }

    registerCallback('alive', on_alive);
    registerCallback('notice', on_notice);
    registerCallback('broadcast', on_broadcast);
    try {
        start_listen();
    } catch (e) {
    }

    function changeName() {
        let name = prompt("请输入你的新名字", MyNickName);
        if (name && name.trim().length > 0) {
            setNick(name.trim());
        }
    }

    function sengMsg() {
        let msg = prompt("请输入你要发送的消息", '');
        if (msg) {
            if (msg.length > 0 && msg.length <= 1024) {
                publish('u0/broadcast', JSON.stringify({msg: msg, nickname: MyNickName, ts: new Date().getTime()}));
            } else {
                message.warn('发送文本字符数量需要大于0小于等于1024');
            }
        }
    }

    useEffect(() => {
        const newClientId = mqClientId.substring(0, 6) + MyNickName;
        localStorage.setItem('clientId', newClientId);
    }, [MyNickName]);


    useEffect(() => {
        scrollToBottom();
    }, [chatMsg]);

    useEffect(() => {
        if (notice !== '') {
            notification.open({
                message: '公告',
                description: notice,
            });
        }
    }, [notice]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== '') {
                setData(
                    jData?.data?.filter(
                        item => {
                            let words: string[] = searchValue.trim().replaceAll(',', ' ').replaceAll('，', ' ').split(' ');
                            for (let word of words) {
                                let lword = word.toUpperCase();
                                if (lword.startsWith("!T:")) {
                                    if (!(item?.tags?.indexOf(lword.slice(3)) !== -1))
                                        return false;
                                    continue;
                                }
                                if (lword.startsWith("!M:")) {
                                    if (!(item?.money === parseInt(lword.slice(3))))
                                        return false;
                                    continue;
                                }
                                if (!(item?.song?.toUpperCase().indexOf(lword) !== -1 ||
                                    item?.singer?.toUpperCase().indexOf(lword) !== -1 ||
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
        }, 200);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        setNum(data.length);
    }, [data]);

    return (
        <Layout style={{minHeight: '100%', padding: '10px', backgroundColor: '#ffffff7f'}}>
            <div className={'chat-pannel'}>
                <div className={'alive-cnt'} onClick={() => {
                    setChatVis((ChatVis + 1) % 3);
                }}>在线人数：{aliveList.length}</div>
                <div className={ChatVis === 1 ? 'chat-pannel-in show' : 'chat-pannel-in'}>
                    <div className={'nickname-btn'} onClick={changeName}>{MyNickName}</div>
                    <div className={'send-msg-btn'} onClick={sengMsg}>发送消息</div>
                </div>
            </div>
            <div className={ChatVis < 2 ? 'chat-view' : 'chat-view hide'}>
                {chatMsg.map((value, index) => {
                    return (<div key={index} className={'chat-wrapper'}>
                        <div
                            className={'chat-profile'}>{(value.nickname?.substring(0, 1) || 'N').toUpperCase()}</div>
                        <div className={'chat-content-wrapper'}>
                            <div className={'chat-nickname'}>{value.nickname}</div>
                            <div className={'chat-content'}>{value.msg}</div>
                        </div>
                    </div>)
                })}
                <div ref={bottomLine}></div>
            </div>
            <Content>
                <Row justify={'center'}>
                    <Col
                        xxl={12} xl={16} lg={18} md={20} sm={22} xs={24} style={{backgroundColor: '#3c3c3cb0'}}>
                        <Row justify={'center'} style={{marginTop: 10}}>
                            <div onClick={showDrawer} style={{cursor: "pointer"}}>
                                <Avatar
                                    className={'bili-avatar'}
                                    size={{xs: 100, sm: 150, md: 180, lg: 200, xl: 220, xxl: 250}}
                                    src={avatarImage}
                                    style={{
                                        border: '3px solid ' + baseColor,
                                        boxShadow: '2px 2px #0000007f',
                                    }}
                                />
                            </div>
                        </Row>
                        <Row justify={'center'} style={{marginTop: 10}}>
                            <span style={{
                                fontSize: nameFontSize,
                                color: baseColor,
                                lineHeight: '1.2em',
                                textShadow: '2px 2px #0000007f',
                                fontWeight: "bolder",
                            }}>幽灵车尔尼桑</span>
                        </Row>
                        <Row justify={'center'}>
                            <span style={{
                                fontSize: nameFontSize,
                                color: baseColor,
                                lineHeight: '1.2em',
                                textShadow: '2px 2px #0000007f',
                                fontWeight: "bolder",
                            }}>带来了她的{songNum}首歌~</span>
                        </Row>
                        <Row justify={'center'}>
                            <span style={{
                                fontSize: '1rem',
                                color: "white",
                                lineHeight: '1.2em',
                                textShadow: '2px 2px black',
                                fontWeight: "bolder",
                            }}>~点击头像查看主播信息~</span>
                        </Row>
                        <Row justify={'center'}>
                            <span style={{
                                fontSize: '1rem',
                                color: "white",
                                lineHeight: '1.2em',
                                textShadow: '2px 2px black',
                                fontWeight: "bolder",
                            }}>~双击列表即可复制点歌指令~</span>
                        </Row>
                        <Row style={{margin: '0 10px'}}>{jData?.tags?.map((tag) => {
                            return (
                                <Tag color={'cyan'} key={tag} onClick={() => {
                                    setSearchValue(searchValue + " !T:" + tag);
                                }} style={{cursor: "pointer", margin: '5px'}}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}</Row>
                        <Row style={{padding: 10}}>
                            <Col span={15} style={{paddingRight: 10}}>
                                <Input placeholder={'输入关键字看看有没有你想听的？'}
                                       style={{
                                           fontSize: baseFontSize,
                                           borderRadius: baseFontSize,
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
                                            backgroundColor: '#d58a98',
                                            borderColor: 'pink',
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
                                                    if (record.money !== 0)
                                                        message.success('"点歌 ' + record.song + '"成功复制到剪贴板，快去直播间打 ' + record.money + ' 米点歌吧~');
                                                    else
                                                        message.success('"点歌 ' + record.song + '"成功复制到剪贴板，快去直播间点歌吧~');
                                                },
                                            };
                                        }}
                                        size={"small"}
                                        style={{width: '100%'}}
                                        rowKey={record => record.key}
                                        components={{
                                            body: {cell: TdCell},
                                        }}
                                    />
                                </div>
                            </div>
                        </Row>
                    </Col>
                </Row>
                <BackTop style={{height: '49em', width: '23em', fontSize: "0.3rem"}}>
                    <div><img src={pixelImage} alt="pixel" style={{width: '100%'}}/></div>
                </BackTop>
                <Drawer visible={visable} onClose={closeDrawer} size={"default"}>
                    <Row justify={"center"}>
                        <Col span={24} style={{fontSize: '18px', marginBottom: '20px'}}>
                            <div style={{fontSize: '24px'}}>~幽灵2021置顶更新~</div>
                            <div>大家好，这里是<span
                                style={{
                                    color: "#d58a98",
                                    fontSize: '20px',
                                    fontWeight: "bolder"
                                }}>幽灵车尔尼桑</span>，一个投稿更新直播随缘的up主
                            </div>
                            <div>喜欢的事是唱歌，在音乐区和生活区反 复 横 跳</div>
                            <div>【但是看直播很少看唱歌？？？】</div>
                            <div>谨记偶像（？）的“乐在二次元，行在三次元”，以自己的步调慢慢探索更多的可能性。</div>
                            <div>很多东西是懂的，但是很任性地不做而已T T</div>
                            <div>今年的目标是300粉！</div>
                            <div>希望能跟大家一起成长吧^ ^</div>
                            <br/>
                            <div>粉丝基数比较小，推歌、提问、想让我说的台词都可以放进下方提问箱中，我目前都回答啦！↓</div>
                            <div>（其实差一个台词没有念 嘘——）</div>
                            <br/>
                            <div>谢谢大家的关注与喜欢，幽灵会努力赚钱→更多学习→然后变成唱歌更好的人！</div>
                        </Col>
                    </Row>
                    <Row
                        className={"InfoButtonWrapper"}
                        justify={'center'}
                        style={{
                            width: '100%',
                        }}
                    >
                        <Button className={'BtnBiliSpace'}
                                onClick={() => window.open("https://space.bilibili.com/21693393")}>
                            <div className={'BtnContent'}>
                                <img alt={'bilibili'} src={'https://www.bilibili.com/favicon.ico'}></img>
                                <span>B站个人空间</span>
                            </div>
                        </Button>
                        <Button className={'BtnBiliLive'}
                                onClick={() => window.open("https://live.bilibili.com/370468")}>
                            <div className={'BtnContent'}>
                                <img alt={'bilibili-live'} src={'https://www.bilibili.com/favicon.ico'}></img>
                                <span>B站直播间</span>
                            </div>
                        </Button>
                        <Button className={'BtnMusic163'}
                                onClick={() => window.open("https://music.163.com/#/artist?id=32953961")}>
                            <div className={'BtnContent'}>
                                <img alt={'music163'}
                                     src={'http://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg'}></img>
                                <span>网易云音乐</span>
                            </div>
                        </Button>
                        <Button className={'Btn5Sing'}
                                onClick={() => window.open("http://5sing.kugou.com/50168798/default.html")}>
                            <div className={'BtnContent'}>
                                <img alt={'5sing'} src={'http://5sing.kugou.com/favicon.ico'}></img>
                                <span>5sing-中国原创音乐基地</span>
                            </div>
                        </Button>
                        <Button className={'BtnBiliLive'}
                                onClick={() => window.open("https://space.bilibili.com/1277624886")}>
                            <div className={'BtnContent'}>
                                <img alt={'luboling'} src={lblImage}></img>
                                <span>录播灵</span>
                            </div>
                        </Button>
                        <Button className={'BtnAiFaDian'}
                                onClick={() => window.open("https://afdian.net/@youling0722")}>
                            <div className={'BtnContent'}>
                                <img alt={'afdian'} src={'https://afdian.net/favicon.ico'}></img>
                                <span>爱发电</span>
                            </div>
                        </Button>
                        <div style={{
                            color: "rgba(0,0,0,0.3)"
                        }}>
                            Power&nbsp;by&nbsp;
                            <a
                                href={"https://github.com/Jeffz615/v-song-list"}
                                target='_blank'
                                rel="noreferrer"
                                style={{
                                    color: "rgba(0,0,0,0.5)",
                                    textDecoration: "underline"
                                }}>v-song-list
                            </a>
                        </div>
                    </Row>
                </Drawer>
            </Content>
        </Layout>
    );
}

export default App;
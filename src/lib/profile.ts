/** 主播资料：置顶简介与各平台入口，集中放在这里方便维护 */

export interface ProfileLink {
  key: string;
  label: string;
  href: string;
  icon: string;
}

export const PROFILE_TITLE = '~幽灵2021置顶更新~';

export const PROFILE_LINKS: ProfileLink[] = [
  { key: 'space', label: 'B站个人空间', href: 'https://space.bilibili.com/21693393', icon: 'https://www.bilibili.com/favicon.ico' },
  { key: 'live', label: 'B站直播间', href: 'https://live.bilibili.com/370468', icon: 'https://www.bilibili.com/favicon.ico' },
  { key: 'music163', label: '网易云音乐', href: 'https://music.163.com/#/artist?id=32953961', icon: 'https://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg' },
  { key: '5sing', label: '5sing-中国原创音乐基地', href: 'https://5sing.kugou.com/50168798/default.html', icon: 'https://5sing.kugou.com/favicon.ico' },
  { key: 'luboling', label: '录播灵', href: 'https://space.bilibili.com/1277624886', icon: 'lbl' },
  { key: 'afdian', label: '爱发电', href: 'https://afdian.com/a/youling0722', icon: 'https://afdian.com/favicon.ico' },
  { key: 'pome', label: '提问箱', href: 'https://pome.vip/yl0722', icon: 'https://pome.vip/favicon.ico' },
];

export const PROFILE_PARAGRAPHS: string[] = [
  '喜欢的事是唱歌，在音乐区和生活区反 复 横 跳',
  '【但是看直播很少看唱歌？？？】',
  '谨记偶像（？）的“乐在二次元，行在三次元”，以自己的步调慢慢探索更多的可能性。',
  '很多东西是懂的，但是很任性地不做而已T T',
  '今年的目标是300粉！',
  '希望能跟大家一起成长吧^ ^',
  '粉丝基数比较小，推歌、提问、想让我说的台词都可以放进下方提问箱中，我目前都回答啦！↓',
  '（其实差一个台词没有念 嘘——）',
  '谢谢大家的关注与喜欢，幽灵会努力赚钱→更多学习→然后变成唱歌更好的人！',
];

/** 首段单独拿出来，中间要给「幽灵车尔尼桑」加高亮 */
export const PROFILE_INTRO_PREFIX = '大家好，这里是';
export const PROFILE_INTRO_SUFFIX = '，一个投稿更新直播随缘的up主';

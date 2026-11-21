import { YoutubeOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import type { TdHTMLAttributes } from 'react';
import { resolvePriceColor, type Song } from '../lib/songs';

interface SongTableProps {
  songs: Song[];
  onTagClick: (tag: string) => void;
  onMoneyClick: (money: number) => void;
  onCopy: (song: Song) => void;
}

function TdCell(props: TdHTMLAttributes<HTMLTableCellElement>) {
  const { onMouseEnter, onMouseLeave, ...rest } = props;
  // 行数多时 antd 给每个单元格挂的 hover 事件会明显拖慢渲染，这里直接剔除
  void onMouseEnter;
  void onMouseLeave;
  return <td {...rest} />;
}

export function SongTable({ songs, onTagClick, onMoneyClick, onCopy }: SongTableProps) {
  const columns: TableProps<Song>['columns'] = [
    {
      title: '',
      dataIndex: 'money',
      width: 56,
      render: (money: number) => {
        if (!money) return null;
        const { bgColor, fColor } = resolvePriceColor(money);
        return (
          // antd v6 的 Tag 默认是 filled（浅色底 + 主题色文字），会把金额色阶冲淡，
          // 这里直接写死底色与文字色，保持原来的实心色块效果
          <Tag
            className="clickable-tag price-tag"
            style={{ backgroundColor: bgColor, borderColor: bgColor, color: fColor, margin: 0 }}
            onClick={() => onMoneyClick(money)}
          >
            ¥{money}
          </Tag>
        );
      },
    },
    {
      title: '',
      dataIndex: 'link',
      width: 44,
      render: (link: string) =>
        link ? (
          <Button
            shape="circle"
            size="small"
            icon={<YoutubeOutlined />}
            href={link}
            target="_blank"
            rel="noreferrer"
            aria-label="打开歌切视频"
          />
        ) : null,
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
        <span className="tag-list">
          {tags.map((tag) => (
            <Tag key={tag} color="cyan" className="clickable-tag" onClick={() => onTagClick(tag)}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="table-scroll">
      <div className="table-inner">
        <Table<Song>
          dataSource={songs}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
          locale={{ emptyText: '没有找到匹配的歌，换个关键词试试~' }}
          components={{ body: { cell: TdCell } }}
          onRow={(record) => ({
            onDoubleClick: () => onCopy(record),
          })}
        />
      </div>
    </div>
  );
}

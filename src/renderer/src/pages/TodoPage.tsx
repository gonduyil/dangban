import { JSX, useEffect, useState } from 'react'
import { Button, Checkbox, DatePicker, Input, List, Popconfirm, Select } from 'antd'
import dayjs from 'dayjs'
import { Todo } from '../../../main/model/Todo'
import 'dayjs/locale/zh-cn' // 引入中文
import weekday from 'dayjs/plugin/weekday'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(weekday)
dayjs.extend(localizedFormat)
dayjs.locale('zh-cn') // 设置全局中文

export default function TodoPage(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'pending' | 'doing' | 'done'>('pending')
  const [startAt, setStartAt] = useState<dayjs.Dayjs>(dayjs())

  const loadTodos = async (): Promise<void> => {
    const data = await window.api.getAll()
    setTodos(data)
  }

  useEffect(() => {
    void loadTodos()
  }, [])

  // 新增
  const addTodo = async (): Promise<void> => {
    if (!input.trim()) return
    const newTodo: Omit<Todo, 'id'> = {
      content: input,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      startAt: startAt.format('YYYY-MM-DD'),
      status
    }
    await window.api.add(newTodo)
    setInput('')
    void loadTodos()
  }

  // 删除
  const deleteTodo = async (id: number): Promise<void> => {
    await window.api.deleteTodo(id)
    await loadTodos()
  }

  // 按日期分组
  const groupByDate = (list: Todo[]): [string, Todo[]][] => {
    const map = new Map<string, Todo[]>()
    list.forEach((todo) => {
      const date = todo.startAt ? todo.startAt : '-'
      if (!map.has(date)) map.set(date, [])
      map.get(date)!.push(todo)
    })
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1))
  }

  // 切换状态
  const toggleTodo = async (todo: Todo): Promise<void> => {
    const newStatus = todo.status === 'done' ? 'pending' : 'done'
    await window.api.updateStatus(todo.id, newStatus)
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, status: newStatus } : t)))
  }

  const grouped = groupByDate(todos)
  console.log(grouped)

  return (
    <div style={{ maxWidth: 800 }}>
      <Input
        placeholder="录入当办事目"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={addTodo}
        style={{ marginBottom: 8 }}
      />
      <DatePicker
        placeholder="开始时间"
        value={startAt}
        onChange={(v) => setStartAt(v)}
        style={{ marginRight: 8 }}
      />
      <Select
        value={status}
        onChange={(value) => setStatus(value)}
        style={{ width: 120, marginRight: 8 }}
      >
        <Select.Option value="pending">待办</Select.Option>
        <Select.Option value="doing">进行中</Select.Option>
        <Select.Option value="done">完成</Select.Option>
      </Select>
      <Button type="primary" onClick={addTodo}>
        添加
      </Button>
      {grouped.map(([date, list]) => (
        <List
          className={'my-card'}
          bordered
          key={date}
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{date === '-' ? '未设置开始时间' : dayjs(date).format('YYYY-MM-DD dddd')}</span>
              <Button
                size="small"
                onClick={() => {
                  const doneList = list.filter((t) => t.status === 'done')
                  if (doneList.length === 0) {
                    return
                  }
                  const text = doneList.map((t, index) => `${index + 1}. ${t.content}`).join('\n')

                  navigator.clipboard.writeText(text)
                  // void window.api.showMessage?.('已复制到剪贴板')
                }}
              >
                复制
              </Button>
            </div>
          }
          style={{ marginTop: 16 }}
          dataSource={list}
          renderItem={(todo) => (
            <List.Item
              key={todo.id}
              actions={[
                <Popconfirm
                  title={'确定删除吗？'}
                  key={todo.id}
                  okText={'是'}
                  onConfirm={() => deleteTodo(todo.id)}
                >
                  <a>删除</a>
                </Popconfirm>
              ]}
            >
              <Checkbox
                checked={todo.status === 'done'}
                onChange={() => toggleTodo(todo)}
                style={{ marginRight: 8 }}
              />
              <Input.TextArea
                value={todo.content}
                bordered={false}
                autoSize={{ minRows: 1, maxRows: 5 }}
                spellCheck={false}
                style={{
                  width: '100%',
                  // textDecoration: todo.status === 'done' ? 'line-through' : 'none',
                  color: todo.status === 'done' ? '#999' : '#000',
                  resize: 'none'
                }}
                onChange={async (e) => {
                  const val = e.target.value
                  setTodos((prev) =>
                    prev.map((t) => (t.id === todo.id ? { ...t, content: val } : t))
                  )
                  // await window.api.updateContent(todo.id, val)
                }}
              />
            </List.Item>
          )}
        />
      ))}
    </div>
  )
}

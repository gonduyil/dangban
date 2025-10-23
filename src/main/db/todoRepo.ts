import { pool } from './connection'
import { Todo } from '../model/Todo'
import { RowDataPacket } from 'mysql2'
import { formatDate } from '../model/util/date'

export async function findAllTodos(): Promise<Todo[]> {
  const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC')
  return (rows as RowDataPacket[]).map((r) => ({
    id: r.id,
    createdAt: formatDate(r.created_at),
    startAt: formatDate(r.start_at),
    content: r.content,
    status: r.status
  }))
}

export async function insertTodo(todo: Omit<Todo, 'id'>): Promise<void> {
  await pool.query(
    'INSERT INTO todos (created_at, start_at, content, status) VALUES (?, ?, ?, ?)',
    [todo.createdAt, todo.startAt, todo.content, todo.status]
  )
}

export async function deleteTodo(todoId: number): Promise<void> {
  await pool.query('delete from todos where id=?', [todoId])
}

export async function updateStatus(id: number, status: string): Promise<void> {
  await pool.query('update todos set status = ? where id=?', [status, id])
}

export interface Todo {
  id: number
  createdAt: string | null
  startAt?: string | null
  content: string
  status: 'pending' | 'doing' | 'done'
}

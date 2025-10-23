import { JSX } from 'react'
import { Typography } from 'antd'

const { Title } = Typography

export default function Home(): JSX.Element {
  return (
    <div>
      <Title level={3}>首页</Title>
    </div>
  )
}

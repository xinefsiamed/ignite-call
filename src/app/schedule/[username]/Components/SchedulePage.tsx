'use client'

import { Avatar, Heading, Text } from '@ignite-ui/react'
import { Container, UserHeader } from './styles'
import { ScheduleForm } from './ScheduleForm'

interface SchedulePageProps {
  username: string
  description: string
  image: string
}

export function SchedulePage(props: SchedulePageProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={props.image} />
        <Heading>{props.username}</Heading>
        <Text>{props.description}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}

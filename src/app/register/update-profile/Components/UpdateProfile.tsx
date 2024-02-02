'use client'

import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { FormAnnotation, ProfileBox } from './styles'
import { ArrowRight } from 'phosphor-react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Header } from '../../styles'
import { Session } from 'next-auth'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfiledata = z.infer<typeof updateProfileSchema>

export function UpdateProfile({ session }: { session: Session | null }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfiledata>({
    resolver: zodResolver(updateProfileSchema),
  })

  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfiledata) {
    await api.put('users/update-profile', {
      bio: data.bio,
    })

    router.push(`/schedule/${session?.user.username}`)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Defina sua disponibilidade</Heading>
        <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de perfil</Text>
          <Avatar src={session?.user.image} alt={session?.user.name} />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register('bio')} />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

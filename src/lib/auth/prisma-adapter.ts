/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { cookies } from 'next/headers'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {
      const userIdCookies = cookies().get('@ignitecall:userId')?.value

      if (!userIdCookies) {
        throw new Error('User id not found on cookies.')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdCookies,
        },

        data: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })

      cookies().delete('@ignitecall:userId')

      return {
        id: prismaUser.id,
        email: prismaUser.email!,
        emailVerified: null,
        image: prismaUser.image!,
        name: prismaUser.name,
        username: prismaUser.username,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        emailVerified: null,
        image: user.image!,
        name: user.name,
        username: user.username,
      }
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        emailVerified: null,
        image: user.image!,
        name: user.name,
        username: user.username,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user.id,
        email: user.email!,
        emailVerified: null,
        image: user.image!,
        name: user.name,
        username: user.username,
      }
    },

    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })

      return {
        id: updatedUser.id,
        email: updatedUser.email!,
        emailVerified: null,
        image: updatedUser.image!,
        name: updatedUser.name,
        username: updatedUser.username,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          type: account.type,
          access_token: account.access_token,
          expires_at: account.expires_at,
          id_token: account.id_token,
          refresh_token: account.refresh_token,
          scope: account.scope,
          session_state: account.session_state,
          token_type: account.token_type,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          session_token: sessionToken,
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken,
        userId,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!session) {
        return null
      }

      const { user } = session

      return {
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id,
        },
        user: {
          id: user.id,
          email: user.email!,
          emailVerified: null,
          image: user.image!,
          name: user.name,
          username: user.username,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: session.expires,
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      const verificationToken = await prisma.verificationToken.create({
        data: {
          identifier,
          expires,
          token,
        },
      })

      return {
        expires: verificationToken.expires,
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      }
    },

    async useVerificationToken({ identifier, token }) {
      const verificationToken = await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier,
            token,
          },
        },
      })

      return {
        expires: verificationToken.expires,
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      }
    },
  }
}

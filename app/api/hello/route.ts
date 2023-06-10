import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany()
  return NextResponse.json({ users })
}
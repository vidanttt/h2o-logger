import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const history = await prisma.waterRecord.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        date: 'desc'
      },
      take: 30 // Last 30 days
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

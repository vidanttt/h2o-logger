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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's record
    const todayRecord = await prisma.waterRecord.findUnique({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today
        }
      }
    })

    return NextResponse.json({
      fullBottles: todayRecord?.fullBottles || 0,
      halfBottles: todayRecord?.halfBottles || 0,
      totalBottles: todayRecord?.totalBottles || 0,
      totalML: todayRecord?.totalML || 0
    })
  } catch (error) {
    console.error('Get water intake error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { fullBottles, halfBottles } = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const totalBottles = fullBottles + (halfBottles * 0.5)
    const totalML = totalBottles * 500

    // Upsert today's record
    const record = await prisma.waterRecord.upsert({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today
        }
      },
      update: {
        fullBottles,
        halfBottles,
        totalBottles,
        totalML
      },
      create: {
        userId: decoded.userId,
        date: today,
        fullBottles,
        halfBottles,
        totalBottles,
        totalML
      }
    })

    return NextResponse.json({
      message: 'Water intake updated successfully',
      record
    })
  } catch (error) {
    console.error('Update water intake error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

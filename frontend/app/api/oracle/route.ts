import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ message: 'Use frontend wallet signing instead' })
}

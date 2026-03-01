import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from 'lib/jwt';
import { prisma } from 'lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    
    const userData = await prisma.user.findUnique({
      where: { user_id: user.user_id },
      select: { firstname: true, lastname: true, email: true }
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

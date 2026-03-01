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
    
    const transactions = await prisma.transaction.findMany({
      where: { user_id: user.user_id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

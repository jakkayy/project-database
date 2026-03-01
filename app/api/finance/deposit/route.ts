import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from 'lib/jwt';
import { prisma } from 'lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { user_id: user.user_id },
        data: {
          balance: {
            increment: amount
          }
        }
      });

      const transaction = await tx.transaction.create({
        data: {
          user_id: user.user_id,
          type: 'DEPOSIT',
          amount: amount
        }
      });

      return { updatedUser, transaction };
    });

    return NextResponse.json({
      message: 'Deposit successful',
      newBalance: result.updatedUser.balance,
      transaction: result.transaction
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

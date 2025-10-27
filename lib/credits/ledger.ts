import { db } from '@/lib/db';

export async function reserveCredits(userId: string, amount: number) {
  const client = await db.connect();
  
  try {
    // In a real implementation, you would use transactions here
    // For now, we'll simulate with mock logic
    
    // Check if user has sufficient credits
    const r = await client.query('SELECT balance FROM credits WHERE user_id=$1 FOR UPDATE', [userId]);
    
    if (!r.rows.length || (r.rows[0].balance && r.rows[0].balance < amount)) {
      throw new Error('Insufficient credits');
    }
    
    // Deduct credits
    await client.query(
      'UPDATE credits SET balance = balance - $1, updated_at=NOW() WHERE user_id = $2',
      [amount, userId]
    );
    
    // Log transaction
    await client.query(
      `INSERT INTO credit_transactions (user_id, amount, type, reference, created_at) 
       VALUES ($1,$2,$3,$4,NOW())`,
      [userId, amount, 'reserve', `reserve:${Date.now()}`]
    );
  } catch (error) {
    console.error('Error reserving credits:', error);
    throw error;
  } finally {
    await client.release();
  }
}


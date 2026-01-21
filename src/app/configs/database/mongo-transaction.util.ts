import { ClientSession, Connection } from 'mongoose';

export async function withMongoTransaction<T>(
  connection: Connection,
  handler: (session: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await connection.startSession();
  try {
    let result: T;
    await session.withTransaction(async () => {
      result = await handler(session);
    });

    return result!;
  } finally {
    await session.endSession();
  }
}

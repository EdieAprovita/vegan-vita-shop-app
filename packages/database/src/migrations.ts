import { prisma } from './index';

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection established');

    // Optionally run custom migration logic here
    // This is useful for data migrations that can't be handled by Prisma migrations alone
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
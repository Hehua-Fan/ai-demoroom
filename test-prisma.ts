import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.english_writing_review.create({
    data: {
      user_id: 'testuser1',
      essay_text: 'This is a test essay.',
      review_json: JSON.stringify({ score: 88, comment: 'Great job' }),
    },
  });

  console.log('✅ 插入成功：', result);
}

main()
  .catch(e => console.error('❌ 出错:', e))
  .finally(() => prisma.$disconnect());

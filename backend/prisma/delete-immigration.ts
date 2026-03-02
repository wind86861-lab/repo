import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteImmigrationServices() {
  console.log('🗑️ Starting deletion of Immigration Services...');

  try {
    // Find all immigration-related categories by slug
    const immigrationSlugs = [
      'immigration-services',
      'visa-types',
      'visitor-visa',
      'student-visa',
      'work-visa',
      'family-visa',
      'business-visa',
      'permanent-residency',
      'citizenship',
      'immigration-service-types',
      'immigration-strategy',
      'document-audit',
      'appeal-support',
      'relocation-support',
      'corporate-immigration',
      'legal-services',
    ];

    // Delete all services created for immigration categories
    const categoriesToDelete = await prisma.serviceCategory.findMany({
      where: {
        slug: {
          in: immigrationSlugs,
        },
      },
    });

    console.log(`Found ${categoriesToDelete.length} immigration categories to delete`);

    // Delete diagnostic services for these categories
    for (const category of categoriesToDelete) {
      const deletedServices = await prisma.diagnosticService.deleteMany({
        where: {
          categoryId: category.id,
        },
      });
      console.log(`Deleted ${deletedServices.count} services from category: ${category.nameUz}`);
    }

    // Delete the categories themselves
    for (const category of categoriesToDelete) {
      await prisma.serviceCategory.delete({
        where: { id: category.id },
      });
      console.log(`Deleted category: ${category.nameUz}`);
    }

    // Delete system admin user if it was created for immigration services
    const systemAdmin = await prisma.user.findUnique({
      where: { email: 'system-admin@banisa.local' },
    });

    if (systemAdmin) {
      // Check if this user has any other services
      const otherServices = await prisma.diagnosticService.findMany({
        where: { createdById: systemAdmin.id },
      });

      if (otherServices.length === 0) {
        await prisma.user.delete({
          where: { id: systemAdmin.id },
        });
        console.log('Deleted system admin user (no other services found)');
      }
    }

    console.log('\n✅ Immigration Services deletion completed successfully!');
  } catch (error) {
    console.error('❌ Error deleting immigration services:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteImmigrationServices();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedImmigrationServices() {
  console.log('🌍 Starting Immigration Services seed...');

  try {
    // ─── CREATE OR GET SYSTEM ADMIN USER ───────────────────────────────────
    let systemAdmin = await prisma.user.findUnique({
      where: { email: 'system-admin@banisa.local' },
    });

    if (!systemAdmin) {
      systemAdmin = await prisma.user.create({
        data: {
          email: 'system-admin@banisa.local',
          password: 'system-admin-password',
          firstName: 'System',
          lastName: 'Admin',
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
      console.log('✅ Created system admin user');
    } else {
      console.log('✅ Using existing system admin user');
    }

    // ─── CREATE MAIN CATEGORY: IMMIGRATION SERVICES ───────────────────────────
    const immigrationMainCat = await prisma.serviceCategory.upsert({
      where: { slug: 'immigration-services' },
      update: {},
      create: {
        nameUz: 'Immigratsion Xizmatlari',
        nameRu: 'Иммиграционные услуги',
        nameEn: 'Immigration Services',
        slug: 'immigration-services',
        icon: '🌍',
        level: 0,
        sortOrder: 1,
      },
    });

    console.log('✅ Created main category: Immigration Services');

    // ─── VISA TYPES (Level 1) ───────────────────────────────────────────────
    const visaTypesCat = await prisma.serviceCategory.upsert({
      where: { slug: 'visa-types' },
      update: {},
      create: {
        nameUz: 'Viza Turlari',
        nameRu: 'Типы виз',
        nameEn: 'Visa Types',
        slug: 'visa-types',
        icon: '📋',
        level: 1,
        parentId: immigrationMainCat.id,
        sortOrder: 1,
      },
    });

    // ─── VISA SUBCATEGORIES (Level 2) ───────────────────────────────────────
    const visaSubcategories = [
      {
        nameUz: 'Turistik / Tashrif Vizasi',
        nameRu: 'Туристическая виза',
        nameEn: 'Visitor Visa',
        slug: 'visitor-visa',
        icon: '✈️',
      },
      {
        nameUz: 'Talaba Vizasi',
        nameRu: 'Студенческая виза',
        nameEn: 'Student Visa',
        slug: 'student-visa',
        icon: '🎓',
      },
      {
        nameUz: 'Ishchi Vizasi',
        nameRu: 'Рабочая виза',
        nameEn: 'Work Visa',
        slug: 'work-visa',
        icon: '💼',
      },
      {
        nameUz: 'Oila Vizasi',
        nameRu: 'Семейная виза',
        nameEn: 'Family Visa',
        slug: 'family-visa',
        icon: '👨‍👩‍👧‍👦',
      },
      {
        nameUz: 'Biznes / Investor Vizasi',
        nameRu: 'Бизнес виза',
        nameEn: 'Business Visa',
        slug: 'business-visa',
        icon: '💰',
      },
      {
        nameUz: 'Doimiy Yashash (PR)',
        nameRu: 'Постоянное проживание',
        nameEn: 'Permanent Residency',
        slug: 'permanent-residency',
        icon: '🏠',
      },
      {
        nameUz: 'Fuqarolik',
        nameRu: 'Гражданство',
        nameEn: 'Citizenship',
        slug: 'citizenship',
        icon: '🛂',
      },
    ];

    const visaSubcats = await Promise.all(
      visaSubcategories.map((cat) =>
        prisma.serviceCategory.upsert({
          where: { slug: cat.slug },
          update: {},
          create: {
            ...cat,
            level: 2,
            parentId: visaTypesCat.id,
            sortOrder: visaSubcategories.indexOf(cat) + 1,
          },
        })
      )
    );

    console.log('✅ Created 7 visa type subcategories');

    // ─── IMMIGRATION SERVICE TYPES (Level 1) ────────────────────────────────
    const immigrationServicesCat = await prisma.serviceCategory.upsert({
      where: { slug: 'immigration-service-types' },
      update: {},
      create: {
        nameUz: 'Immigratsion Xizmat Turlari',
        nameRu: 'Типы иммиграционных услуг',
        nameEn: 'Immigration Service Types',
        slug: 'immigration-service-types',
        icon: '🔧',
        level: 1,
        parentId: immigrationMainCat.id,
        sortOrder: 2,
      },
    });

    // ─── IMMIGRATION SERVICE SUBCATEGORIES (Level 2) ───────────────────────
    const immigrationServiceSubcats = [
      {
        nameUz: 'Immigratsion Strategiya Konsultatsiyasi',
        nameRu: 'Консультация по иммиграционной стратегии',
        nameEn: 'Immigration Strategy Consulting',
        slug: 'immigration-strategy',
        icon: '📊',
      },
      {
        nameUz: 'Hujjat Audit & Compliance',
        nameRu: 'Аудит документов и соответствие',
        nameEn: 'Document Audit & Compliance',
        slug: 'document-audit',
        icon: '✅',
      },
      {
        nameUz: 'Appeal & Reapplication Support',
        nameRu: 'Поддержка апелляции и переподачи',
        nameEn: 'Appeal & Reapplication Support',
        slug: 'appeal-support',
        icon: '⚖️',
      },
      {
        nameUz: 'Relocation Support',
        nameRu: 'Поддержка переселения',
        nameEn: 'Relocation Support',
        slug: 'relocation-support',
        icon: '🚚',
      },
      {
        nameUz: 'Corporate Immigration Services',
        nameRu: 'Корпоративные иммиграционные услуги',
        nameEn: 'Corporate Immigration Services',
        slug: 'corporate-immigration',
        icon: '🏢',
      },
      {
        nameUz: 'Xalqaro Advokat Xizmatlari',
        nameRu: 'Услуги международного адвоката',
        nameEn: 'International Legal Services',
        slug: 'legal-services',
        icon: '⚖️',
      },
    ];

    const immigrationServiceSubcatsCreated = await Promise.all(
      immigrationServiceSubcats.map((cat) =>
        prisma.serviceCategory.upsert({
          where: { slug: cat.slug },
          update: {},
          create: {
            ...cat,
            level: 2,
            parentId: immigrationServicesCat.id,
            sortOrder: immigrationServiceSubcats.indexOf(cat) + 1,
          },
        })
      )
    );

    console.log('✅ Created 6 immigration service type subcategories');

    // ─── VISA TYPE SERVICES ─────────────────────────────────────────────────

    // 1. VISITOR VISA SERVICES
    const visitorVisaCat = visaSubcats[0];
    const visitorVisaServices = [
      {
        nameUz: 'Moliyaviy Hujjat Tekshiruvi',
        nameRu: 'Проверка финансовых документов',
        nameEn: 'Financial Document Review',
        shortDescription: 'Sayohat uchun zarur moliyaviy hujjatlarni tekshirish va tayyorlash',
        fullDescription: 'Viza ariza uchun zarur moliyaviy hujjatlarni (bank bayonnomasi, soliq hujjatlari, investitsiya sertifikatlari) tekshirish, tahlil qilish va tayyorlash.',
        priceRecommended: 500000,
        priceMin: 300000,
        priceMax: 800000,
      },
      {
        nameUz: 'Travel Plan Tayyorlash',
        nameRu: 'Подготовка плана путешествия',
        nameEn: 'Travel Plan Preparation',
        shortDescription: 'Sayohat rejasini tayyorlash va viza ariza uchun taqdim etish',
        fullDescription: 'Viza ariza uchun professional travel plan tayyorlash, pansionlar, aviabiletlar va sayohat marshruti haqida ma\'lumot.',
        priceRecommended: 400000,
        priceMin: 200000,
        priceMax: 600000,
      },
      {
        nameUz: 'Taklif Xati Maslahat',
        nameRu: 'Консультация по письму приглашения',
        nameEn: 'Invitation Letter Consultation',
        shortDescription: 'Taklif xati tayyorlash va qabul qilish bo\'yicha maslahat',
        fullDescription: 'Taklif xati tayyorlash, notarializatsiya va viza ariza bilan birga taqdim etish bo\'yicha professional maslahat.',
        priceRecommended: 300000,
        priceMin: 150000,
        priceMax: 500000,
      },
      {
        nameUz: 'Intervyu Tayyorgarligi (AQSh, Yevropa)',
        nameRu: 'Подготовка к интервью',
        nameEn: 'Visa Interview Preparation',
        shortDescription: 'Viza intervyusi uchun tayyorlash va mashq',
        fullDescription: 'Viza intervyusi uchun comprehensive tayyorlash, mumkin bo\'lgan savollar, javoblar va interview strategy.',
        priceRecommended: 600000,
        priceMin: 400000,
        priceMax: 1000000,
      },
    ];

    await Promise.all(
      visitorVisaServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `visitor-visa-${service.nameUz}` },
          update: {},
          create: {
            id: `visitor-visa-${service.nameUz}`,
            ...service,
            categoryId: visitorVisaCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 4 Visitor Visa services');

    // 2. STUDENT VISA SERVICES
    const studentVisaCat = visaSubcats[1];
    const studentVisaServices = [
      {
        nameUz: "O'qish Joyini Tanlash",
        nameRu: 'Выбор учебного заведения',
        nameEn: 'University Selection',
        shortDescription: "O'qish joyini tanlash va ariza tayyorlash",
        fullDescription: "Talaba uchun eng mos o'qish joyini tanlash, universitetlar haqida ma'lumot to'plash va ariza tayyorlash.",
        priceRecommended: 800000,
        priceMin: 500000,
        priceMax: 1200000,
      },
      {
        nameUz: 'Offer Letter Olishda Yordam',
        nameRu: 'Помощь в получении письма о предложении',
        nameEn: 'Offer Letter Assistance',
        shortDescription: 'Universitetdan offer letter olishda yordam',
        fullDescription: 'Universitetga ariza topshirish, offer letter olish va negotiation bo\'yicha professional yordam.',
        priceRecommended: 1000000,
        priceMin: 700000,
        priceMax: 1500000,
      },
      {
        nameUz: 'SOP / Motivation Letter Yozish',
        nameRu: 'Написание SOP и письма о мотивации',
        nameEn: 'SOP & Motivation Letter Writing',
        shortDescription: 'Statement of Purpose va motivation letter yozish',
        fullDescription: 'Professional SOP (Statement of Purpose) va motivation letter yozish, editing va improvement.',
        priceRecommended: 600000,
        priceMin: 400000,
        priceMax: 900000,
      },
      {
        nameUz: 'Bank Hujjat Tayyorlash',
        nameRu: 'Подготовка банковских документов',
        nameEn: 'Bank Document Preparation',
        shortDescription: 'O\'qish uchun zarur bank hujjatlarini tayyorlash',
        fullDescription: 'Proof of funds, bank statements, sponsor affidavit va boshqa moliyaviy hujjatlarni tayyorlash.',
        priceRecommended: 500000,
        priceMin: 300000,
        priceMax: 800000,
      },
      {
        nameUz: 'Viza Ariza To\'ldirish',
        nameRu: 'Заполнение визовой анкеты',
        nameEn: 'Visa Application Filling',
        shortDescription: 'Talaba vizasi ariyasini to\'ldirish va tekshirish',
        fullDescription: 'Student visa ariyasini to\'ldirish, barcha hujjatlarni tekshirish va submission uchun tayyorlash.',
        priceRecommended: 400000,
        priceMin: 200000,
        priceMax: 600000,
      },
      {
        nameUz: 'Pre-Departure Orientation',
        nameRu: 'Ориентация перед отъездом',
        nameEn: 'Pre-Departure Orientation',
        shortDescription: 'Chet elga ketishdan oldin orientation va tayyorlash',
        fullDescription: 'Chet elga ketishdan oldin comprehensive orientation, life tips, accommodation, banking va boshqa muhim ma\'lumotlar.',
        priceRecommended: 300000,
        priceMin: 150000,
        priceMax: 500000,
      },
    ];

    await Promise.all(
      studentVisaServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `student-visa-${service.nameUz}` },
          update: {},
          create: {
            id: `student-visa-${service.nameUz}`,
            ...service,
            categoryId: studentVisaCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 6 Student Visa services');

    // 3. WORK VISA SERVICES
    const workVisaCat = visaSubcats[2];
    const workVisaServices = [
      {
        nameUz: 'CV Tayyorlash (Xalqaro Format)',
        nameRu: 'Подготовка резюме (международный формат)',
        nameEn: 'CV Preparation (International Format)',
        shortDescription: 'Xalqaro standartda CV tayyorlash',
        fullDescription: 'Professional CV tayyorlash, xalqaro standartlar bo\'yicha formatting, ATS optimization va improvement.',
        priceRecommended: 400000,
        priceMin: 200000,
        priceMax: 600000,
      },
      {
        nameUz: 'Ish Beruvchi Bilan Hujjat Tekshiruvi',
        nameRu: 'Проверка документов с работодателем',
        nameEn: 'Employer Document Verification',
        shortDescription: 'Ish beruvchi hujjatlarini tekshirish va validatsiya',
        fullDescription: 'Ish beruvchi hujjatlarini, job offer letterini, employment contract va boshqa hujjatlarni tekshirish.',
        priceRecommended: 600000,
        priceMin: 400000,
        priceMax: 1000000,
      },
      {
        nameUz: 'CoS / LMIA / Work Permit Tushuntirish',
        nameRu: 'Объяснение CoS/LMIA/Work Permit',
        nameEn: 'CoS/LMIA/Work Permit Explanation',
        shortDescription: 'Ish vizasi dokumentlari haqida tushuntirish',
        fullDescription: 'Certificate of Sponsorship, Labour Market Impact Assessment, Work Permit va boshqa zarur dokumentlar haqida detailed explanation.',
        priceRecommended: 500000,
        priceMin: 300000,
        priceMax: 800000,
      },
      {
        nameUz: 'Hujjat Audit (Soxtalikni Aniqlash)',
        nameRu: 'Аудит документов (выявление подделок)',
        nameEn: 'Document Audit (Fraud Detection)',
        shortDescription: 'Hujjatlarni soxtalik uchun tekshirish',
        fullDescription: 'Barcha hujjatlarni soxtalik va falsification uchun tekshirish, legal va compliance issues aniqlash.',
        priceRecommended: 700000,
        priceMin: 500000,
        priceMax: 1200000,
      },
    ];

    await Promise.all(
      workVisaServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `work-visa-${service.nameUz}` },
          update: {},
          create: {
            id: `work-visa-${service.nameUz}`,
            ...service,
            categoryId: workVisaCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 4 Work Visa services');

    // 4. FAMILY VISA SERVICES
    const familyVisaCat = visaSubcats[3];
    const familyVisaServices = [
      {
        nameUz: 'Nikoh Hujjatlari Tekshiruvi',
        nameRu: 'Проверка свидетельства о браке',
        nameEn: 'Marriage Certificate Verification',
        shortDescription: 'Nikoh hujjatlarini tekshirish va validatsiya',
        fullDescription: 'Nikoh sertifikati, divorce papers, death certificates va boshqa vital documents tekshiruvi.',
        priceRecommended: 300000,
        priceMin: 150000,
        priceMax: 500000,
      },
      {
        nameUz: 'Sponsorship Talablarini Tushuntirish',
        nameRu: 'Объяснение требований спонсорства',
        nameEn: 'Sponsorship Requirements Explanation',
        shortDescription: 'Sponsorship talablarini tushuntirish',
        fullDescription: 'Sponsorship talablarini, financial requirements, relationship proof va boshqa zarur dokumentlarni tushuntirish.',
        priceRecommended: 400000,
        priceMin: 250000,
        priceMax: 650000,
      },
      {
        nameUz: 'Moliyaviy Mezonlarni Hisoblash',
        nameRu: 'Расчет финансовых критериев',
        nameEn: 'Financial Criteria Calculation',
        shortDescription: 'Moliyaviy mezonlarni hisoblash va tayyorlash',
        fullDescription: 'Sponsor income requirements, tax returns, financial documents hisoblash va tayyorlash.',
        priceRecommended: 350000,
        priceMin: 200000,
        priceMax: 550000,
      },
    ];

    await Promise.all(
      familyVisaServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `family-visa-${service.nameUz}` },
          update: {},
          create: {
            id: `family-visa-${service.nameUz}`,
            ...service,
            categoryId: familyVisaCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Family Visa services');

    // 5. BUSINESS VISA SERVICES
    const businessVisaCat = visaSubcats[4];
    const businessVisaServices = [
      {
        nameUz: 'Biznes Reja Tayyorlash',
        nameRu: 'Подготовка бизнес-плана',
        nameEn: 'Business Plan Preparation',
        shortDescription: 'Investor vizasi uchun biznes reja tayyorlash',
        fullDescription: 'Comprehensive business plan tayyorlash, market analysis, financial projections, investment strategy.',
        priceRecommended: 1500000,
        priceMin: 1000000,
        priceMax: 2500000,
      },
      {
        nameUz: 'Investitsiya Manbai Asoslash',
        nameRu: 'Обоснование источника инвестиций',
        nameEn: 'Investment Source Justification',
        shortDescription: 'Investitsiya manbasini asoslash va dokumentlash',
        fullDescription: 'Investment source documentation, proof of funds, bank statements, tax returns va boshqa moliyaviy hujjatlar.',
        priceRecommended: 800000,
        priceMin: 500000,
        priceMax: 1200000,
      },
      {
        nameUz: 'Kompaniya Ro\'yxatdan O\'tkazish Maslahat',
        nameRu: 'Консультация по регистрации компании',
        nameEn: 'Company Registration Consultation',
        shortDescription: 'Kompaniya ro\'yxatdan o\'tkazish bo\'yicha maslahat',
        fullDescription: 'Company registration process, legal structure, tax planning, compliance requirements.',
        priceRecommended: 1000000,
        priceMin: 700000,
        priceMax: 1500000,
      },
    ];

    await Promise.all(
      businessVisaServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `business-visa-${service.nameUz}` },
          update: {},
          create: {
            id: `business-visa-${service.nameUz}`,
            ...service,
            categoryId: businessVisaCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Business Visa services');

    // 6. PERMANENT RESIDENCY SERVICES
    const prCat = visaSubcats[5];
    const prServices = [
      {
        nameUz: 'Ball Hisoblash',
        nameRu: 'Расчет баллов',
        nameEn: 'Points Calculation',
        shortDescription: 'PR uchun ball hisoblash va tahlil',
        fullDescription: 'Express Entry, points-based system bo\'yicha ball hisoblash, eligibility assessment.',
        priceRecommended: 500000,
        priceMin: 300000,
        priceMax: 800000,
      },
      {
        nameUz: 'Profil Yaratish',
        nameRu: 'Создание профиля',
        nameEn: 'Profile Creation',
        shortDescription: 'PR profili yaratish va tayyorlash',
        fullDescription: 'Express Entry profile yaratish, information filling, document upload, submission.',
        priceRecommended: 400000,
        priceMin: 200000,
        priceMax: 600000,
      },
      {
        nameUz: 'Hujjat Audit',
        nameRu: 'Аудит документов',
        nameEn: 'Document Audit',
        shortDescription: 'PR uchun hujjatlarni tekshirish',
        fullDescription: 'Barcha PR hujjatlarini tekshirish, compliance check, fraud detection.',
        priceRecommended: 700000,
        priceMin: 500000,
        priceMax: 1000000,
      },
      {
        nameUz: 'Strategik Immigratsion Reja',
        nameRu: 'Стратегический иммиграционный план',
        nameEn: 'Strategic Immigration Plan',
        shortDescription: 'PR uchun strategik reja tayyorlash',
        fullDescription: 'Long-term immigration strategy, pathway planning, timeline, preparation.',
        priceRecommended: 1000000,
        priceMin: 700000,
        priceMax: 1500000,
      },
    ];

    await Promise.all(
      prServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `pr-${service.nameUz}` },
          update: {},
          create: {
            id: `pr-${service.nameUz}`,
            ...service,
            categoryId: prCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 4 Permanent Residency services');

    // 7. CITIZENSHIP SERVICES
    const citizenshipCat = visaSubcats[6];
    const citizenshipServices = [
      {
        nameUz: 'Rezidentlik Muddatini Tekshirish',
        nameRu: 'Проверка периода резидентства',
        nameEn: 'Residency Period Verification',
        shortDescription: 'Fuqarolik uchun rezidentlik muddatini tekshirish',
        fullDescription: 'Residency period calculation, eligibility check, documentation requirements.',
        priceRecommended: 300000,
        priceMin: 150000,
        priceMax: 500000,
      },
      {
        nameUz: 'Hujjat Tayyorlash',
        nameRu: 'Подготовка документов',
        nameEn: 'Document Preparation',
        shortDescription: 'Fuqarolik ariyasi uchun hujjat tayyorlash',
        fullDescription: 'Citizenship application documents preparation, forms filling, supporting documents.',
        priceRecommended: 400000,
        priceMin: 250000,
        priceMax: 650000,
      },
      {
        nameUz: 'Test va Intervyu Tayyorgarligi',
        nameRu: 'Подготовка к тесту и интервью',
        nameEn: 'Test & Interview Preparation',
        shortDescription: 'Fuqarolik testi va intervyusi uchun tayyorlash',
        fullDescription: 'Citizenship test preparation, language test, civics test, interview coaching.',
        priceRecommended: 600000,
        priceMin: 400000,
        priceMax: 900000,
      },
    ];

    await Promise.all(
      citizenshipServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `citizenship-${service.nameUz}` },
          update: {},
          create: {
            id: `citizenship-${service.nameUz}`,
            ...service,
            categoryId: citizenshipCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Citizenship services');

    // ─── IMMIGRATION SERVICE TYPE SERVICES ───────────────────────────────────

    // 1. IMMIGRATION STRATEGY CONSULTING
    const strategyConsultingCat = immigrationServiceSubcatsCreated[0];
    const strategyServices = [
      {
        nameUz: 'Talaba Orqali PR Olish',
        nameRu: 'Получение PR через учебу',
        nameEn: 'PR Through Study',
        shortDescription: 'Talaba vizasi orqali PR olish strategiyasi',
        fullDescription: 'Study to PR pathway planning, university selection, program choice, timeline planning.',
        priceRecommended: 1200000,
        priceMin: 800000,
        priceMax: 1800000,
      },
      {
        nameUz: 'Ish Orqali Fuqarolik Yo\'li',
        nameRu: 'Путь к гражданству через работу',
        nameEn: 'Citizenship Through Work',
        shortDescription: 'Ish vizasi orqali fuqarolik yo\'li',
        fullDescription: 'Work visa to citizenship pathway, job search strategy, employer sponsorship, timeline.',
        priceRecommended: 1500000,
        priceMin: 1000000,
        priceMax: 2200000,
      },
      {
        nameUz: 'Oilaviy Migratsiya Rejasi',
        nameRu: 'План семейной миграции',
        nameEn: 'Family Migration Plan',
        shortDescription: 'Oila uchun migratsiya rejasi',
        fullDescription: 'Family migration strategy, sponsorship planning, multiple family members, timeline.',
        priceRecommended: 1000000,
        priceMin: 700000,
        priceMax: 1500000,
      },
    ];

    await Promise.all(
      strategyServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `strategy-${service.nameUz}` },
          update: {},
          create: {
            id: `strategy-${service.nameUz}`,
            ...service,
            categoryId: strategyConsultingCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Immigration Strategy services');

    // 2. DOCUMENT AUDIT & COMPLIANCE
    const auditCat = immigrationServiceSubcatsCreated[1];
    const auditServices = [
      {
        nameUz: 'Soxta Takliflarni Tekshirish',
        nameRu: 'Проверка поддельных предложений',
        nameEn: 'Fake Offer Detection',
        shortDescription: 'Soxta job offer va university offer tekshiruvi',
        fullDescription: 'Fraudulent job offers, fake university letters, scam detection, verification with institutions.',
        priceRecommended: 600000,
        priceMin: 400000,
        priceMax: 1000000,
      },
      {
        nameUz: 'Ish Beruvchi Legalmi?',
        nameRu: 'Является ли работодатель законным?',
        nameEn: 'Employer Legitimacy Check',
        shortDescription: 'Ish beruvchi kompaniyasini tekshirish',
        fullDescription: 'Company verification, business registration check, financial stability, legitimacy assessment.',
        priceRecommended: 700000,
        priceMin: 500000,
        priceMax: 1200000,
      },
      {
        nameUz: 'Viza Rad Sabablarini Tahlil',
        nameRu: 'Анализ причин отказа в визе',
        nameEn: 'Visa Rejection Analysis',
        shortDescription: 'Viza rad sabablarini tahlil qilish',
        fullDescription: 'Visa rejection letter analysis, reasons identification, improvement strategy, reapplication planning.',
        priceRecommended: 800000,
        priceMin: 600000,
        priceMax: 1300000,
      },
    ];

    await Promise.all(
      auditServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `audit-${service.nameUz}` },
          update: {},
          create: {
            id: `audit-${service.nameUz}`,
            ...service,
            categoryId: auditCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Document Audit services');

    // 3. APPEAL & REAPPLICATION SUPPORT
    const appealCat = immigrationServiceSubcatsCreated[2];
    const appealServices = [
      {
        nameUz: 'Viza Rad Bo\'lsa Qayta Topshirish',
        nameRu: 'Переподача после отказа в визе',
        nameEn: 'Reapplication After Rejection',
        shortDescription: 'Rad bo\'lgan vizani qayta topshirish',
        fullDescription: 'Reapplication strategy, improvement of application, addressing rejection reasons, new submission.',
        priceRecommended: 1000000,
        priceMin: 700000,
        priceMax: 1500000,
      },
      {
        nameUz: 'Appeal Strategiyasi',
        nameRu: 'Стратегия апелляции',
        nameEn: 'Appeal Strategy',
        shortDescription: 'Appeal jarayoni uchun strategiya',
        fullDescription: 'Appeal process planning, documentation, legal arguments, submission strategy.',
        priceRecommended: 1200000,
        priceMin: 900000,
        priceMax: 1800000,
      },
      {
        nameUz: 'Rad Sababini Professional Tahlil',
        nameRu: 'Профессиональный анализ причины отказа',
        nameEn: 'Professional Rejection Analysis',
        shortDescription: 'Rad sababini detailed tahlil',
        fullDescription: 'Detailed analysis of rejection reasons, legal implications, next steps, improvement plan.',
        priceRecommended: 900000,
        priceMin: 600000,
        priceMax: 1400000,
      },
    ];

    await Promise.all(
      appealServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `appeal-${service.nameUz}` },
          update: {},
          create: {
            id: `appeal-${service.nameUz}`,
            ...service,
            categoryId: appealCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Appeal & Reapplication services');

    // 4. RELOCATION SUPPORT
    const relocationCat = immigrationServiceSubcatsCreated[3];
    const relocationServices = [
      {
        nameUz: 'Uy Topish',
        nameRu: 'Поиск жилья',
        nameEn: 'Housing Search',
        shortDescription: 'Chet elda uy topish va rent',
        fullDescription: 'Housing search assistance, apartment viewing, rental agreement, moving logistics.',
        priceRecommended: 800000,
        priceMin: 500000,
        priceMax: 1200000,
      },
      {
        nameUz: 'Sug\'urta',
        nameRu: 'Страховка',
        nameEn: 'Insurance',
        shortDescription: 'Health va property sug\'urta',
        fullDescription: 'Health insurance, property insurance, travel insurance, coverage options.',
        priceRecommended: 600000,
        priceMin: 400000,
        priceMax: 1000000,
      },
      {
        nameUz: 'Bank Ochish',
        nameRu: 'Открытие банковского счета',
        nameEn: 'Bank Account Opening',
        shortDescription: 'Chet eldagi bank hisobini ochish',
        fullDescription: 'Bank account opening assistance, documentation, online banking setup, money transfer.',
        priceRecommended: 500000,
        priceMin: 300000,
        priceMax: 800000,
      },
      {
        nameUz: 'Soliq Raqami Olish',
        nameRu: 'Получение налогового номера',
        nameEn: 'Tax Number Registration',
        shortDescription: 'Soliq raqami olish va registratsiya',
        fullDescription: 'Tax number application, registration process, tax obligations, compliance.',
        priceRecommended: 400000,
        priceMin: 250000,
        priceMax: 650000,
      },
    ];

    await Promise.all(
      relocationServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `relocation-${service.nameUz}` },
          update: {},
          create: {
            id: `relocation-${service.nameUz}`,
            ...service,
            categoryId: relocationCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 4 Relocation Support services');

    // 5. CORPORATE IMMIGRATION SERVICES
    const corporateCat = immigrationServiceSubcatsCreated[4];
    const corporateServices = [
      {
        nameUz: 'Kompaniyalar Uchun Ishchi Olib Kirish',
        nameRu: 'Привлечение работников для компаний',
        nameEn: 'Corporate Worker Recruitment',
        shortDescription: 'Kompaniyalar uchun qualified ishchi topish',
        fullDescription: 'Worker recruitment, visa sponsorship, work permit application, compliance.',
        priceRecommended: 2000000,
        priceMin: 1500000,
        priceMax: 3000000,
      },
      {
        nameUz: 'Sponsorlik Tizimi',
        nameRu: 'Система спонсорства',
        nameEn: 'Sponsorship System',
        shortDescription: 'Kompaniya sponsorlik tizimini o\'rnatish',
        fullDescription: 'Sponsorship license application, system setup, compliance, ongoing management.',
        priceRecommended: 2500000,
        priceMin: 1800000,
        priceMax: 3500000,
      },
      {
        nameUz: 'Global Mobility Xizmatlari',
        nameRu: 'Услуги глобальной мобильности',
        nameEn: 'Global Mobility Services',
        shortDescription: 'Xodimlarni boshqa mamlakatga o\'tkazish',
        fullDescription: 'Employee relocation, international transfers, visa processing, compliance management.',
        priceRecommended: 3000000,
        priceMin: 2000000,
        priceMax: 5000000,
      },
    ];

    await Promise.all(
      corporateServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `corporate-${service.nameUz}` },
          update: {},
          create: {
            id: `corporate-${service.nameUz}`,
            ...service,
            categoryId: corporateCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 Corporate Immigration services');

    // 6. INTERNATIONAL LEGAL SERVICES
    const legalCat = immigrationServiceSubcatsCreated[5];
    const legalServices = [
      {
        nameUz: 'Xalqaro Advokatlar Maslahat',
        nameRu: 'Консультация международных адвокатов',
        nameEn: 'International Legal Consultation',
        shortDescription: 'Xalqaro advokatlardan maslahat olish',
        fullDescription: 'International legal consultation, case review, legal strategy, representation.',
        priceRecommended: 2000000,
        priceMin: 1500000,
        priceMax: 3500000,
      },
      {
        nameUz: 'Xalqaro Advokat Topib Berish',
        nameRu: 'Поиск международного адвоката',
        nameEn: 'International Lawyer Referral',
        shortDescription: 'Zarur xalqaro advokat topib berish',
        fullDescription: 'Lawyer referral service, network connection, case assignment, coordination.',
        priceRecommended: 1500000,
        priceMin: 1000000,
        priceMax: 2500000,
      },
      {
        nameUz: 'Yuridik Maslahat Olish',
        nameRu: 'Получение юридической консультации',
        nameEn: 'Legal Advice',
        shortDescription: 'Immigratsion qonun bo\'yicha maslahat',
        fullDescription: 'Legal advice on immigration law, visa regulations, compliance, rights and obligations.',
        priceRecommended: 1000000,
        priceMin: 700000,
        priceMax: 1500000,
      },
    ];

    await Promise.all(
      legalServices.map((service) =>
        prisma.diagnosticService.upsert({
          where: { id: `legal-${service.nameUz}` },
          update: {},
          create: {
            id: `legal-${service.nameUz}`,
            ...service,
            categoryId: legalCat.id,
            createdById: systemAdmin.id,
            isActive: true,
          },
        })
      )
    );

    console.log('✅ Created 3 International Legal services');

    console.log('\n🎉 Immigration Services seed completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 2 Main Categories');
    console.log('   - 13 Subcategories');
    console.log('   - 47 Services');
  } catch (error) {
    console.error('❌ Error seeding immigration services:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedImmigrationServices();

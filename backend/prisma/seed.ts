import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// 비밀번호 해싱 함수
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// 랜덤 날짜 생성 (오늘부터 +/- N일)
function randomDate(daysOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
}

// 랜덤 시간 생성 (09:00 ~ 18:00)
function randomTime(): Date {
  const date = new Date();
  date.setHours(9 + Math.floor(Math.random() * 10), Math.random() > 0.5 ? 0 : 30, 0, 0);
  return date;
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // ============================================
  // 1. Admin 계정 생성
  // ============================================
  console.log('👤 Creating admins...');
  const admin1 = await prisma.admin.create({
    data: {
      email: 'admin@bookingplatform.com',
      passwordHash: await hashPassword('admin123'),
      name: '플랫폼 관리자',
    },
  });

  const admin2 = await prisma.admin.create({
    data: {
      email: 'support@bookingplatform.com',
      passwordHash: await hashPassword('support123'),
      name: '지원팀 관리자',
    },
  });
  console.log(`✅ Created ${2} admins\n`);

  // ============================================
  // 2. Tenants (사장님/스토어) 생성
  // ============================================
  console.log('🏪 Creating tenants...');

  const tenantsData = [
    // 미용실 3개
    {
      slug: 'jimin-salon',
      businessName: '지민 헤어살롱',
      businessType: '미용실',
      ownerName: '김지민',
      ownerEmail: 'jimin@example.com',
      ownerPhone: '010-1234-5678',
      address: '서울시 도봉구 방학동 123-45',
      branding: {
        primaryColor: '#FF6B9D',
        secondaryColor: '#C44569',
        backgroundColor: '#FFF5F7',
        fontFamily: 'Noto Sans KR',
        layoutTemplate: 'salon',
      },
      storeInfo: {
        description: '20년 경력의 원장님이 직접 시술하는 프리미엄 헤어살롱입니다.',
        addressDetail: '1층 101호',
        phone: '02-1234-5678',
        openingHours: {
          mon: '10:00-20:00',
          tue: '10:00-20:00',
          wed: '10:00-20:00',
          thu: '10:00-20:00',
          fri: '10:00-21:00',
          sat: '09:00-19:00',
          sun: '휴무',
        },
      },
      services: [
        { category: '컷', name: '여성 컷', price: 25000, durationMinutes: 60, description: '샴푸 포함' },
        { category: '컷', name: '남성 컷', price: 20000, durationMinutes: 40, description: '샴푸 포함' },
        { category: '펌', name: '디지털펌', price: 120000, durationMinutes: 180, description: '트리트먼트 포함' },
        { category: '펌', name: '볼륨펌', price: 80000, durationMinutes: 120, description: '볼륨감 극대화' },
        { category: '염색', name: '전체 염색', price: 100000, durationMinutes: 150, description: '두피 케어 포함' },
        { category: '염색', name: '부분 염색', price: 60000, durationMinutes: 90, description: '뿌리 염색' },
        { category: '트리트먼트', name: '케라틴 트리트먼트', price: 50000, durationMinutes: 60, description: '손상모 집중 케어' },
        { category: '스타일링', name: '세팅', price: 15000, durationMinutes: 30, description: '드라이 & 아이롱' },
      ],
    },
    {
      slug: 'star-beauty',
      businessName: '스타 뷰티살롱',
      businessType: '미용실',
      ownerName: '박수진',
      ownerEmail: 'sujin@example.com',
      ownerPhone: '010-2345-6789',
      address: '서울시 도봉구 쌍문동 234-56',
      branding: {
        primaryColor: '#8E44AD',
        secondaryColor: '#9B59B6',
        backgroundColor: '#F4ECF7',
        fontFamily: 'Roboto',
        layoutTemplate: 'salon',
      },
      storeInfo: {
        description: '트렌디한 스타일링과 친절한 상담으로 고객 만족도 1위!',
        addressDetail: '2층',
        phone: '02-2345-6789',
        openingHours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '11:00-21:00',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '10:00-20:00',
          sun: '10:00-18:00',
        },
      },
      services: [
        { category: '컷', name: '프리미엄 여성 컷', price: 35000, durationMinutes: 70 },
        { category: '컷', name: '남성 가위컷', price: 25000, durationMinutes: 50 },
        { category: '펌', name: '매직스트레이트', price: 150000, durationMinutes: 210 },
        { category: '펌', name: '셋팅펌', price: 90000, durationMinutes: 120 },
        { category: '염색', name: '애쉬 염색', price: 110000, durationMinutes: 160 },
        { category: '클리닉', name: '두피 스케일링', price: 40000, durationMinutes: 50 },
      ],
    },
    {
      slug: 'modern-hair',
      businessName: '모던헤어',
      businessType: '미용실',
      ownerName: '최현우',
      ownerEmail: 'hyunwoo@example.com',
      ownerPhone: '010-3456-7890',
      address: '서울시 도봉구 창동 345-67',
      branding: {
        primaryColor: '#2C3E50',
        secondaryColor: '#34495E',
        backgroundColor: '#ECF0F1',
        fontFamily: 'Pretendard',
        layoutTemplate: 'default',
      },
      storeInfo: {
        description: '모던하고 세련된 헤어스타일을 제안합니다.',
        addressDetail: '지하 1층',
        phone: '02-3456-7890',
        openingHours: {
          mon: '10:00-20:00',
          tue: '10:00-20:00',
          wed: '10:00-20:00',
          thu: '10:00-20:00',
          fri: '10:00-21:00',
          sat: '09:00-19:00',
          sun: '휴무',
        },
      },
      services: [
        { category: '컷', name: '디자이너 컷', price: 30000, durationMinutes: 60 },
        { category: '컷', name: '스포츠 컷', price: 18000, durationMinutes: 30 },
        { category: '펌', name: '히피펌', price: 95000, durationMinutes: 150 },
        { category: '염색', name: '탈색 + 염색', price: 180000, durationMinutes: 240 },
        { category: '클리닉', name: '헤어 클리닉', price: 35000, durationMinutes: 45 },
      ],
    },

    // 필라테스 2개
    {
      slug: 'core-pilates',
      businessName: '코어 필라테스 스튜디오',
      businessType: '필라테스',
      ownerName: '이서연',
      ownerEmail: 'seoyeon@example.com',
      ownerPhone: '010-4567-8901',
      address: '서울시 도봉구 방학동 456-78',
      branding: {
        primaryColor: '#27AE60',
        secondaryColor: '#2ECC71',
        backgroundColor: '#E8F8F5',
        fontFamily: 'Montserrat',
        layoutTemplate: 'pt',
      },
      storeInfo: {
        description: '소수 정예 1:1 맞춤 필라테스 수업',
        addressDetail: '3층 301호',
        phone: '02-4567-8901',
        openingHours: {
          mon: '07:00-21:00',
          tue: '07:00-21:00',
          wed: '07:00-21:00',
          thu: '07:00-21:00',
          fri: '07:00-21:00',
          sat: '08:00-18:00',
          sun: '08:00-16:00',
        },
      },
      services: [
        { category: '개인', name: '1:1 개인 레슨 (1회)', price: 70000, durationMinutes: 50 },
        { category: '개인', name: '1:1 개인 레슨 (10회)', price: 650000, durationMinutes: 50 },
        { category: '그룹', name: '2:1 듀엣 레슨 (1회)', price: 50000, durationMinutes: 50 },
        { category: '그룹', name: '소그룹 레슨 (4인)', price: 35000, durationMinutes: 50 },
        { category: '특별', name: '산전/산후 필라테스', price: 80000, durationMinutes: 60 },
        { category: '특별', name: '재활 필라테스', price: 85000, durationMinutes: 60 },
      ],
    },
    {
      slug: 'balance-pilates',
      businessName: '밸런스 필라테스',
      businessType: '필라테스',
      ownerName: '정민지',
      ownerEmail: 'minji@example.com',
      ownerPhone: '010-5678-9012',
      address: '서울시 도봉구 쌍문동 567-89',
      branding: {
        primaryColor: '#E74C3C',
        secondaryColor: '#C0392B',
        backgroundColor: '#FADBD8',
        fontFamily: 'Noto Sans KR',
        layoutTemplate: 'pt',
      },
      storeInfo: {
        description: '몸과 마음의 균형을 찾는 힐링 필라테스',
        addressDetail: '2층',
        phone: '02-5678-9012',
        openingHours: {
          mon: '06:00-22:00',
          tue: '06:00-22:00',
          wed: '06:00-22:00',
          thu: '06:00-22:00',
          fri: '06:00-22:00',
          sat: '07:00-19:00',
          sun: '휴무',
        },
      },
      services: [
        { category: '개인', name: '프라이빗 레슨', price: 75000, durationMinutes: 55 },
        { category: '그룹', name: '그룹 레슨 (6인)', price: 30000, durationMinutes: 55 },
        { category: '특별', name: '체형 교정 프로그램', price: 90000, durationMinutes: 70 },
        { category: '패키지', name: '20회 패키지', price: 1300000, durationMinutes: 55 },
      ],
    },

    // 네일샵 1개
    {
      slug: 'nailart-studio',
      businessName: '네일아트 스튜디오',
      businessType: '네일샵',
      ownerName: '한예슬',
      ownerEmail: 'yeseul@example.com',
      ownerPhone: '010-6789-0123',
      address: '서울시 도봉구 창동 678-90',
      branding: {
        primaryColor: '#F39C12',
        secondaryColor: '#E67E22',
        backgroundColor: '#FEF5E7',
        fontFamily: 'Nanum Gothic',
        layoutTemplate: 'nail',
      },
      storeInfo: {
        description: '트렌디한 네일아트와 정성스러운 케어',
        addressDetail: '1층',
        phone: '02-6789-0123',
        openingHours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '휴무',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '10:00-20:00',
          sun: '10:00-19:00',
        },
      },
      services: [
        { category: '기본', name: '젤 네일 (손)', price: 40000, durationMinutes: 90 },
        { category: '기본', name: '젤 네일 (발)', price: 50000, durationMinutes: 100 },
        { category: '아트', name: '원톤 + 아트 (3개)', price: 55000, durationMinutes: 110 },
        { category: '아트', name: '풀 아트', price: 80000, durationMinutes: 150 },
        { category: '케어', name: '네일 케어', price: 25000, durationMinutes: 50 },
        { category: '케어', name: '페디큐어', price: 35000, durationMinutes: 60 },
        { category: '특수', name: '젤 제거', price: 15000, durationMinutes: 30 },
        { category: '특수', name: '속눈썹 연장', price: 60000, durationMinutes: 90 },
      ],
    },

    // 마사지샵 1개
    {
      slug: 'healing-massage',
      businessName: '힐링 마사지',
      businessType: '마사지',
      ownerName: '오태양',
      ownerEmail: 'taeyang@example.com',
      ownerPhone: '010-7890-1234',
      address: '서울시 도봉구 방학동 789-01',
      branding: {
        primaryColor: '#16A085',
        secondaryColor: '#1ABC9C',
        backgroundColor: '#E8F6F3',
        fontFamily: 'Noto Serif KR',
        layoutTemplate: 'default',
      },
      storeInfo: {
        description: '전문 테라피스트의 힐링 마사지로 피로 회복',
        addressDetail: '2층 201호',
        phone: '02-7890-1234',
        openingHours: {
          mon: '10:00-22:00',
          tue: '10:00-22:00',
          wed: '10:00-22:00',
          thu: '10:00-22:00',
          fri: '10:00-23:00',
          sat: '10:00-23:00',
          sun: '10:00-21:00',
        },
      },
      services: [
        { category: '타이', name: '타이 마사지 60분', price: 70000, durationMinutes: 60 },
        { category: '타이', name: '타이 마사지 90분', price: 100000, durationMinutes: 90 },
        { category: '아로마', name: '아로마 마사지 60분', price: 80000, durationMinutes: 60 },
        { category: '아로마', name: '아로마 마사지 90분', price: 110000, durationMinutes: 90 },
        { category: '스포츠', name: '스포츠 마사지', price: 90000, durationMinutes: 70 },
        { category: '발', name: '발 마사지', price: 50000, durationMinutes: 50 },
        { category: '특별', name: '커플 마사지', price: 180000, durationMinutes: 90 },
      ],
    },

    // PT센터 1개
    {
      slug: 'power-pt',
      businessName: '파워 PT센터',
      businessType: 'PT',
      ownerName: '강철수',
      ownerEmail: 'chulsu@example.com',
      ownerPhone: '010-8901-2345',
      address: '서울시 도봉구 쌍문동 890-12',
      branding: {
        primaryColor: '#E67E22',
        secondaryColor: '#D35400',
        backgroundColor: '#FEF9E7',
        fontFamily: 'Roboto',
        layoutTemplate: 'pt',
      },
      storeInfo: {
        description: '체계적인 1:1 PT로 목표 달성 보장',
        addressDetail: '지하 1층',
        phone: '02-8901-2345',
        openingHours: {
          mon: '06:00-23:00',
          tue: '06:00-23:00',
          wed: '06:00-23:00',
          thu: '06:00-23:00',
          fri: '06:00-23:00',
          sat: '07:00-20:00',
          sun: '07:00-18:00',
        },
      },
      services: [
        { category: '개인', name: '1:1 PT (1회)', price: 80000, durationMinutes: 60 },
        { category: '개인', name: '1:1 PT (10회)', price: 750000, durationMinutes: 60 },
        { category: '개인', name: '1:1 PT (20회)', price: 1400000, durationMinutes: 60 },
        { category: '그룹', name: '2:1 PT (1회)', price: 55000, durationMinutes: 60 },
        { category: '특별', name: '체성분 분석', price: 20000, durationMinutes: 30 },
        { category: '특별', name: '식단 관리 (1개월)', price: 100000, durationMinutes: 30 },
      ],
    },
  ];

  const tenants: any[] = [];
  for (const tenantData of tenantsData) {
    const tenant = await prisma.tenant.create({
      data: {
        slug: tenantData.slug,
        businessName: tenantData.businessName,
        businessType: tenantData.businessType,
        ownerName: tenantData.ownerName,
        ownerEmail: tenantData.ownerEmail,
        ownerPhone: tenantData.ownerPhone,
        passwordHash: await hashPassword('password123'),
        address: tenantData.address,
        subscriptionPlan: 'basic',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        subscriptionEndDate: randomDate(365),
        status: 'active',
      },
    });

    // Branding
    await prisma.tenantBranding.create({
      data: {
        tenantId: tenant.id,
        ...tenantData.branding,
      },
    });

    // Store Info
    await prisma.storeInfo.create({
      data: {
        tenantId: tenant.id,
        description: tenantData.storeInfo.description,
        addressDetail: tenantData.storeInfo.addressDetail,
        phone: tenantData.storeInfo.phone,
        openingHours: tenantData.storeInfo.openingHours,
      },
    });

    // Services
    const services: any[] = [];
    for (let i = 0; i < tenantData.services.length; i++) {
      const service = await prisma.service.create({
        data: {
          tenantId: tenant.id,
          ...tenantData.services[i],
          displayOrder: i,
          isActive: true,
        },
      });
      services.push(service);
    }

    // Holidays (각 테넌트당 4-5개)
    const holidayDates = [
      randomDate(10),
      randomDate(15),
      randomDate(30),
      randomDate(45),
      randomDate(60),
    ];
    for (const holidayDate of holidayDates) {
      await prisma.holiday.create({
        data: {
          tenantId: tenant.id,
          holidayDate,
          reason: Math.random() > 0.5 ? '개인 사정' : '정기 휴무',
        },
      });
    }

    tenants.push({ tenant, services });
  }
  console.log(`✅ Created ${tenants.length} tenants with branding, store info, services, and holidays\n`);

  // ============================================
  // 3. Customers & Bookings 생성
  // ============================================
  console.log('👥 Creating customers and bookings...');

  const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '오', '한', '서', '신', '권'];
  const secondNames = ['민준', '서준', '지호', '주원', '도윤', '시우', '하준', '지우', '지훈', '준서', '서연', '지은', '수빈', '예은', '지유', '서현', '민서', '하은', '채원', '다은'];

  let totalCustomers = 0;
  let totalBookings = 0;

  for (const { tenant, services } of tenants) {
    // 각 테넌트당 15-20명의 고객 생성
    const numCustomers = 15 + Math.floor(Math.random() * 6);
    const customers: any[] = [];

    for (let i = 0; i < numCustomers; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const secondName = secondNames[Math.floor(Math.random() * secondNames.length)];
      const name = `${firstName}${secondName}`;
      const phone = `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      const customer = await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          name,
          phone,
          email: Math.random() > 0.5 ? `${name.toLowerCase()}@example.com` : undefined,
          totalBookings: 0,
          memo: Math.random() > 0.7 ? '단골 고객' : undefined,
        },
      });
      customers.push(customer);
      totalCustomers++;
    }

    // 각 테넌트당 30-50개의 예약 생성
    const numBookings = 30 + Math.floor(Math.random() * 21);
    for (let i = 0; i < numBookings; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const service = services[Math.floor(Math.random() * services.length)];

      // 과거 ~ 미래 예약
      const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 ~ +30일
      const bookingDate = randomDate(daysOffset);
      const bookingTime = randomTime();

      // 상태 결정 (과거는 completed, 미래는 pending/confirmed)
      let status: string;
      let paymentStatus: string;
      if (daysOffset < 0) {
        // 과거 예약
        status = Math.random() > 0.1 ? 'completed' : 'cancelled';
        paymentStatus = status === 'completed' ? 'paid' : 'refunded';
      } else {
        // 미래 예약
        const rand = Math.random();
        if (rand > 0.7) {
          status = 'confirmed';
          paymentStatus = 'paid';
        } else if (rand > 0.3) {
          status = 'pending';
          paymentStatus = 'pending';
        } else {
          status = 'cancelled';
          paymentStatus = 'refunded';
        }
      }

      const booking = await prisma.booking.create({
        data: {
          tenantId: tenant.id,
          serviceId: service.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          bookingDate,
          bookingTime,
          durationMinutes: service.durationMinutes,
          status,
          paymentStatus,
          totalPrice: service.price,
          specialRequest: Math.random() > 0.8 ? '주차 가능한가요?' : undefined,
          cancelledAt: status === 'cancelled' ? randomDate(daysOffset + 1) : undefined,
          cancelledBy: status === 'cancelled' ? (Math.random() > 0.5 ? 'customer' : 'tenant') : undefined,
        },
      });

      // Payment 생성 (paid 또는 refunded인 경우)
      if (paymentStatus === 'paid' || paymentStatus === 'refunded') {
        await prisma.payment.create({
          data: {
            tenantId: tenant.id,
            bookingId: booking.id,
            amount: service.price,
            paymentMethod: Math.random() > 0.5 ? 'card' : 'simple_pay',
            paymentGateway: 'portone',
            transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            status: paymentStatus === 'paid' ? 'completed' : 'refunded',
            paidAt: paymentStatus === 'paid' ? randomDate(daysOffset - 1) : undefined,
            refundedAt: paymentStatus === 'refunded' ? randomDate(daysOffset + 1) : undefined,
            refundAmount: paymentStatus === 'refunded' ? service.price : undefined,
          },
        });
      }

      // Customer의 totalBookings 업데이트
      if (status === 'completed') {
        await prisma.customer.update({
          where: { id: customer.id },
          data: { totalBookings: { increment: 1 } },
        });
      }

      totalBookings++;
    }

    // 각 테넌트당 몇 개의 알림 생성
    const recentBookings = await prisma.booking.findMany({
      where: { tenantId: tenant.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    for (const booking of recentBookings) {
      await prisma.notification.create({
        data: {
          tenantId: tenant.id,
          bookingId: booking.id,
          type: 'booking_created',
          message: `새로운 예약이 등록되었습니다. (${booking.customerName})`,
          isRead: Math.random() > 0.5,
        },
      });
    }
  }

  console.log(`✅ Created ${totalCustomers} customers`);
  console.log(`✅ Created ${totalBookings} bookings with payments\n`);

  // ============================================
  // 통계 출력
  // ============================================
  console.log('📊 Database seeding completed!\n');
  console.log('='.repeat(50));
  console.log('Summary:');
  console.log('='.repeat(50));
  console.log(`👤 Admins: 2`);
  console.log(`🏪 Tenants: ${tenants.length}`);
  console.log(`🎨 Tenant Brandings: ${tenants.length}`);
  console.log(`📋 Store Infos: ${tenants.length}`);
  console.log(`🛍️  Services: ${tenants.reduce((sum, t) => sum + t.services.length, 0)}`);
  console.log(`🗓️  Holidays: ${tenants.length * 5}`);
  console.log(`👥 Customers: ${totalCustomers}`);
  console.log(`📅 Bookings: ${totalBookings}`);
  console.log(`💳 Payments: ~${Math.floor(totalBookings * 0.7)}`);
  console.log(`🔔 Notifications: ~${tenants.length * 5}`);
  console.log('='.repeat(50));
  console.log('\n✨ All done! You can now login with:');
  console.log('   Admin: admin@bookingplatform.com / admin123');
  console.log('   Tenant: jimin@example.com / password123');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

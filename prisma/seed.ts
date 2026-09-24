import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PASSWORD = "123456";

const USERS = [
  {
    name: "سلطان الشيباني",
    email: "sultan@shopely.shop",
    phone: "+218 91 234 5678",
    city: "طرابلس",
    storeName: "تكنو طرابلس",
    bio: "متخصص في الأجهزة الإلكترونية الأصلية من طرابلس، نبيع الجديد والمستعمل بحالة ممتازة مع ضمان.",
  },
  {
    name: "عمر بن عاشور",
    email: "omar@shopely.shop",
    phone: "+218 92 345 6789",
    city: "بنغازي",
    storeName: "عقارات بنغازي",
    bio: "مستشار عقاري من بنغازي، نوفر شققاً وفيلات للبيع والإيجار بأسعار منافسة في كل المدن الشرقية.",
  },
  {
    name: "نورة الجربي",
    email: "noura@shopely.shop",
    phone: "+218 93 456 7890",
    city: "مصراتة",
    storeName: "نورة للأثاث مصراتة",
    bio: "أثاث منزلي فاخر ومستعمل بحالة جيدة، توصيل لجميع مناطق الساحل الليبي.",
  },
  {
    name: "خالد الفرجاني",
    email: "khalid@shopely.shop",
    phone: "+218 94 567 8901",
    city: "طرابلس",
    storeName: "سوق الفرجاني للسيارات",
    bio: "بيع وشراء السيارات المستعملة في طرابلس، فحص شامل قبل البيع وتسهيلات في الدفع.",
  },
  {
    name: "لينا الكركي",
    email: "lina@shopely.shop",
    phone: "+218 95 678 9012",
    city: "زليتن",
    storeName: "لمسات لينا زليتن",
    bio: "أزياء وإكسسوارات نسائية منتقاة بعناية، وشحن لكل المدن الليبية خلال 24 ساعة.",
  },
];

type SeedListing = {
  userIdx: number;
  title: string;
  price: number;
  negotiable: boolean;
  condition: "new" | "used" | "refurb";
  category: string;
  city: string;
  featured: boolean;
  views: number;
  daysAgo: number;
  description: string;
};

const LISTINGS: SeedListing[] = [
  {
    userIdx: 0,
    title: "آيفون 15 برو ماكس 256 جيجا - فضي جديد بكرتونه",
    price: 4650,
    negotiable: true,
    condition: "new",
    category: "phones",
    city: "طرابلس",
    featured: true,
    views: 1204,
    daysAgo: 1,
    description:
      "للبيع آيفون 15 برو ماكس 256 جيجا لون فضي تيتانيوم.\n\nالحالة: جديد لم يفتح من الكرتون مع الفاتورة.\n\nالتفاصيل:\n• شاشة 6.7 بوصة Super Retina XDR\n• معالج A17 Pro\n• كاميرا احترافية 48 ميجا\n• البطارية 100%\n\nالسعر بالدينار الليبي، والشحن متاح لكل المدن على حساب المشتري. التفاوض مرغوب ضمن حدود المعقول 😄",
  },
  {
    userIdx: 0,
    title: "ماك بوك إير M2 13 بوصة - 8جيجا/256جيجا",
    price: 3200,
    negotiable: false,
    condition: "refurb",
    category: "electronics",
    city: "طرابلس",
    featured: true,
    views: 845,
    daysAgo: 2,
    description:
      "ماك بوك إير M2 13 بوصة مجدد بالكامل.\n\nالمواصفات:\n• شريحة M2 بثمانية أنوية\n• 8 جيجا رام / 256 جيجا SSD\n• البطارية تدوم حتى 18 ساعة\n\nيأتي مع علبة وكابل شحن، ضمان 6 أشهر. الحالة ممتازة كالجديد تماماً. البيع نقداً بالدينار.",
  },
  {
    userIdx: 0,
    title: "ساعة أبل Watch Ultra 2 - مع ملحقات",
    price: 1850,
    negotiable: true,
    condition: "used",
    category: "electronics",
    city: "طرابلس",
    featured: false,
    views: 321,
    daysAgo: 4,
    description:
      "ساعة أبل Watch Ultra 2 بحالة ممتازة، تم شراؤها قبل 6 أشهر فقط.\n\nيشمل:\n• سوار رياضي\n• سوار أضافي\n• الشاحن الأصلي\n\nالبطارية صحية 97%. لا يوجد أي خدوش على الشاشة لأن عليها طبقة حماية.",
  },
  {
    userIdx: 4,
    title: "حقيبة يد أصلية فاخرة - مستعملة بحالة ممتازة",
    price: 2800,
    negotiable: true,
    condition: "used",
    category: "fashion",
    city: "زليتن",
    featured: true,
    views: 540,
    daysAgo: 3,
    description:
      "حقيبة يد فاخرة أصلية 100% بحالة شبه جديدة، استُخدمت مرتين فقط.\n\nالبيع لا يشمل غسيلاً إضافياً، الحقيبة جاهزة للاستخدام. الجادون فقط للتشاور عبر الدردشة.",
  },
  {
    userIdx: 4,
    title: "فستان سهرة فاخر مقاس M - لمسات تصميم راقي",
    price: 850,
    negotiable: true,
    condition: "new",
    category: "fashion",
    city: "زليتن",
    featured: false,
    views: 210,
    daysAgo: 5,
    description:
      "فستان سهرة بتصميم أنيق ولون لافندر ناعم.\n\nالمميزات:\n• خامة شيفون فاخرة\n• تفصيل ضيق مع قصة حرة عند الأطراف\n• مناسب للمناسبات والسهرات\n\nالمقاس M مع إمكانية التعديل حسب الطلب. اكتبي مقاسك في الدردشة ويتم الشحن خلال 3 أيام.",
  },
  {
    userIdx: 2,
    title: "كنب زاوية سحاري 7 مقاعد - خشب سندياني",
    price: 2400,
    negotiable: true,
    condition: "used",
    category: "furniture",
    city: "مصراتة",
    featured: true,
    views: 689,
    daysAgo: 6,
    description:
      "كنب زاوية 7 مقاعد بحالة ممتازة جداً.\n\nالتفاصيل:\n• خشب سندياني أصلي\n• قماش مايكروفايبر مقاوم للاتساخ\n• معه 6 مخدات\n\nالبيع بسبب السفر، والقيمة الحقيقية جديدة 6000 د.ل. التوصيل داخل مصراتة والخمس مجاناً.",
  },
  {
    userIdx: 2,
    title: "غرفة نوم كاملة - سرير + دولاب + 2 طاولة",
    price: 3100,
    negotiable: true,
    condition: "used",
    category: "furniture",
    city: "مصراتة",
    featured: false,
    views: 455,
    daysAgo: 8,
    description:
      "غرفة نوم كاملة للبيع بحالة جيدة.\n\nتشمل:\n• سرير كينج مع مرتبة شبه جديدة\n• دولاب 6 أبواب كبير\n• طاولتين جانبيتين\n\nالتركيب والتحميل على المشتري، أو نتفق على سعر توصيل مناسب. البيع مستعجل بسبب انتقالنا.",
  },
  {
    userIdx: 2,
    title: "طقم سفرة 6 مقاعد - مودرن",
    price: 1200,
    negotiable: true,
    condition: "used",
    category: "furniture",
    city: "الخمس",
    featured: false,
    views: 198,
    daysAgo: 12,
    description:
      "طقم سفرة عصري 6 كراسي + الطاولة مع زجاج علوي.\n\nالحالة: جيدة جداً، ألوان محايدة تناسب كل الديكورات.\n\nالسعر قابل للتفاوض عند الشراء اليوم. المكان: الخمس وسط المدينة.",
  },
  {
    userIdx: 3,
    title: "تويوتا كامري 2021 - فل كامل بحالة ممتازة",
    price: 78000,
    negotiable: true,
    condition: "used",
    category: "vehicles",
    city: "طرابلس",
    featured: true,
    views: 1940,
    daysAgo: 2,
    description:
      "للبيع كامري 2021 فل كامل، لون أسود، مواصفات ليبية.\n\nالمواصفات:\n• ماشية 48000 كم فقط\n• الصيانة الدورية موثقة\n• شاشة ومواصفات كاملة\n• هيكل نظيف\n\nالفحص متوفر، والسيارة نظيفة من الداخل والخارج. البيع على السوم الجاد.",
  },
  {
    userIdx: 3,
    title: "تويوتا هايلكس دبل 2020 ديزل",
    price: 85000,
    negotiable: false,
    condition: "used",
    category: "vehicles",
    city: "بنغازي",
    featured: false,
    views: 1330,
    daysAgo: 5,
    description:
      "هايلكس دبل 2020 ديزل 4x4.\n\nالمميزات:\n• ماشية 62000 كم\n• صندوق فل، كبينة دبل\n• كفرات جديدة\n\nالسيارة مستخدمة للعمل في الصحراء وحالتها جيدة، هناك خشونة خفيفة بالصدام الخلفي — السعر يشمل ذلك. غير قابل للتفاوض.",
  },
  {
    userIdx: 3,
    title: "دراجة جبلية 4x4 - بحالة ممتازة",
    price: 4200,
    negotiable: true,
    condition: "used",
    category: "vehicles",
    city: "طرابلس",
    featured: false,
    views: 402,
    daysAgo: 9,
    description:
      "دراجة جبلية 4x4 بحالة ممتازة.\n\nالتفاصيل:\n• 250 سي سي\n• سوستة أصلية على 4 أرجل\n• مناسبة للرمل والصحراء\n\nتم تحميلها للبر فقط. نظيفة جداً وتعمل بشكل ممتاز.",
  },
  {
    userIdx: 1,
    title: "شقة إيجار سنوي - وسط بنغازي - 3 غرف",
    price: 9000,
    negotiable: true,
    condition: "new",
    category: "real-estate",
    city: "بنغازي",
    featured: true,
    views: 1120,
    daysAgo: 1,
    description:
      "شقة للإيجار السنوي في بنغازي.\n\nالمواصفات:\n• 3 غرف + صالتين + 2 حمامات\n• مكيفات سبيلت\n• مطبخ جاهز\n\nالعقار مؤثث وكامل التشطيب. التواصل عبر الدردشة للجادين.",
  },
  {
    userIdx: 1,
    title: "فيلا للبيع في ضاحية قصر بن غشير - 380م",
    price: 1850000,
    negotiable: true,
    condition: "new",
    category: "real-estate",
    city: "طرابلس",
    featured: true,
    views: 2600,
    daysAgo: 3,
    description:
      "فيلا للبيع في قصر بن غشير مساحة 380م.\n\nالمميزات:\n• دورين + ملحق خارجي\n• مساحة خارجية واسعة\n• تشطيب راقي\n\nالمنطقة مرغوبة وجميع الخدمات قريبة. البيع نقداً فقط أو تقسيط متاح بشرط الموافقة.",
  },
  {
    userIdx: 1,
    title: "أرض تجارية للاستثمار - طرابلس الكبرى",
    price: 950000,
    negotiable: true,
    condition: "new",
    category: "real-estate",
    city: "طرابلس",
    featured: false,
    views: 733,
    daysAgo: 7,
    description:
      "أرض تجارية مساحة 1200م على طريق سريع حيوي.\n\nمناسبة لـ:\n• معرض سيارات\n• مخزن تجاري\n• مجمع تجاري صغير\n\nالملكية واضحة وتصريح الرخص متاح. جاهزون للتفاوض الجاد.",
  },
  {
    userIdx: 0,
    title: "شاشة سمارت 65 بوصة 4K - سامسونج CU8500",
    price: 1450,
    negotiable: true,
    condition: "used",
    category: "home-appliances",
    city: "طرابلس",
    featured: false,
    views: 387,
    daysAgo: 6,
    description:
      "شاشة سامسونج 65 بوصة 4K موديل CU8500.\n\nالحالة: ممتازة، بدون أي خدوش، مع الريموت.\n\nمناسبة للبيت أو المجلس، الوضوح ممتاز مع الصوت المحيطي. السعر قابل للتفاوض الخفيف.",
  },
  {
    userIdx: 0,
    title: "بلايستيشن 5 ديجيتال - مع يد أصلية إضافية",
    price: 1400,
    negotiable: true,
    condition: "used",
    category: "gaming",
    city: "طرابلس",
    featured: false,
    views: 912,
    daysAgo: 2,
    description:
      "بلايستيشن 5 ديجيتال بحالة ممتازة.\n\nيأتي مع:\n• يد أصلية إضافية\n• شاحن لليدين\n• كرت نفخ قوي\n\nتم شراؤه مع الفاتورة. البيع فقط لأني مسافر. الجادون يسألوا في الدردشة فوراً.",
  },
  {
    userIdx: 4,
    title: "دراجة جبلية 21 سرعة - شبه جديدة",
    price: 750,
    negotiable: true,
    condition: "used",
    category: "sports",
    city: "زليتن",
    featured: false,
    views: 260,
    daysAgo: 10,
    description:
      "دراجة جبلية ماركة مستوردة 21 سرعة.\n\nالحالة: شبه جديدة مع فرامل قرصية.\n\nمناسبة لكل الأعمار. البيع يشمل خوذة وقفازات تقريباً جديدة.",
  },
  {
    userIdx: 4,
    title: "قط شيرازي عمر سنة - ملقى ومتعلم",
    price: 600,
    negotiable: true,
    condition: "new",
    category: "pets",
    city: "زليتن",
    featured: false,
    views: 340,
    daysAgo: 4,
    description:
      "قط شيرازي ذكر عمره سنة، ملقى ومتعود على الصندوق.\n\nمطعم كل اللقاحات.\n\nيناسب منزل هادئ، والسعر قابل للتفاوض الخفيف للمحبة الحقيقية للقطط.",
  },
  {
    userIdx: 4,
    title: "دورة تصميم مواقع احترافية - 3 شهور",
    price: 990,
    negotiable: false,
    condition: "new",
    category: "services",
    city: "زليتن",
    featured: false,
    views: 178,
    daysAgo: 3,
    description:
      "دورة تصميم مواقع كاملة أونلاين لمدة 3 شهور.\n\nماذا ستتعلم:\n• أساسيات HTML/CSS\n• JavaScript عملي\n• بناء متجرك الخاص\n\nمع شهادة إتمام ومشروع تخرج حقيقي. بث مباشر مرتين أسبوعياً مع التسجيلات.",
  },
  {
    userIdx: 4,
    title: "مجموعة روايات عربية نادرة - 25 كتاب",
    price: 450,
    negotiable: true,
    condition: "used",
    category: "books",
    city: "زليتن",
    featured: false,
    views: 120,
    daysAgo: 11,
    description:
      "مجموعة 25 رواية عربية معاصرة بحالة ممتازة.\n\nتشمل أعمال نجيب محفوظ، أحمد خالد توفيق، وغيرهم.\n\nالبيع مستعجل بسبب السفر للخارج. سعر الكل 450 د.ل فقط.",
  },
];

async function main() {
  console.log("Seeding SHOPELY demo data...");

  await prisma.favorite.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash(PASSWORD, 10);

  const createdUsers = [];
  for (const u of USERS) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        phone: u.phone,
        city: u.city,
        storeName: u.storeName,
        bio: u.bio,
        passwordHash: hash,
        avatar: `https://i.pravatar.cc/300?u=${u.email}`,
      },
    });
    createdUsers.push(user);
  }

  for (const l of LISTINGS) {
    const seedId = `shopely-${l.title.split(" ").slice(0, 3).join("-")}`.replace(/[^\w\u0600-\u06FF-]/g, "");
    await prisma.listing.create({
      data: {
        title: l.title,
        slug: `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        description: l.description,
        price: l.price,
        negotiable: l.negotiable,
        condition: l.condition,
        category: l.category,
        city: l.city,
        images: [
          `https://picsum.photos/seed/${seedId}-1/900/700`,
          `https://picsum.photos/seed/${seedId}-2/900/700`,
          `https://picsum.photos/seed/${seedId}-3/900/700`,
        ].join("|"),
        featured: l.featured,
        views: l.views,
        userId: createdUsers[l.userIdx].id,
        createdAt: new Date(Date.now() - l.daysAgo * 86400000),
      },
    });
  }

  await Promise.all([
    prisma.chat.create({
      data: {
        listingId: (await prisma.listing.findFirst({ where: { featured: true } }))!.id,
        buyerId: createdUsers[1].id,
        sellerId: createdUsers[0].id,
        messages: {
          create: [
            {
              senderId: createdUsers[1].id,
              text: "السلام عليكم، هل السعر نهائي؟",
              createdAt: new Date(Date.now() - 3600000),
            },
            {
              senderId: createdUsers[0].id,
              text: "وعليكم السلام، نقدر نتفاوض على المبلغ لو كان جاد 👌",
              createdAt: new Date(Date.now() - 1800000),
            },
            {
              senderId: createdUsers[1].id,
              text: "تمام، بسعر 4200 د.ل يهمني؟",
              createdAt: new Date(Date.now() - 900000),
            },
          ],
        },
      },
    }),
  ]);

  console.log(`
✅ SHOPELY seeded successfully!

دخول تجريبي (كلمة المرور للجميع: ${PASSWORD}):
${USERS.map((u) => `  ${u.name} (${u.phone}) : ${u.email}`).join("\n")}

عدد الإعلانات: ${LISTINGS.length} | محادثة تجريبية جاهزة.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
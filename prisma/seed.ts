import bcrypt from "bcryptjs";
import { Category, Exam, Ownership, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CitySeed = {
  city: string;
  state: string;
};

const cities: CitySeed[] = [
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Mysuru", state: "Karnataka" },
  { city: "Mangaluru", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Warangal", state: "Telangana" },
  { city: "Delhi", state: "Delhi" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Kota", state: "Rajasthan" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Vadodara", state: "Gujarat" },
  { city: "Surat", state: "Gujarat" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Durgapur", state: "West Bengal" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Rourkela", state: "Odisha" },
  { city: "Patna", state: "Bihar" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Kochi", state: "Kerala" },
  { city: "Amritsar", state: "Punjab" },
  { city: "Dehradun", state: "Uttarakhand" },
  { city: "Guwahati", state: "Assam" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Jammu", state: "Jammu and Kashmir" },
  { city: "Srinagar", state: "Jammu and Kashmir" },
  { city: "Goa", state: "Goa" },
];

const courseCatalog = [
  { name: "B.Tech Computer Science and Engineering", duration: "4 Years" },
  { name: "B.Tech Information Technology", duration: "4 Years" },
  { name: "B.Tech Electronics and Communication Engineering", duration: "4 Years" },
  { name: "B.Tech Mechanical Engineering", duration: "4 Years" },
  { name: "B.Tech Civil Engineering", duration: "4 Years" },
  { name: "B.Tech Electrical Engineering", duration: "4 Years" },
  { name: "B.Tech Artificial Intelligence and Data Science", duration: "4 Years" },
  { name: "B.Tech Biotechnology", duration: "4 Years" },
  { name: "B.Arch", duration: "5 Years" },
  { name: "MBA", duration: "2 Years" },
];

const recruiters = [
  "Google",
  "Microsoft",
  "Amazon",
  "Adobe",
  "Flipkart",
  "Goldman Sachs",
  "Morgan Stanley",
  "Deloitte",
  "Accenture",
  "Infosys",
  "TCS",
  "Wipro",
  "Paytm",
  "Zomato",
  "NVIDIA",
  "Samsung R&D",
  "Qualcomm",
  "Oracle",
  "Cognizant",
  "Bosch",
];

const reviewTemplates = [
  "The campus life is vibrant and the faculty are approachable. Placements are consistent and the coding culture is strong.",
  "Academics are rigorous and the infrastructure is good. Some hostels need improvement, but overall value for money is excellent.",
  "This college offers solid industry exposure, strong alumni support, and internship opportunities in product companies.",
  "Labs are modern, student clubs are active, and the placement training team is genuinely helpful for final-year students.",
  "A balanced college with good academics, decent faculty support, and an improving placement record across core and tech roles.",
  "The college stands out for its peer group, hackathon culture, and practical curriculum. Fees are justified by outcomes.",
  "Campus facilities are reliable and the professors are knowledgeable. Recruiters visit regularly for both internships and jobs.",
];

const userSeeds = [
  "Aarav Sharma",
  "Ananya Gupta",
  "Vivaan Reddy",
  "Ishita Nair",
  "Aditya Verma",
  "Sneha Iyer",
  "Rohan Mehta",
  "Diya Kapoor",
  "Karthik Rao",
  "Priya Singh",
  "Arjun Bhat",
  "Meera Joshi",
  "Nikhil Patil",
  "Saanvi Jain",
  "Yash Malhotra",
  "Aditi Kulkarni",
  "Krishna Das",
  "Tanya Bansal",
  "Harsh Vyas",
  "Neha Chawla",
];

const iitNames = [
  "Indian Institute of Technology Bombay",
  "Indian Institute of Technology Delhi",
  "Indian Institute of Technology Madras",
  "Indian Institute of Technology Kanpur",
  "Indian Institute of Technology Kharagpur",
  "Indian Institute of Technology Roorkee",
  "Indian Institute of Technology Guwahati",
  "Indian Institute of Technology Hyderabad",
  "Indian Institute of Technology BHU",
  "Indian Institute of Technology Indore",
  "Indian Institute of Technology Ropar",
  "Indian Institute of Technology Mandi",
  "Indian Institute of Technology Gandhinagar",
  "Indian Institute of Technology Jodhpur",
  "Indian Institute of Technology Bhubaneswar",
  "Indian Institute of Technology Patna",
  "Indian Institute of Technology Tirupati",
  "Indian Institute of Technology Palakkad",
  "Indian Institute of Technology Dharwad",
  "Indian Institute of Technology Jammu",
];

const nitNames = [
  "National Institute of Technology Trichy",
  "National Institute of Technology Surathkal",
  "National Institute of Technology Warangal",
  "National Institute of Technology Calicut",
  "National Institute of Technology Rourkela",
  "National Institute of Technology Kurukshetra",
  "National Institute of Technology Durgapur",
  "National Institute of Technology Silchar",
  "National Institute of Technology Jamshedpur",
  "National Institute of Technology Allahabad",
  "National Institute of Technology Bhopal",
  "National Institute of Technology Jaipur",
  "National Institute of Technology Hamirpur",
  "National Institute of Technology Raipur",
  "National Institute of Technology Delhi",
  "National Institute of Technology Goa",
  "National Institute of Technology Patna",
  "National Institute of Technology Agartala",
  "National Institute of Technology Srinagar",
  "National Institute of Technology Nagaland",
];

const iiitNames = [
  "International Institute of Information Technology Hyderabad",
  "Indian Institute of Information Technology Bangalore",
  "Indian Institute of Information Technology Allahabad",
  "Indian Institute of Information Technology Gwalior",
  "Indian Institute of Information Technology Lucknow",
  "Indian Institute of Information Technology Pune",
  "Indian Institute of Information Technology Kottayam",
  "Indian Institute of Information Technology Dharwad",
  "Indian Institute of Information Technology Sri City",
  "Indian Institute of Information Technology Kota",
  "Indian Institute of Information Technology Vadodara",
  "Indian Institute of Information Technology Guwahati",
  "Indian Institute of Information Technology Ranchi",
  "Indian Institute of Information Technology Nagpur",
  "Indian Institute of Information Technology Tiruchirappalli",
];

const governmentCollegePrefixes = [
  "Government Engineering College",
  "State Institute of Technology",
  "University College of Engineering",
  "Rajiv Gandhi Institute of Technology",
  "College of Engineering",
];

const privateUniversityPrefixes = [
  "TechVerse University",
  "Apex Institute of Technology",
  "Global School of Engineering",
  "Zenith University",
  "Northstar Institute of Technology",
  "Pioneer University",
  "Summit School of Engineering",
  "Meridian Institute of Technology",
  "Velocity University",
  "FutureEdge Institute",
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pickStateCity(index: number) {
  return cities[index % cities.length];
}

function getTieredCollegeMetrics(
  tier: 1 | 2 | 3 | 4,
  ownership: Ownership
) {
  const ownershipMultiplier = ownership === Ownership.GOVERNMENT ? 0.65 : 1;
  const feeBase =
    tier === 1 ? 220000 : tier === 2 ? 180000 : tier === 3 ? 145000 : 115000;
  const ratingBase = tier === 1 ? 4.7 : tier === 2 ? 4.3 : tier === 3 ? 4 : 3.7;
  const placementBase = tier === 1 ? 94 : tier === 2 ? 88 : tier === 3 ? 81 : 72;
  const averageBase = tier === 1 ? 19 : tier === 2 ? 13 : tier === 3 ? 9 : 6.5;
  const highestBase = tier === 1 ? 48 : tier === 2 ? 28 : tier === 3 ? 18 : 12;

  return {
    fees: Math.round(feeBase * ownershipMultiplier),
    rating: clamp(Number((ratingBase - Math.random() * 0.35).toFixed(1)), 3.3, 4.9),
    placementPercentage: clamp(
      Math.round(placementBase - Math.random() * 6),
      62,
      97
    ),
    averagePackage: Number((averageBase - Math.random() * 2.5).toFixed(1)),
    highestPackage: Number((highestBase - Math.random() * 6).toFixed(1)),
  };
}

function buildCollegeRecords() {
  const records: Array<{
    name: string;
    ownership: Ownership;
    tier: 1 | 2 | 3 | 4;
    establishedYear: number;
  }> = [];

  for (const name of iitNames) {
    records.push({
      name,
      ownership: Ownership.GOVERNMENT,
      tier: 1,
      establishedYear: 1950 + Math.floor(Math.random() * 70),
    });
  }

  for (const name of nitNames) {
    records.push({
      name,
      ownership: Ownership.GOVERNMENT,
      tier: 2,
      establishedYear: 1960 + Math.floor(Math.random() * 55),
    });
  }

  for (const name of iiitNames) {
    records.push({
      name,
      ownership: Ownership.GOVERNMENT,
      tier: 2,
      establishedYear: 1995 + Math.floor(Math.random() * 25),
    });
  }

  for (let index = records.length; index < 130; index += 1) {
    const cityInfo = pickStateCity(index);
    const prefix = governmentCollegePrefixes[index % governmentCollegePrefixes.length];
    records.push({
      name: `${prefix} ${cityInfo.city}`,
      ownership: Ownership.GOVERNMENT,
      tier: index % 3 === 0 ? 2 : 3,
      establishedYear: 1965 + Math.floor(Math.random() * 45),
    });
  }

  for (let index = records.length; index < 200; index += 1) {
    const cityInfo = pickStateCity(index);
    const prefix = privateUniversityPrefixes[index % privateUniversityPrefixes.length];
    records.push({
      name: `${prefix} ${cityInfo.city}`,
      ownership: Ownership.PRIVATE,
      tier: index % 4 === 0 ? 2 : index % 2 === 0 ? 3 : 4,
      establishedYear: 1998 + Math.floor(Math.random() * 24),
    });
  }

  return records.slice(0, 200);
}

async function main() {
  console.log("Seeding CollegeCompass AI database...");

  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.predictionHistory.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("CollegeCompass@123", 12);

  const users = await Promise.all(
    userSeeds.map((name) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          password: passwordHash,
        },
      })
    )
  );

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "demo@collegecompass.ai",
      password: passwordHash,
    },
  });

  const colleges = buildCollegeRecords();
  const createdColleges: Array<{ id: string; name: string; rating: number; state: string }> = [];

  for (let index = 0; index < colleges.length; index += 1) {
    const collegeSeed = colleges[index];
    const cityInfo = pickStateCity(index);
    const metrics = getTieredCollegeMetrics(collegeSeed.tier, collegeSeed.ownership);
    const recruiterOffset = index % (recruiters.length - 5);
    const college = await prisma.college.create({
      data: {
        slug: `${slugify(collegeSeed.name)}-${slugify(cityInfo.city)}`,
        name: collegeSeed.name,
        description: `${collegeSeed.name} is a reputed institution in ${cityInfo.city}, ${cityInfo.state} known for strong academic outcomes, industry partnerships, and a student-first campus environment focused on engineering and technology programs.`,
        location: cityInfo.city,
        state: cityInfo.state,
        ownership: collegeSeed.ownership,
        fees:
          metrics.fees +
          (collegeSeed.ownership === Ownership.PRIVATE ? index * 250 : index * 75),
        rating: metrics.rating,
        placementPercentage: metrics.placementPercentage,
        averagePackage: metrics.averagePackage,
        highestPackage: Math.max(metrics.averagePackage + 4, metrics.highestPackage),
        website: `https://www.${slugify(collegeSeed.name)}.edu.in`,
        topRecruiters: recruiters.slice(recruiterOffset, recruiterOffset + 5),
        establishedYear: collegeSeed.establishedYear,
        image: null,
        featured: index < 12,
      },
    });

    createdColleges.push({
      id: college.id,
      name: college.name,
      rating: college.rating,
      state: college.state,
    });
  }

  const courseRows: Array<{ collegeId: string; name: string; duration: string; fees: number }> = [];

  createdColleges.forEach((college, index) => {
    const courseCount = index < 100 ? 3 : 2;

    for (let courseIndex = 0; courseIndex < courseCount; courseIndex += 1) {
      const course = courseCatalog[(index + courseIndex) % courseCatalog.length];
      courseRows.push({
        collegeId: college.id,
        name: course.name,
        duration: course.duration,
        fees: 90000 + (index % 12) * 12000 + courseIndex * 18000,
      });
    }
  });

  await prisma.course.createMany({ data: courseRows });

  const reviewRows: Array<{
    userId: string;
    collegeId: string;
    rating: number;
    comment: string;
  }> = [];

  createdColleges.forEach((college, index) => {
    for (let reviewIndex = 0; reviewIndex < 5; reviewIndex += 1) {
      const reviewer = users[(index + reviewIndex) % users.length];
      const rating = clamp(
        Math.round(college.rating + (Math.random() * 2 - 1)),
        3,
        5
      );

      reviewRows.push({
        userId: reviewer.id,
        collegeId: college.id,
        rating,
        comment: reviewTemplates[(index + reviewIndex) % reviewTemplates.length],
      });
    }
  });

  await prisma.review.createMany({ data: reviewRows });

  await prisma.savedCollege.createMany({
    data: createdColleges.slice(0, 10).map((college) => ({
      userId: demoUser.id,
      collegeId: college.id,
    })),
  });

  await prisma.comparison.createMany({
    data: [
      {
        userId: demoUser.id,
        title: "Top CSE Picks",
        collegeIds: createdColleges.slice(0, 3).map((college) => college.id),
      },
      {
        userId: demoUser.id,
        title: "Affordable South India Options",
        collegeIds: createdColleges.slice(20, 23).map((college) => college.id),
      },
    ],
  });

  await prisma.predictionHistory.createMany({
    data: [
      {
        userId: demoUser.id,
        exam: Exam.JEE_MAIN,
        rank: 24500,
        category: Category.GENERAL,
        state: "Karnataka",
        results: [
          {
            collegeName: createdColleges[18]?.name,
            matchPercentage: 88,
            probabilityScore: 84,
            confidence: "High",
          },
          {
            collegeName: createdColleges[24]?.name,
            matchPercentage: 82,
            probabilityScore: 78,
            confidence: "Medium",
          },
        ],
      },
      {
        userId: demoUser.id,
        exam: Exam.COMEDK,
        rank: 5300,
        category: Category.OBC,
        state: "Karnataka",
        results: [
          {
            collegeName: createdColleges[130]?.name,
            matchPercentage: 91,
            probabilityScore: 87,
            confidence: "High",
          },
        ],
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`- Users: ${users.length + 1}`);
  console.log(`- Colleges: ${createdColleges.length}`);
  console.log(`- Courses: ${courseRows.length}`);
  console.log(`- Reviews: ${reviewRows.length}`);
  console.log("Demo credentials: demo@collegecompass.ai / CollegeCompass@123");
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

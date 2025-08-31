'use server';

import { sql } from '@vercel/postgres';

export async function createApplicationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      "companyName" VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      "dateApplied" DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      notes TEXT
    );
  `;
}

export async function seedInitialData() {
  const applications = [
    {
        role: "Mobile PC Technician and Consultant",
        companyName: "SEEK",
        dateApplied: "2025-08-30",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Endace Summer Internship Program 2025/2026",
        companyName: "SEEK",
        dateApplied: "2025-08-30",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Helpdesk Support Engineer",
        companyName: "SEEK",
        dateApplied: "2025-08-30",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Customer and Product Support Technician",
        companyName: "Loadscan Limited",
        dateApplied: "2025-08-28",
        status: "Applied",
        notes: "Unlikely to progress."
    },
    {
        role: "Maintenance Assistant",
        companyName: "Scenic Hotel Group",
        dateApplied: "2025-08-27",
        status: "Applied",
        notes: "Applied on SEEK."
    },
    {
        role: "Call Centre Agent - Car Loans",
        companyName: "Embeth",
        dateApplied: "2025-08-27",
        status: "Applied",
        notes: "Unlikely to progress."
    },
    {
        role: "Customer Service & Vehicle Rental Assistant",
        companyName: "Hireace",
        dateApplied: "2025-08-21",
        status: "Applied",
        notes: "Unlikely to progress."
    },
    {
        role: "Kennel Attendant",
        companyName: "Hamilton City Council",
        dateApplied: "2025-08-21",
        status: "Applied",
        notes: "Visited employer's application site. Expired."
    },
    {
        role: "Advanced On-site Technician",
        companyName: "Fujitsu Australia Limited",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Visited employer's application site."
    },
    {
        role: "Mobile PC Technician and Consultant",
        companyName: "Geeks on Wheels",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Applied on SEEK."
    },
    {
        role: "Warehouse Storeperson / Delivery Driver Class 1",
        companyName: "Windsor Industries",
        dateApplied: "2025-08-17",
        status: "Applied",
        notes: "Unlikely to progress."
    },
    {
        role: "Online Customer Service Representative",
        companyName: "SEEK",
        dateApplied: "2025-08-13",
        status: "Applied",
        notes: "Application update received."
    },
    {
        role: "Online Customer Service",
        companyName: "Heathcote Appliances",
        dateApplied: "2025-08-13",
        status: "Applied",
        notes: "Unlikely to progress."
    },
    {
        role: "Sales Assistant - (Part-Time) - Te Rapa",
        companyName: "Animates",
        dateApplied: "2025-08-12",
        status: "Applied",
        notes: "Visited employer's application site. Expired."
    },
    {
        role: "Gardens Team Member",
        companyName: "Mitre 10",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Application received."
    },
    {
        role: "IT Helpdesk",
        companyName: "SEEK",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "IT Helpdesk Support",
        companyName: "Bridged IT Services Limited",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Applied on SEEK."
    },
    {
        role: "Customer Service Officer",
        companyName: "Hamilton City Council Hiring Team",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Summer Internship Program 2025/2026",
        companyName: "Hamilton City Council Hiring Team",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Christmas Casual",
        companyName: "JB Hi-Fi New Zealand",
        dateApplied: "2025-08-10",
        status: "Applied",
        notes: "Application received."
    },
    {
        role: "Warehousing and Distribution",
        companyName: "SEEK",
        dateApplied: "2025-08-10",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Customer Care Specialist",
        companyName: "The Warehouse Group",
        dateApplied: "2025-08-10",
        status: "Applied",
        notes: "Visited employer's application site. Expired."
    },
    {
        role: "Casual Labourer",
        companyName: "The Warehouse",
        dateApplied: "2025-08-10",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Notification from Job Mate",
        companyName: "Job Mate",
        dateApplied: "2025-08-09",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Graduate Lawyer",
        companyName: "Hired",
        dateApplied: "2025-08-09",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Graduate Law Clerk",
        companyName: "Hired",
        dateApplied: "2025-08-09",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Office Administrator",
        companyName: "Hired",
        dateApplied: "2025-08-09",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Student Intern",
        companyName: "Hired",
        dateApplied: "2025-08-09",
        status: "Applied",
        notes: "Application successfully submitted."
    },
    {
        role: "Helpdesk Engineer",
        companyName: "Houston Technology",
        dateApplied: "2025-08-08",
        status: "Applied",
        notes: "Applied on SEEK."
    },
    {
        role: "Service Desk Manager",
        companyName: "Lightwire",
        dateApplied: "2025-08-07",
        status: "Applied",
        notes: "Unlikely to progress."
    }
  ];

  const { rows: existing } = await sql`SELECT COUNT(*) FROM applications`;
  const count = parseInt(existing[0].count, 10);

  if (count === 0) {
    for (const app of applications) {
      await sql`
        INSERT INTO applications (id, "companyName", role, "dateApplied", status, notes)
        VALUES (gen_random_uuid(), ${app.companyName}, ${app.role}, ${app.dateApplied}, ${app.status}, ${app.notes});
      `;
    }
    console.log('Seeded 30 applications');
  } else {
    console.log('Database already seeded');
  }
}
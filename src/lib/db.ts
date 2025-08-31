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
    },
    {
        role: "Application to Endace",
        companyName: "Workable",
        dateApplied: "2025-08-27",
        status: "Applied",
        notes: "Thanks for applying to Endace."
    },
    {
        role: "Media Search Analyst Application",
        companyName: "Indeed Apply",
        dateApplied: "2025-08-27",
        status: "Applied",
        notes: "Indeed Application: Media Search Analyst."
    },
    {
        role: "Application for Council Position",
        companyName: "Hamilton City Council Hiring Team",
        dateApplied: "2025-08-26",
        status: "Applied",
        notes: "Thank you for your application."
    },
    {
        role: "AI Developer",
        companyName: "Datacom",
        dateApplied: "2025-08-23",
        status: "Applied",
        notes: "Hi Luke thank you for your interest."
    },
    {
        role: "Application Update",
        companyName: "Hamilton City Council Hiring Team",
        dateApplied: "2025-08-21",
        status: "Applied",
        notes: "Update: Hamilton City Council - Application"
    },
    {
        role: "Application with Tradestaff",
        companyName: "no-reply",
        dateApplied: "2025-08-21",
        status: "Applied",
        notes: "Thanks for applying. Tradestaff."
    },
    {
        role: "Application to Hamilton City Council",
        companyName: "Hamilton City Council",
        dateApplied: "2025-08-21",
        status: "Applied",
        notes: "Your application."
    },
    {
        role: "Application update for Customer Service",
        companyName: "SEEK Applications",
        dateApplied: "2025-08-21",
        status: "Applied",
        notes: "Application update for Customer Service."
    },
    {
        role: "Kmart Careers Invitation",
        companyName: "Kmart Careers",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Invitation to complete our online..."
    },
    {
        role: "Kmart Job Application",
        companyName: "Careers at Kmart Group",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Your interactive... A new opportunity for you."
    },
    {
        role: "Application for The Warehouse",
        companyName: "Noel Leeming",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Thank you for applying to The Warehouse."
    },
    {
        role: "Job Application to Foodstuffs",
        companyName: "Careers APAC",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Thank You for Your Job Application to F..."
    },
    {
        role: "Application Update",
        companyName: "Mitre 10",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Notification From Mitre 10. Application Update."
    },
    {
        role: "Customer Service Application",
        companyName: "SEEK Applications 2",
        dateApplied: "2025-08-20",
        status: "Applied",
        notes: "Your application was successfully submitted for Customer..."
    },
    {
        role: "Application for Customer Role",
        companyName: "SEEK Applications",
        dateApplied: "2025-08-19",
        status: "Applied",
        notes: "Your application was successfully submitted."
    },
    {
        role: "Application Submission",
        companyName: "noreply",
        dateApplied: "2025-08-19",
        status: "Applied",
        notes: "Thanks for your application."
    },
    {
        role: "Update on Application",
        companyName: "recruitment",
        dateApplied: "2025-08-14",
        status: "Applied",
        notes: "Update on Application. Thank you for your application."
    },
    {
        role: "Online Customer Application",
        companyName: "SEEK Applications",
        dateApplied: "2025-08-13",
        status: "Applied",
        notes: "Application update for Online Customer..."
    },
    {
        role: "Application Received",
        companyName: "recruitment",
        dateApplied: "2025-08-12",
        status: "Applied",
        notes: "We've received your application."
    },
    {
        role: "Mitre 10 Application Received",
        companyName: "Mitre 10",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Notification From Mitre 10. Mitre 10 Application Received. Re: Gardens Team M..."
    },
    {
        role: "IT Helpdesk Application",
        companyName: "SEEK Applications",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Your application was successfully submitted for IT H..."
    },
    {
        role: "Application Received",
        companyName: "Foodstuffs",
        dateApplied: "2025-08-11",
        status: "Applied",
        notes: "Notification from Foodstuffs. Application Received."
    },
    {
        role: "Application Received - Christmas Casual",
        companyName: "JB Hi-Fi New Zealand",
        dateApplied: "2025-08-10",
        status: "Applied",
        notes: "Application Received - Christmas Casual."
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
    console.log(`Seeded ${applications.length} applications`);
  } else {
    console.log('Database already seeded');
  }
}

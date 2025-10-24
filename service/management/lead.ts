// Placeholder service for lead management
export const add_lead = async (data: any) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          message: "Lead added successfully",
          id: Math.random().toString(36).substr(2, 9),
        },
      })
    }, 1000)
  })
}

export const get_leads = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          leads: [
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              phone: "+1234567890",
              source: "website",
              score: 85,
              status: "new",
              createdAt: "2024-01-15",
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "+1234567891",
              source: "referral",
              score: 92,
              status: "contacted",
              createdAt: "2024-01-14",
            },
          ],
        },
      })
    }, 1000)
  })
}

export const get_lead_by_id = async (id: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          lead: {
            id,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            source: "website",
            campaign: "summer-2024",
            score: 85,
            status: "new",
            notes: "Interested in computer science program",
            createdAt: "2024-01-15",
            timeline: [
              { date: "2024-01-15", action: "Lead created", details: "From website form" },
              { date: "2024-01-16", action: "Email sent", details: "Welcome email" },
            ],
          },
        },
      })
    }, 1000)
  })
}

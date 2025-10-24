// Placeholder service for campaign management
export const add_campaign = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          message: "Campaign created successfully",
          id: Math.random().toString(36).substr(2, 9),
        },
      })
    }, 1000)
  })
}

export const get_campaigns = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          campaigns: [
            {
              id: "1",
              name: "Summer Admission Drive",
              channel: "facebook",
              objective: "leads",
              budget: 5000,
              status: "active",
              startDate: "2024-01-01",
              endDate: "2024-03-31",
            },
            {
              id: "2",
              name: "Engineering Program Promotion",
              channel: "google",
              objective: "admissions",
              budget: 8000,
              status: "active",
              startDate: "2024-02-01",
              endDate: "2024-04-30",
            },
          ],
        },
      })
    }, 1000)
  })
}

export const get_campaign_by_id = async (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          campaign: {
            id,
            name: "Summer Admission Drive",
            channel: "facebook",
            objective: "leads",
            budget: 5000,
            status: "active",
            startDate: "2024-01-01",
            endDate: "2024-03-31",
            description: "Targeting high school graduates for summer admissions",
            metrics: {
              leads: 245,
              admissions: 32,
              cac: 156,
              ctr: 3.2,
            },
          },
        },
      })
    }, 1000)
  })
}

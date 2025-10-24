// Placeholder service for automation management
export const add_rule = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          message: "Automation rule created successfully",
          id: Math.random().toString(36).substr(2, 9),
        },
      })
    }, 1000)
  })
}

export const get_rules = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          rules: [
            {
              id: "1",
              name: "High Score Lead Assignment",
              trigger: "New Lead with Score > 80",
              action: "Assign to Senior Counselor",
              status: "active",
              createdAt: "2024-01-10",
            },
            {
              id: "2",
              name: "Campaign Performance Alert",
              trigger: "Campaign CTR < 2%",
              action: "Send Alert to Marketing Team",
              status: "active",
              createdAt: "2024-01-12",
            },
            {
              id: "3",
              name: "Social Post Notification",
              trigger: "Post Published",
              action: "Notify Marketing Team",
              status: "active",
              createdAt: "2024-01-14",
            },
          ],
        },
      })
    }, 1000)
  })
}

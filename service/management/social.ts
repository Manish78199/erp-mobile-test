// Placeholder service for social media management
export const add_post = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          message: "Post scheduled successfully",
          id: Math.random().toString(36).substr(2, 9),
        },
      })
    }, 1000)
  })
}

export const get_posts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          posts: [
            {
              id: "1",
              title: "New Computer Science Program Launch",
              platform: "facebook",
              scheduledDate: "2024-01-20T10:00:00Z",
              status: "scheduled",
              createdAt: "2024-01-15",
            },
            {
              id: "2",
              title: "Student Success Stories",
              platform: "instagram",
              scheduledDate: "2024-01-18T14:00:00Z",
              status: "published",
              createdAt: "2024-01-14",
            },
          ],
        },
      })
    }, 1000)
  })
}

export const get_post_by_id = async (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          post: {
            id,
            title: "New Computer Science Program Launch",
            platform: "facebook",
            content:
              "Exciting news! We're launching our new Computer Science program with cutting-edge curriculum and industry partnerships.",
            scheduledDate: "2024-01-20T10:00:00Z",
            status: "scheduled",
            createdAt: "2024-01-15",
            analytics: {
              impressions: 12500,
              likes: 340,
              ctr: 2.8,
            },
          },
        },
      })
    }, 1000)
  })
}

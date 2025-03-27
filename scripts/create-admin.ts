import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

interface ApiResponse {
  success?: boolean
  message?: string
  error?: string
  uid?: string
}

async function createAdminUser(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json() as ApiResponse

    if (!response.ok) {
      throw new Error(data.error || "Failed to create admin user")
    }

    console.log("✅ Admin user created successfully!")
    console.log("Email:", email)
    console.log("UID:", data.uid)
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    process.exit(1)
  }
}

// Get email and password from command line arguments
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error("❌ Please provide email and password")
  console.error("Usage: yarn create-admin <email> <password>")
  process.exit(1)
}

createAdminUser(email, password) 
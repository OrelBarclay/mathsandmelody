import { db } from "@/lib/firebase-admin"
import { Timestamp } from "firebase-admin/firestore"

export interface Service {
  id?: string
  title: string
  description: string
  price: number
  duration: number
  category: "math" | "music" | "sports"
  features: string[]
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface PortfolioItem {
  id?: string
  title: string
  description: string
  category: "math" | "music" | "sports"
  image?: string
  link?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ContactInfo {
  id?: string
  email: string
  phone: string
  address: string
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  updatedAt?: Date
}

export interface Blog {
  id?: string
  title: string
  content: string
  excerpt: string
  slug: string
  author: string
  category: "math" | "music" | "sports"
  image?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export class AdminService {
  // Services CRUD
  async getAllServices(): Promise<Service[]> {
    const snapshot = await db.collection("services").orderBy("createdAt", "desc").get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Service[]
  }

  async getService(id: string): Promise<Service | null> {
    const doc = await db.collection("services").doc(id).get()
    if (!doc.exists) return null
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data()?.createdAt as Timestamp).toDate(),
      updatedAt: (doc.data()?.updatedAt as Timestamp).toDate(),
    } as Service
  }

  async createService(data: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
    const docRef = await db.collection("services").add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return this.getService(docRef.id) as Promise<Service>
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    await db.collection("services").doc(id).update({
      ...data,
      updatedAt: new Date(),
    })
    return this.getService(id) as Promise<Service>
  }

  async deleteService(id: string): Promise<void> {
    await db.collection("services").doc(id).delete()
  }

  // Portfolio CRUD
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    const snapshot = await db.collection("portfolio").orderBy("createdAt", "desc").get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as PortfolioItem[]
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    const doc = await db.collection("portfolio").doc(id).get()
    if (!doc.exists) return null
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data()?.createdAt as Timestamp).toDate(),
      updatedAt: (doc.data()?.updatedAt as Timestamp).toDate(),
    } as PortfolioItem
  }

  async createPortfolioItem(data: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">): Promise<PortfolioItem> {
    const docRef = await db.collection("portfolio").add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return this.getPortfolioItem(docRef.id) as Promise<PortfolioItem>
  }

  async updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    await db.collection("portfolio").doc(id).update({
      ...data,
      updatedAt: new Date(),
    })
    return this.getPortfolioItem(id) as Promise<PortfolioItem>
  }

  async deletePortfolioItem(id: string): Promise<void> {
    await db.collection("portfolio").doc(id).delete()
  }

  // Contact Info CRUD
  async getContactInfo(): Promise<ContactInfo | null> {
    const doc = await db.collection("contact").doc("main").get()
    if (!doc.exists) return null
    return {
      id: doc.id,
      ...doc.data(),
      updatedAt: (doc.data()?.updatedAt as Timestamp).toDate(),
    } as ContactInfo
  }

  async updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
    await db.collection("contact").doc("main").set({
      ...data,
      updatedAt: new Date(),
    }, { merge: true })
    return this.getContactInfo() as Promise<ContactInfo>
  }

  // Blog CRUD
  async getAllBlogs(): Promise<Blog[]> {
    try {
      const snapshot = await db.collection("blogs").orderBy("createdAt", "desc").get()
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      })) as Blog[]
    } catch (error) {
      console.error("Error getting all blogs:", error)
      throw error
    }
  }

  async getBlog(id: string): Promise<Blog | null> {
    try {
      const doc = await db.collection("blogs").doc(id).get()
      if (!doc.exists) {
        return null
      }
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate().toISOString(),
        updatedAt: data?.updatedAt?.toDate().toISOString(),
      } as Blog
    } catch (error) {
      console.error("Error getting blog:", error)
      throw error
    }
  }

  async createBlog(data: Omit<Blog, "id" | "createdAt" | "updatedAt">): Promise<Blog> {
    try {
      const docRef = await db.collection("blogs").add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const doc = await docRef.get()
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate().toISOString(),
        updatedAt: doc.data()?.updatedAt?.toDate().toISOString(),
      } as Blog
    } catch (error) {
      console.error("Error creating blog:", error)
      throw error
    }
  }

  async updateBlog(id: string, data: Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>): Promise<Blog> {
    try {
      await db.collection("blogs").doc(id).update({
        ...data,
        updatedAt: new Date(),
      })
      const doc = await db.collection("blogs").doc(id).get()
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate().toISOString(),
        updatedAt: doc.data()?.updatedAt?.toDate().toISOString(),
      } as Blog
    } catch (error) {
      console.error("Error updating blog:", error)
      throw error
    }
  }

  async deleteBlog(id: string): Promise<void> {
    try {
      await db.collection("blogs").doc(id).delete()
    } catch (error) {
      console.error("Error deleting blog:", error)
      throw error
    }
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      const doc = await db.collection("blogs")
        .where("slug", "==", slug)
        .limit(1)
        .get()

      if (doc.empty) {
        return null
      }

      const data = doc.docs[0].data()
      return {
        id: doc.docs[0].id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      } as Blog
    } catch (error) {
      console.error("Error getting blog by slug:", error)
      throw error
    }
  }
} 
import { NextPage } from 'next'

declare module '*.tsx' {
  interface PageProps {
    params: {
      id: string
    }
  }

  const Page: NextPage<PageProps>
  export default Page
} 
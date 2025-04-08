import { NextPage } from 'next'

declare module '*.tsx' {
  interface PageProps {
    params: {
      id: string | number
    }
  }

  const Page: NextPage<PageProps>
  export default Page
} 

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

const achievements = [
  {
    category: "Mathematics",
    items: [
      {
        title: "Perfect SAT Math Score",
        description: "Achieved a perfect score of 800 on the SAT Math section",
        date: "2023",
      },
      {
        title: "Math Olympiad Winner",
        description: "First place in the regional Mathematics Olympiad",
        date: "2022",
      },
      {
        title: "Advanced Calculus Certification",
        description: "Completed advanced calculus course with distinction",
        date: "2023",
      },
    ],
  },
  {
    category: "Music",
    items: [
      {
        title: "Piano Performance Award",
        description: "First place in the State Piano Competition",
        date: "2023",
      },
      {
        title: "Music Theory Excellence",
        description: "Completed Grade 8 Music Theory with distinction",
        date: "2022",
      },
      {
        title: "Orchestra Leadership",
        description: "Lead violinist in the Youth Symphony Orchestra",
        date: "2023",
      },
    ],
  },
  {
    category: "Sports",
    items: [
      {
        title: "State Championship",
        description: "Won the state championship in track and field",
        date: "2023",
      },
      {
        title: "Team Captain",
        description: "Captain of the varsity basketball team",
        date: "2022-2023",
      },
      {
        title: "Athletic Excellence Award",
        description: "Recognized for outstanding athletic achievements",
        date: "2023",
      },
    ],
  },
]

export default function PortfolioPage() {
  return (
    <MainLayout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Portfolio & Achievements
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Explore my journey and accomplishments across mathematics, music, and sports.
          </p>
        </div>
        <div className="mx-auto grid max-w-[980px] gap-8 py-8">
          {achievements.map((category) => (
            <div key={category.category} className="space-y-4">
              <h2 className="text-2xl font-bold">{category.category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <Card key={item.title}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-2xl font-bold">Want to Learn More?</h2>
          <p className="mt-4 text-muted-foreground">
            Check out my blog for detailed insights and experiences in each field.
          </p>
          <Link href="/blog">
            <Button className="mt-4">Read Blog</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
} 
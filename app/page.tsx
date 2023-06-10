"use client"

import useSWR from "swr"
import fetcher from "./swr"

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/hello', fetcher)

  console.log(data)

  return (
    <main>
      <h1>
        Xeoverse
      </h1>
    </main>
  )
}

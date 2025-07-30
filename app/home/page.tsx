/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([]) // State to store posts
  const [loading, setLoading] = useState<boolean>(true) // To manage loading state

  useEffect(() => {
    const savedToken = localStorage.getItem('IdToken')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const getData = async () => {
    if (!token) return
    
    // send data
    // const body = JSON.stringify({ name: 'water', quantity: 2, price: 25.25});
    // await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`, 
    //     'Content-Type': 'application/json'
    //   },
    //   body: body
    // })
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/items`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Fixed the extra `}`
      },
    })

    if (data.ok) {
      const posts = await data.json()
      console.log(posts.items)
      setPosts(posts.items) // Store the fetched posts in state
      
    } else {
      console.error("Failed to fetch data")
    }

    setLoading(false) // Set loading to false once data is fetched
  }

  useEffect(() => {
    if (token) {
      getData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]) // Re-fetch data when the token is available

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.id}</li>
      ))}
    </ul>
  )
}

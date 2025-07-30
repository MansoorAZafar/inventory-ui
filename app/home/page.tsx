/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([]) // State to store posts
  const [loading, setLoading] = useState<boolean>(true) // To manage loading state
  const [inputText, setInputText] = useState<string>("") // State for the text input field
  const [itemId, setItemId] = useState<string>("") // State for the item ID for DELETE, GET, PUT

  useEffect(() => {
    const savedToken = localStorage.getItem('IdToken')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const getData = async () => {
    if (!token) return

    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/items`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Fixed the extra `}`
      },
    })

    if (data.ok) {
      const posts = await data.json()
      console.log(posts)
      console.log(posts.items)
      setPosts(posts.items) // Store the fetched posts in state
    } else {
      console.error("Failed to fetch data")
    }

    setLoading(false) // Set loading to false once data is fetched
  }

  const createItem = async () => {
    if (!token || !inputText) return

    try {
      const body = JSON.parse(inputText)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        getData() // Refresh posts
      } else {
        console.error("Failed to create item")
      }
    } catch (error) {
      console.error("Invalid JSON input")
    }
  }

  const getSingleItem = async () => {
    if (!token || !itemId) return

    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item/${itemId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (data.ok) {
        const post = await data.json()
        console.log(post)
        setPosts([post.item]) // Set the fetched single item
      } else {
        console.error("Failed to fetch item")
      }
    } catch (error) {
      console.error("Error fetching item")
    }
  }

  const updateItem = async () => {
    if (!token || !itemId || !inputText) return

    try {
      const body = JSON.parse(inputText)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        getData() // Refresh posts
      } else {
        console.error("Failed to update item")
      }
    } catch (error) {
      console.error("Invalid JSON input")
    }
  }

  const deleteItem = async () => {
    if (!token || !itemId) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        getData() // Refresh posts
      } else {
        console.error("Failed to delete item")
      }
    } catch (error) {
      console.error("Error deleting item")
    }
  }

  useEffect(() => {
    if (token) {
      getData()
    }
  }, [token]) // Re-fetch data when the token is available

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 bg-gray-800 text-white">
      {/* Text field for input */}
      <textarea
        placeholder="Enter JSON here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={5}
        cols={50}
        className="block p-2 w-full bg-gray-700 text-white border border-gray-600 rounded mb-4"
      />
      
      {/* Text field for Item ID */}
      <input
        type="text"
        placeholder="Item ID"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="block p-2 w-full bg-gray-700 text-white border border-gray-600 rounded mb-4"
      />

      <div className="space-x-4 mb-6">
        {/* Buttons for each operation */}
        <button
          onClick={getData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Get All Items
        </button>
        <button
          onClick={createItem}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Create Item
        </button>
        <button
          onClick={getSingleItem}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        >
          Get SINGLE Item
        </button>
        <button
          onClick={updateItem}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Update Item
        </button>
        <button
          onClick={deleteItem}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete Item
        </button>
      </div>

      <div>
        {/* Display the posts in card format */}
        {posts.map((post: any) => (
          <div key={post.id} className="bg-gray-700 text-white p-4 rounded-lg mb-4">
            <h4 className="font-semibold">ID: {post.id}</h4>
            <p>Name: {post.name}</p>
            <p>Price: ${post.price}</p>
            <p>Quantity: {post.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

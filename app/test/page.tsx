"use client"
import { useEffect, useState } from "react"
import React from 'react'
import { Manrope } from "next/font/google"
import { BadgePlus} from 'lucide-react'
import {Pen} from 'lucide-react'
import { Trash2 } from 'lucide-react'
import Link from "next/link"
import {CircleDollarSign} from 'lucide-react'
import {HandCoins} from 'lucide-react'
import {Info} from 'lucide-react'
import InfoModal from "@/components/infoModal"

const manrope = Manrope({ subsets: ['latin'] })

const Main = () => {
  const [token, setToken] = useState<string | null>(null)
    const [posts, setPosts] = useState<any[]>([]) // State to store posts
    const [loading, setLoading] = useState<boolean>(true) // To manage loading state
    const [inputText, setInputText] = useState<string>("") // State for the text input field
    const [itemId, setItemId] = useState<string>("") // State for the item ID for DELETE, GET, PUT
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]) // state to store filtered posts
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
      const savedToken = localStorage.getItem('IdToken')
      if (savedToken) {
        setToken(savedToken)
      }
    }, [])

    useEffect(() => {
      const results = posts.filter((post: any) =>
    post.id.toLowerCase().includes(inputText.toLowerCase())
    );
      setFilteredPosts(results)
    }, [inputText, posts])


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
    <div className={`flex justify-center items-center flex-col m-0 m-auto p-6 max-w-7xl text-center ${manrope.className}`}>
      <h1 className="text-4xl font-bold mb-4">Welcome to the Inventory</h1>
      <p className="text-lg mb-6">This is the main content area.</p>
      <div className="flex justify-center items-center m-6 gap-3 flex-row">
        <input
          type="text"
          placeholder="Search for an item with ID"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="block p-2 w-full bg-gray-200 text-gray-900 border border-gray-600 rounded"
        />
        {/* <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-4"
          onClick={() => console.log('Get clicked')}
        >
          Get
        </button> */}
      </div>
        {/* <div className="flex justify-center items-center m-6 gap-3 flex-row">
            <button
            className="px-4 py-2 font-bold bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => console.log('Create clicked')}
            >
            Create
            </button>
            <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            onClick={() => console.log('Update clicked')}
            >
            Update
            </button>
            <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => console.log('Delete clicked')}
            >
            Delete
            </button>
        </div>
        <div className="mt-6 mb-4 flex flex-wrap justify-center flex-row gap-4 ">
                <span className="mb-0.5 font-bold rounded-lg text-lg bg-blue-100 text-blue-800 px-4 py-1 hover:ring-2 hover:scale-110 transition-all duration-300">
                  <BadgePlus className="inline mr-2" />
                  Create
                </span>

        </div> */}
      <p className="text-lg mb-6">A list of all items within the database</p>
      <div className=" flex flex-wrap justify-center items-center gap-4 flex-row w-full ">
        {/* Display the posts in card format */}
        {filteredPosts.map((post: any) => (
          <div key={post.id} className="bg-gray-700 text-white p-4 rounded-lg mb-4 basis-full flex flex-wrap flex-row items-center justify-evenly gap-4 hover:scale-105 transition-all duration-300">

            {/* <div className="flex flex-row items-center justify-between w-full gap-2">
              <div className="flex items-center">
                <ScanBarcode className="inline mr-2" />
                <h4 className="font-semibold text-sm sm:w-1/3 truncate">
                  ID: {post.id}
                </h4>
              </div>
              <p className="font-semibold text-base sm:w-2/3 break-words">
                {post.name}
              </p>
            </div> */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
              <div className="flex-shrink-0">
                <button
                  className="px-2 hover:scale-105 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => { setSelectedItem(post); setModalOpen(true); }}
                >
                  <Info className="inline mr-2" />
                </button>
              </div>
              <p className="flex-1 text-center font-semibold text-base break-words">
                {post.name}
              </p>
            </div>


            <div className="flex flex-row items-center justify-between w-full"> {/* price count and edit button container */}
              {/* <span className="text-sm text-gray-400">ID: {post.id}</span> */}
              <div className="flex items-center" title="Quantity">
                <HandCoins className="inline mr-2" />
                <p>Quantity: {post.quantity}</p>
              </div>
              <div className="flex items-center" title="Price">
                <CircleDollarSign className="inline mr-2" />
                <p>{post.price}</p>
              </div>
              <div className="flex items-center">
                <Pen className="inline mr-2 cursor-pointer" />
                <Trash2 className="inline mr-2 cursor-pointer" />
              </div>
            </div>
        
          </div>
        ))}
        <InfoModal isOpen={modalOpen} setIsOpen={setModalOpen} item={selectedItem} />
      </div>

    </div>
  )
}

export default Main
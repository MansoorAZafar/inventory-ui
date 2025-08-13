"use client"
import { useEffect, useState } from "react"
import React from 'react'
import { useRouter } from "next/navigation"
import { Manrope } from "next/font/google"
import { BadgePlus} from 'lucide-react'
import {Pen} from 'lucide-react'
import { Trash2 } from 'lucide-react'
import {LogOut} from 'lucide-react'
import {CircleDollarSign} from 'lucide-react'
import {HandCoins} from 'lucide-react'
import {Info} from 'lucide-react'
import InfoModal from "@/components/infoModal"
import EditModal from "@/components/editModal"
import DeleteModal from "@/components/deleteModal"
import CreateModal from "@/components/createModal"

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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<any>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const router = useRouter()


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

    const logout = () => {
    localStorage.removeItem('IdToken')
    router.push('/')
    }


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
  
    useEffect(() => {
      if (token) {
        getData()
      }
    }, [token]) // Re-fetch data when the token is available
  
    if (loading) {
      return <div>Loading...</div>
    }

  return (
    <div className={`flex justify-center items-center flex-col m-auto p-6 max-w-7xl text-center ${manrope.className}`}>
      <div className="relative w-full mt-3 mb-4">
        {/* Title centered absolutely */}
        <h1 className="text-4xl font-bold mb-4 text-center w-full absolute left-0 top-0">
          Welcome to the Inventory
        </h1>
        {/* Logout button: right for sm+, below for mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full relative" style={{ minHeight: '4rem' }}>
          <div className="flex-1" />
          <button
            className="sm:absolute sm:right-0 sm:top-0 sm:w-auto w-full mt-24 sm:mt-0 hover:scale-125 hover:text-purple-600 transition-all duration-300 cursor-pointer flex items-center justify-center font-semibold"
            onClick={logout}
          >
            Logout
            <LogOut className="inline ml-1 mr-2" />
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center m-6 gap-3 flex-row">
        <input
          type="text"
          placeholder="Search for an item with ID"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="block p-2 w-full bg-gray-200 text-gray-900 border border-gray-600 rounded"
        />
      </div>
        <div className="mt-6 mb-4 flex flex-wrap justify-center flex-row gap-4 ">
          <span className="mb-0.5 font-bold rounded-lg text-lg bg-blue-100 text-blue-800 px-4 py-1 hover:ring-2 hover:scale-110 transition-all duration-300 cursor-pointer"
          onClick={() => setCreateModalOpen(true)}
          >
            <BadgePlus className="inline mr-2" />
            Create
          </span>
        </div>
      <p className="text-lg mb-6">A list of all items within the database</p>
      <div className=" flex flex-wrap justify-center items-center gap-4 flex-row w-full ">
        {/* Display the posts in card format */}
        {filteredPosts.map((post: any) => (
          <div key={post.id} className="bg-gray-700 text-white p-4 rounded-lg mb-4 basis-full flex flex-wrap flex-row items-center justify-evenly gap-4 hover:scale-105 transition-all duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
              <div className="flex-shrink-0">
                <button
                  className="px-2 hover:scale-125 hover:text-blue-600 transition-all duration-300 cursor-pointer"
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
                <Pen className="inline mr-2 cursor-pointer hover:scale-125 hover:text-yellow-600 transition-all duration-300"
                  onClick={() => {
                    setEditItem(post);
                    setEditModalOpen(true);
                  }}
                />
                <Trash2 className="inline mr-2 cursor-pointer hover:scale-125 hover:text-red-600 transition-all duration-300"
                  onClick={() => {
                    setDeleteItem(post);
                    setDeleteModalOpen(true);
                  }}
                />
              </div>
            </div>
        
          </div>
        ))}
        <InfoModal isOpen={modalOpen} setIsOpen={setModalOpen} item={selectedItem} />
        <EditModal
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
          item={editItem}
          onSave={async (updated) => {
            // Call your updateItem logic here
            if (!token || !editItem?.id) return;
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item/${editItem.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editItem, ...updated }),
              });
              if (response.ok) {
                getData(); // Refresh posts
              }
            } catch (error) {
              console.error("Failed to update item");
            }
          }}
        />
        <DeleteModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          item={deleteItem}
          onDelete={async () => {
            if (!token || !deleteItem?.id) return;
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item/${deleteItem.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              if (response.ok) {
                getData(); // Refresh posts
              }
            } catch (error) {
              console.error("Failed to delete item");
            }
          }}
        />
        <CreateModal
          isOpen={createModalOpen}
          setIsOpen={setCreateModalOpen}
          onCreate={async (item) => {
            if (!token) return;
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/v1/item`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
              });
              if (response.ok) {
                getData(); // Refresh posts
              }
            } catch (error) {
              console.error("Failed to create item");
            }
          }}
        />
      </div>

    </div>
  )
}

export default Main
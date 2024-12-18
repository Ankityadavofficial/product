import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Listing from './Listing'
import Detail from './Detail'

export default function App() {
const routes= createBrowserRouter(
  [
    {
      path:'/:category_slug?',
      element:<Listing/>
    },
    {
      path:'/product/:id',
      element:<Detail/>
    }
  ]
)
  return (
    <RouterProvider router={routes}/>
  )
}

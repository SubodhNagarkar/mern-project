import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'

const Header = () => {
  const {userData} =useContext(AppContext);
  return (
    <div className='flex flex-col  items-center
    mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} className='w-36 h-36 
      rounded-full mb-6'/>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl
      font-medium m-2'>Hey {userData ? userData.name : 'Developer' }!  
      <img className='w-8 aspect-square'
          src={assets.hand_wave} /></h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome To Our App</h2>
      <p className='mb-8 max-w-md'>Lorem, ipsum dolor sit amet consectetur adipisicing
        elit.voluptatem possimus totam obcaecati aliquam pariatur nesciunt illo vitae.
      </p>
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-200 transition-all'>Get Started</button>
    </div>
  )
}

export default Header
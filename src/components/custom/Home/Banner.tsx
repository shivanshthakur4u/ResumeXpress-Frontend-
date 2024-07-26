import Image from 'next/image'
import React from 'react'
import HomeImage from "../../../assets/HomeImage.png";
function Banner() {
  return (
    <div className="flex justify-center relative lg:mt-28 md:mt-20 mt-10">
    <Image
      src={HomeImage}
      alt="home-image"
      className="absolute lg:-top-28 md:-top-16 -top-8"
      priority
    />
    <div className="bg-gray-100 lg:h-[450px] md:h-[280px] h-[130px] w-full"></div>
  </div>
  )
}

export default Banner
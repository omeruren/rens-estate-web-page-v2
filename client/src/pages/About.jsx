import React from 'react'

export default function About() {
  return (

    <div className="min-h-full dark:bg-black mx-auto ">
      <div className="px-5 md:flex dark:text-white text-4xl  justify-center  gap-8  font-semibold ">
        <div className='md:mt-20'>
           <h2 className="md:mt-5 text-3xl font-bold mb-4 text-center dark:text-white">About Us</h2>
           <p className="">
             At Rens Realty, we’re passionate about helping people find not just a house, but a place they can truly call home. With a focus on trust, professionalism, and personalized service, we make the process of buying, selling, or renting property simple and seamless. Our team of dedicated real estate experts is here to guide you every step of the way.
           </p>
           </div>
            <div>
           <h2 className="mt-8 text-3xl font-bold mb-4 text-center dark:text-white">Our Mission</h2>
           <p className="">
             We believe that every home has a story, and our mission is to help you write yours. Whether you're looking for your first home, expanding for a growing family, or investing in property, we’re committed to finding the perfect match for your needs. At Rens Realty, your satisfaction is our top priority because your future deserves the right foundation.
           </p>
         </div>
         </div>
            {/* Images */}
       <div className="p-8 grid md:grid-cols-3 gap-6">
         <img
           src="https://www.rismedia.com/wp-content/uploads/2018/02/real_estate_team_908692612.jpg"
           alt="team-working-1"
           className="w-full h-72 object-cover rounded-lg shadow"
         />
         <img
           src="https://alttitle.com/wp-content/uploads/2014/03/54956317_m.jpg"
           alt="team-working-2"
           className="w-full h-72 object-cover rounded-lg shadow"
         />
         <img
           src="https://www.mckissock.com/wp-content/uploads/2019/10/leading-her-team-to-the-top-picture-id1146087658-1024x512.jpg"
           alt="person"
           className="w-full h-72 object-cover rounded-lg shadow"
         />
       </div>
      </div>
    
    

  )
}

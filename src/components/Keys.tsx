import React from 'react'

export default function Keys() {
  const keys = ["a" ,"b" ,"c" ,"d" ,"e" ,"f" ,"g" ,"h" ,"i" ,"j" ,"k" ,"l" ,"m" ,"n" ,"o" ,"p" ,"q" ,"r" ,"s" ,"t" ,"u" ,"v" ,"w" ,"x" ,"y" ,"z"]
  return (
    <div className='flex justify-center'>
      <div className='flex-wrap align-middle'>
        {
          keys.map((key) => {
            return (
            
              <div key={key} className='inline-block bg-black border border-spacing-0.5 border-amber-200'>
              <text
              className='text-amber-50 my-2 mx-2 text-2xl'
              >{key}</text>
              </div>
              
            )
          })
        }
      </div>

    </div>
  )
}

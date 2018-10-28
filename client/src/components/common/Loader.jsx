import React from 'react'
import spinner from './loader.gif'

const Loader = () => {
  return (
    <div>
      <img
        src={spinner}
        alt='Loading....'
        title='Loading....'
        style={{width: '100px', margin: 'auto', display: 'block'}}
      />
    </div>
  )
}

export default Loader

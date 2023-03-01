import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.scss'

const Navbar = () => {
  return (
    <nav style={{height: '140px'}}>
        <div className='logo'>nba comparator</div>
        <ul className='navigation'>
          <Link to='/playerStats' ><li>Stats comparator</li></Link>
          <Link to='/games' ><li>Latest games</li></Link>
        </ul>
      </nav>
  )
}

export default Navbar
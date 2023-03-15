import React from 'react'
import {Link} from 'react-router-dom'

export function Login() {
  return (
    <div className="header">
    <a href="#default" className="logo">
      Optica
    </a>
    <div className="header-right">
      <Link to="/" className="active">
        Home
      </Link>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
      <Link to="/login" className="loginButton">
        Login
      </Link>
    </div>
  </div>
  )
}
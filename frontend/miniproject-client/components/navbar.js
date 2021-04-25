import Link from 'next/link'
import { IoHome,IoAccessibility,IoBagSharp,IoHappy,IoLockClosed,IoNewspaper,IoExit } from "react-icons/io5";
import logincss from '../styles/logincss.module.css'

const Navbar = () => (
    <div>
        <Link href="/"><a> <IoHome className = {logincss.size}/> Home </a></Link> |
        <Link href="/register"><a> <IoAccessibility className = {logincss.size}/> Register </a></Link>  |
        <Link href="/login"><a>  <IoLockClosed className = {logincss.size}/> Login </a></Link> |
        <Link href="/profile"><a> <IoHappy className = {logincss.size}/> Profile </a></Link> | 
        <Link href="/getConfig"><a> <IoNewspaper className = {logincss.size}/> Config </a></Link> | 
        <Link href="/presentproduct"><a> <IoBagSharp  className = {logincss.size}/> Amway Product </a></Link> | 
        <Link href="/logout"><a> <IoExit  className = {logincss.size}/> Logout </a></Link> 
    </div>
)

export default Navbar

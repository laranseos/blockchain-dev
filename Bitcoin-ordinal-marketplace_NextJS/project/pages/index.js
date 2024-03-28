import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Mint from '../components/Mint'
import ListInscriptions from '@/components/ListInscriptions'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
     <ListInscriptions/>
    </>
  )
}

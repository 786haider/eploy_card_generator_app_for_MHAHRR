'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/logo_without_text_bgremove.png';
import Typewriter from 'typewriter-effect';
import { CreditCard, UserSquare } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <div className="header bg-gradient-to-b from-black to-gray-500 flex flex-col items-center justify-center pb-10 min-h-screen">
        <div>
          <Image
            src={logo}
            alt="MHAHRR Naturals Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
          <h1 className='flex justify-center mt-20 text-8xl font-bold italic bg-gradient-to-b from-green-500 to-green-400 bg-clip-text text-transparent'>MHAHRR Naturals</h1>
        </div>

        <h2 className="mt-4 mb-6 text-3xl font-bold italic bg-gradient-to-b from-green-500 to-green-400 bg-clip-text text-transparent text-center h-12">
          <Typewriter
            options={{
              strings: ["Welcome to the Home Page of MHAHRR Natural's id card generator"],
              autoStart: true,
              loop: true,
            }}
          />
        </h2>
        <div className="flex flex-col md:flex-row gap-8 mt-10">
          {/* Card 1 */}
          <Link 
            href="/card-generator-1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 w-80 text-center text-white hover:border-green-400 hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-2"
          >
            <UserSquare className="h-16 w-16 mx-auto text-green-400 group-hover:text-green-300 transition-colors" />
            <h3 className="mt-6 text-2xl font-bold">Employ Card Generator One</h3>
            <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300">
              A modern and sleek employ ID card generator with a focus on a green, natural aesthetic.
            </p>
          </Link>

          {/* Card 2 */}
          <Link 
            href="/card-generator-2" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8 w-80 text-center text-white hover:border-blue-400 hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-2"
          >
            <UserSquare className="h-16 w-16 mx-auto text-blue-400 group-hover:text-blue-300 transition-colors" />
            <h3 className="mt-6 text-2xl font-bold">Employ Card Generator 2</h3>
            <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300">
              A professional and feature-rich card generator for creating detailed corporate employee ID card.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
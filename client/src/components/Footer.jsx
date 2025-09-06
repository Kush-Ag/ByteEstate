import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='bg-slate-800 text-slate-300 border-t border-slate-700'>
      <div className='max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <p className='text-sm'>© {year} Byte Estate. All rights reserved.</p>
        <nav className='flex gap-4 text-sm'>
          <Link className='hover:underline' to='/'>Home</Link>
          <Link className='hover:underline' to='/about'>About</Link>
          <Link className='hover:underline' to='/search'>Search</Link>
        </nav>
      </div>
    </footer>
  );
}



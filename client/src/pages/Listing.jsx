import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import { useUserInfo } from '../hooks/useUserInfo';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { userInfo, loading: userLoading } = useUserInfo(listing?.userRef);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='bg-slate-900 text-slate-200 min-h-screen'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border border-slate-700 rounded-full w-12 h-12 flex justify-center items-center bg-slate-800 cursor-pointer'>
            <FaShare
              className='text-slate-300'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-800 text-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ₹{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-300  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ₹{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-200'>
              <span className='font-semibold text-slate-100'>Description - </span>
              {listing.description}
            </p>
            {listing.userRef && (
              <div className='bg-slate-800 p-4 rounded-lg border border-slate-700'>
                <h3 className='text-lg font-semibold text-slate-100 mb-2'>Property Lister Information</h3>
                <div className='space-y-2'>
                  <p className='text-slate-300'>
                    <span className='font-medium text-slate-200'>Name: </span>
                    {userLoading ? 'Loading...' : userInfo?.username || 'Unknown'}
                  </p>
                  <p className='text-slate-300'>
                    <span className='font-medium text-slate-200'>Email: </span>
                    {userLoading ? 'Loading...' : userInfo?.email || 'Unknown'}
                  </p>
                </div>
                
                                 {/* Contact Button - Always show when there's a userRef */}
                 {!contact && (
                   <div className='mt-4 pt-4 border-t border-slate-700'>
                     {currentUser ? (
                       <button
                         onClick={() => setContact(true)}
                         className='w-full bg-blue-600 text-white rounded-lg uppercase hover:opacity-95 p-3 text-lg font-semibold'
                       >
                         📧 Contact This Lister
                       </button>
                     ) : (
                       <div className='bg-slate-700 p-3 rounded-lg text-center'>
                         <p className='text-slate-300 mb-2'>Want to contact this lister?</p>
                         <button
                           onClick={() => window.location.href = '/sign-in'}
                           className='bg-green-600 text-white rounded-lg px-4 py-2 hover:opacity-95'
                         >
                           Sign In to Contact
                         </button>
                       </div>
                     )}
                     <p className='text-xs text-slate-400 text-center mt-2'>
                       Send a message to inquire about this property
                     </p>
                   </div>
                 )}
              </div>
            )}
            <ul className='text-green-500 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            

            {/* Show contact form */}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}


    </main>
  );
}

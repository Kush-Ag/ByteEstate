import { useEffect, useState } from 'react';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setLandlord(data);
        }
      } catch (error) {
        setError('Failed to fetch landlord information');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleSendEmail = () => {
    if (!landlord?.email) {
      setError('Landlord email not available');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    // Create mailto link with proper encoding
    const subject = `Regarding ${listing.name}`;
    const body = message;
    
    // Encode the subject and body for the mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    const mailtoLink = `mailto:${landlord.email}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open the email client
    window.open(mailtoLink, '_blank');
    
    // Show success message
    setEmailSent(true);
    setError(null);
    
    // Clear the message
    setMessage('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setEmailSent(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className='flex flex-col gap-2 text-slate-200'>
        <p className='text-center'>Loading landlord information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col gap-2 text-slate-200'>
        <p className='text-red-400 text-center'>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className='bg-red-600 text-white p-2 rounded-lg hover:opacity-95'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2 text-slate-200'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='text-slate-200 font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <div className='relative'>
            <textarea
              name='message'
              id='message'
              rows='3'
              value={message}
              onChange={onChange}
              placeholder='Enter your message here...'
              className='w-full border border-slate-600 bg-slate-800 text-slate-100 p-3 rounded-lg resize-none'
              maxLength={500}
            ></textarea>
            <div className='absolute bottom-2 right-2 text-xs text-slate-400'>
              {message.length}/500
            </div>
          </div>

          <button
            onClick={handleSendEmail}
            className='bg-blue-600 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-50'
            disabled={!message.trim() || !landlord.email}
          >
            Send Message via Email
          </button>
          
          {emailSent && (
            <p className='text-green-400 text-center text-sm'>
              ✓ Email client opened! Your message is ready to send.
            </p>
          )}
          
          <p className='text-xs text-slate-400 text-center'>
            This will open your default email client
          </p>

          {/* Alternative contact methods */}
          <div className='border-t border-slate-700 pt-3 mt-2'>
            <p className='text-sm text-slate-300 mb-2'>Alternative contact methods:</p>
            <div className='flex flex-col gap-2'>
              <button
                onClick={() => navigator.clipboard.writeText(landlord.email)}
                className='bg-slate-700 text-slate-200 p-2 rounded-lg hover:bg-slate-600 text-sm'
              >
                Copy Email Address
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(`Subject: Regarding ${listing.name}\n\n${message}`)}
                className='bg-slate-700 text-slate-200 p-2 rounded-lg hover:bg-slate-600 text-sm'
              >
                Copy Message Template
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

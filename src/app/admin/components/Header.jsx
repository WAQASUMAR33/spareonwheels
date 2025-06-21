import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyHeaderImage, setCompanyHeaderImage] = useState('');
  const [companyIcon, setCompanyIcon] = useState('');
  const router = useRouter();

  // Check if the user is authenticated by looking for the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/admin'); // Redirect to login if not authenticated
    }
  }, [router]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');


  useEffect(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('userName');

    if (role && name) {
      setUserName(name);
      setUserRole(role); 
    } else {
      router.push('/login'); 
    }
  }, [router]);

  
  useEffect(() => {
    if (isAuthenticated) {
      async function fetchCompanyDetails() {
        console.log("Fetching company details...");
        try {
          const response = await fetch('/api/companydetails');
          const data = await response.json();
          console.log("Fetched data:", data);
          if (data) {
            setCompanyName(data.name);
            setCompanyHeaderImage(data.headerImage);
            setCompanyIcon(data.favIcon);
          }
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      }
      fetchCompanyDetails();
    }
  }, [isAuthenticated]);

  // Render nothing until authentication status is known
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="flex items-center justify-between bg-gray-700 p-3">
      <div className="flex items-center">
        {/* <button className="text-white text-xl px-2">
          <FontAwesomeIcon icon={faBars} />
        </button> */}
        <div className="flex items-center ml-4">
          {companyIcon && (
            <img
              className="rounded-full"
             src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${companyIcon}`}
              alt="Company Icon"
              width={40}
              height={40}
            />
          )}
          <span className="text-white text-2xl font-semibold ml-2">{companyName}</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {/* <div className="relative text-white">
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute top-0 right-3 h-4 w-4 bg-[#FF0000] text-xs flex items-center justify-center rounded-full">2</span>
        </div>
        <div className="relative text-white">
          <FontAwesomeIcon icon={faEnvelope} />
          <span className="absolute top-0 right-3 h-4 w-4 bg-[#FF0000] text-xs flex items-center justify-center rounded-full">3</span>
        </div> */}
        <div className="flex items-center">
          {/* <Image
            src="/ali.png"
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <span className="text-white text-base ml-2">{userName} | {userRole}</span>
        </div>
      </div>
      
    </header>
  );
};

export default Header;

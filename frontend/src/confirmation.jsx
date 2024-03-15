import { DataStore } from "aws-amplify";
import {HomeCookedCollection} from './models';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addMinutes } from 'date-fns';
import { Auth } from 'aws-amplify';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}




export default function Confirmation() {

    const [collection, setCollection] = useState(true);
    const [date, setDate] = useState(false);
    const [details, setDetails] = useState(false);
    const [collectionDate, setCollectionDate] = useState(new Date());
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const local = localStorage.getItem('selectedItems');
        if (local) {
            const parsedSelectedItems = JSON.parse(local);
            setSelectedItems(parsedSelectedItems);
        }
    }, []);
    
// get Auth details from Aws

    useEffect(() => {
      
        Auth.currentAuthenticatedUser().then(userInfo => {
            setName(userInfo.attributes.name);
            setEmail(userInfo.attributes.email);
            setTelephone(userInfo.attributes.phone_number);
        });
    }, []);

console.log(selectedItems);



    // 

    // get items from local storage

    const handleTimeClick = (time) => {
        let minutes;
        switch (time) {
          case 'Now':
            minutes = 0;
            break;
          case '15 minutes':
            minutes = 15;
            break;
          case '30 minutes':
            minutes = 30;
            break;
          case '1 Hour':
            minutes = 60;
            break;
          default:
            setDate(true);
            return;
        }
        const collectionTime = addMinutes(new Date(), minutes);
        console.log(`Collection time: ${format(collectionTime, 'pp')}`);
    setDetails(true)
        setCollectionDate(collectionTime);
        setCollection(false);
    
    
    
      }  
    
      const handleOrder = async () => {
       const date = new Date();
  const AWSDate = date.toISOString().split('T')[0];
  const AWSTime = date.toISOString().split('T')[1].slice(0, -1);
  const Float = parseFloat(selectedItems.reduce((acc, item) => acc + item.price, 0).toFixed(2));
  const Items = selectedItems.map(item => item.Name);
  const KitchenMenuId = selectedItems.map(item => item.id);

  console.log('Items:', Items);
  console.log('Collection Time:', AWSTime);
  console.log('Total:', Float);
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Telephone:', telephone);

  try {
    const collection = await DataStore.save(
      new HomeCookedCollection({
        CreatedTime: AWSTime,
        CreatedDate: AWSDate,
        Total: Float,
        HotItems: Items,
        CollectionTime: AWSTime,
        Completed: false,
        Delieved: false,
        Name: name,
        Kitchen: true,
        Email: email,
        Telephone: telephone,
        Prepaid: false
      })
    );
    console.log('Collection:', collection);

            localStorage.removeItem('selectedItems');
            navigate('/')
        } catch (error) {
          console.error("Failed to create collection:", error);
        }
      };
      

    return (
        // display items from local storage
        <div>
            <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="/homecooked.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="/"
                    className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    My Orders
                  </a>
                  
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="/homecooked.png"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-4 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                My Orders
              </Disclosure.Button>
              
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    <div className="md:flex mt-2 md:items-center md:justify-between sm:items-center text-center">
  <div className="min-w-0 flex-1">
    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
      My Order
    </h2>
  </div>
</div>

<ul role="list" className="divide-y divide-gray-100 mt-5 bg-green-50 rounded p-4">
  {selectedItems.map((item) => (
    <li key={item.name} className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
          <p className="mt-1 text-lg truncate leading-5 text-gray-500">£{item.price.toFixed(2)}</p>
        </div>
      </div>
    </li>
  ))}
</ul>

<h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center mt-5">
  Pick Collection Time
</h2>

<div className='flex justify-between ml-1 mt-5'>
 
  <button onClick={() => handleTimeClick('15 minutes')} className="rounded bg-green-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
    15 minutes
  </button>
  <button onClick={() => handleTimeClick('30 minutes')} className="rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
    30 minutes
  </button>
  <button onClick={() => handleTimeClick('1 Hour')} className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
    1 Hour
  </button>
  
</div>


{details && 
<div className="mt-5 bg-green-50 rounded-lg shadow-lg p-6 max-w-md mx-auto">
  <h1 className="text-center text-2xl font-bold">Collection Time</h1>
  <p className="text-center text-xl mt-2">{format(collectionDate, 'HH:mm')}</p>
  <p className="text-center text-lg mt-2">{format(collectionDate, 'do MMMM yyyy')}</p>
    <p className="text-center text-lg mt-2">Unit G11, Powerhub Business Centre, Maidstone ME16 0ST</p>

  <div className="mt-5">
    <h1 className="text-center text-xl font-bold">Name</h1>
    <p className="text-center text-lg mt-2">{name}</p>
  </div>
  <div className="mt-5">
    <h1 className="text-center text-xl font-bold">Email</h1>
    <p className="text-center text-lg mt-2">{email}</p>
  </div>
  <div className="mt-5">
    <h1 className="text-center text-xl font-bold">Telephone</h1>
    <p className="text-center text-lg mt-2">{telephone}</p>
  </div>
  <div className="mt-5">
    <h1 className="text-center text-xl font-bold">Total</h1>
    <p className="text-center text-lg mt-2">£{selectedItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</p>
  </div>
  <button onClick={handleOrder} className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 mt-5 w-full">
    Order Now
  </button>
</div>}


</div>

    )
}



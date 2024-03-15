import React, { useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { BellIcon, MenuIcon, XMarkIcon, Bars3Icon, CheckCircleIcon, ExclamationCircleIcon, CogIcon } from '@heroicons/react/20/solid'
import { Auth } from 'aws-amplify'
import { DataStore } from 'aws-amplify'
import { useState } from 'react'
import { HomeCookedCollection } from './models'
import { CakeIcon } from '@heroicons/react/24/outline'
import { set } from 'date-fns'
import { format } from 'date-fns'
import { addMinutes } from 'date-fns'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [again, setAgain] = useState([]);
    const [times, setTimes] = useState(false);
    const [collection, setCollection] = useState(false);
    const [collectionDate, setCollectionDate] = useState(null);
    const [details, setDetails] = useState(false);
    const [date, setDate] = useState(false);

    // get Authenticated user email and then check database for the email and get the orders

    useEffect(() => {
        async function getUser() {
            const user = await Auth.currentAuthenticatedUser();
            const email = user.attributes.email;
            console.log(email);
            const result = await DataStore.query(HomeCookedCollection)
            const orders = result.filter((order) => order.Email === email);
            console.log(orders);
            setOrders(orders);
        }
        getUser();

        // observe the database for changes
        const subscription = DataStore.observe(HomeCookedCollection).subscribe(msg => {
            console.log(msg.model, msg.opType, msg.element);
            getUser();
        });

        return () => subscription.unsubscribe();


    }, []);

    // handle the order again button
    async function handleAgain(orders) {
        console.log(orders);
        setTimes(true)
        
        setAgain(orders);
       
    }


   
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
        setCollectionDate(collectionTime);
        setCollection(false);
        setDetails(true);


    
    
    
      }  

        const handleOrder = async () => {
            // save the new order to the database

            // hot items is an array of strings

            const itemArray = again.HotItems;   

            

            const data = {
                Name: again.Name,
                Email: again.Email,
                Total: again.Total,
                HotItems: again.HotItems,
                CollectionTime: collectionDate,
                Completed: false,
                Delieved: false
            }
            await DataStore.save(new HomeCookedCollection(data));
            setDetails(false);
            setTimes(false);
            setDate(false);
        }


            





    return (
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
          href="/"
          className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
        >
          Home
        </Disclosure.Button>
        <Disclosure.Button
          as="a"
          href="/orders"
          className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        >
          My Orders
        </Disclosure.Button>
        
      </div>
    </Disclosure.Panel>
  </>
)}
</Disclosure>

  <div className="bg-purple-100 px-6 py-24 sm:py-32 lg:px-8 mb-10">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-5">My Orders</h2>
      
    </div>

    <ul role="list" className="divide-y divide-green-100">
      {orders.map((order) => {
    let time = order.CollectionTime;
    let slicedTime = time.substring(0, 5);
    let statusMessage = "";
    let statusColor = "";
    let Icon;
    let iconColor = "";

    if (!order.Completed && !order.Delieved) {
      statusMessage = "Cooking";
      statusColor = "bg-purple-500";
      Icon = CogIcon;
      iconColor = "text-white animate-spin";
    } else if (order.Completed && !order.Delieved) {
      statusMessage = "Ready For Collection";
      statusColor = "bg-green-500 animate-pulse";
      Icon = ExclamationCircleIcon;
      iconColor = "text-green-500";
    } else if (order.Completed && order.Delieved) {
      statusMessage = "Order Complete";
      statusColor = "bg-blue-700";
      Icon = CheckCircleIcon;
      iconColor = "text-white";
    }

    return (
        <li key={order.Name} className={`flex flex-col sm:flex-row justify-between gap-x-6 py-5 rounded-lg ${statusColor}`}>
        <div className="flex flex-col sm:flex-row justify-between w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:flex-1">
  <ol className="ml-3 font-medium text-white">
    {order.HotItems.map((item, index) => (
      <li key={`${item}-${index}`}>
        <label htmlFor={item}>{item}</label>
      </li>
    ))}
  </ol>
  <p className="mt-1 ml-3 text-lg leading-5 font-bold text-white">£{order.Total.toFixed(2)}</p>
</div>

          <div className="flex flex-col sm:flex-1 items-end">
            <p className="mt-1 text-lg font-medium leading-5 text-white">
              Pick Up Time: {slicedTime}

            </p>
            <p className="text-center text-xl mt-2 font-medium text-white">Date: {format(order.CreatedDate, 'dd/MM/yyyy')}</p>
            <p className="mt-1 text-lg leading-5 font-medium text-white">
              {order.Email}
            </p>
          </div>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <Icon className={`h-10 w-10 mr-2 animate-pulse ${iconColor}`} />
          <p className="mt-1 text-lg leading-5 text-white">
            {statusMessage}
          </p>
        </div>
        {order.Delieved && (
  <button onClick={() => handleAgain(order)} className="mt-4 sm:mt-0 text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg mr-2">Order Again</button>
)}

      </li>
      
      
      
        );
      })}
    </ul>
  </div>
    {times && (
    <div className="bg-purple-100 px-6 py-24 sm:py-32 lg:px-8 mb-10">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-5">Select Collection Time</h2>
    <div className='flex justify-between ml-1'>
     
    <button onClick={() => handleTimeClick('15 minutes')} className="rounded bg-green-50 px-2 py-1 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
      15 minutes
    </button>
    <button onClick={() => handleTimeClick('30 minutes')} className="rounded bg-orange-50 px-2 py-1 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
      30 minutes
    </button>
    <button onClick={() => handleTimeClick('1 Hour')} className="rounded bg-indigo-50 px-2 py-1 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
      1 Hour
    </button>
    </div>
    </div>
    {details && (
        <div className="bg-purple-100 px-6 py-24 sm:py-32 lg:px-8 mb-10">
            <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-5">Order Details</h2>
          <p className="text-lg font-semibold text-gray-700">Collection Time: {format(collectionDate, 'pp')}</p>
            <p className="text-lg font-semibold text-gray-700">Total: £{again.Total.toFixed(2)}</p>
            <p className="text-lg font-semibold text-gray-700">Email: {again.Email}</p>
            <p className="text-lg font-semibold text-gray-700">Hot Items: {again.HotItems.join(', ')}</p>
            
            <button onClick={handleOrder} className="mt-4 sm:mt-0 text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg">Confirm</button>


    </div>
    </div>


    )}
    </div>
    )}
    




   





</div>
    )
}




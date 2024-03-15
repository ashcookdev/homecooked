
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {KitchenMenu, HomeCookedCollection} from './models';
import { DataStore } from 'aws-amplify';
import { addMinutes, format, set } from 'date-fns';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import Alert from './alert';





const footerNavigation = {
 
  

  connect: [
    { name: 'Contact Us', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Pinterest', href: '#' },
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);
    const [collection , setCollection] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.log('User:', user);
        if (!user) {
          console.log('User not authenticated');
          // Navigate to /login page
          navigate('/login');
        }
      }
      catch (error) {
        console.error('Failed to get user:', error);
      }
    
    }
    
    const handleLogout = async () => {
      try {
        await Auth.signOut();
        console.log('User signed out');
        // Navigate to / page
window.location.reload();        
      } catch (error) {
        console.error('Failed to sign out:', error);
      }
    }
    
    const isLoggedIn = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.log('User:', user);
        if (user) {
          return true;
        }
      } catch (error) {
        console.error('Failed to get user:', error);
      }
      return false;
    }
    
    
    // get the menu items from the database

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(false);
    const [date, setDate] = useState(false);
const [collectionDate, setCollectionDate] = useState('');
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [telephone, setTelephone] = useState('');
const [extras, setExtras] = useState(false);

  // fetch kitchen menu 
  const FetchKitchenMenu = async () => {
    setLoading(true);
    try {
      const menus = await DataStore.query(KitchenMenu);
      console.log('Menus:', menus);  // Log menus to check if they are fetched correctly
      if (!menus) {
        console.log("No menus found");
        return;
      }
  
      const categories = [...new Set(menus.map(menu => menu.Category))]; // get unique categories
      console.log('Categories:', categories);  // Log categories to check if they are populated correctly
  
      const categoriesWithMenus = categories.map(category => ({
        name: category,
        menus: menus.filter(menu => menu.Category === category)
      }));
      console.log('Categories with Menus:', categoriesWithMenus);  // Log categoriesWithMenus
  
      setCategories(categoriesWithMenus);
    } catch (error) {
      console.error("Failed to fetch kitchen menu:", error);
    } finally {
      setLoading(false);
    }
  }
  
  
   

useEffect(() => {
  FetchKitchenMenu();
  
}, []);  


function handleAddToOrder(item) {
  console.log("clicked");
  console.log(item.Name);

  const extras = item.Extras;
  setExtras(true)

  // Show extras to the user
  console.log('Extras:', extras);

  // Parse the price to ensure it's a number
  const price = parseFloat(item.Price);
  
  // Create a new item with the menu name, price, and extras
  const newItem = { name: item.Name, price, extras };

  // Update the state with the new item
  setSelectedItems([...selectedItems, newItem]);
};

const handleExtras = (item) => {
  console.log('Item:', item);
  const newItems = [...selectedItems];
  newItems.push(item);
  setSelectedItems(newItems);
  setExtras(false);
};




    const handleRemoveFromOrder = (index) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
        };

        const handleCollection = async () => {
          console.log('selectedItems:', selectedItems);


          try {
            // Check if the user is authenticated
            const user = await Auth.currentAuthenticatedUser();
            console.log('User:', user);
        
            if (!user) {
              console.log('User not authenticated');
              // Navigate to /login page with state (selected items)
              navigate('/login', { state: { selectedItems } });
            } else {
              // User is authenticated, proceed with your logic
              // get users Email and Telephone and Name
              setEmail(user.attributes.email);
              setTelephone(user.attributes.phone_number);
              setName(user.name);
        
              setCollection(true);
            }
          } catch (error) {
         // save the selected items to local storage

          localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
          


            
            navigate('/login');
          }
        };
        




  const handleClearOrder = () => {
    setSelectedItems([]);
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
setDetails(true)
    setCollectionDate(collectionTime);
    setCollection(false);



  }  

  const handleOrder = async () => {
    const date = new Date();
const AWSDate = date.toISOString().split('T')[0];
const AWSTime = date.toISOString().split('T')[1].slice(0, -1);
const Float = parseFloat(selectedItems.reduce((acc, item) => acc + item.price, 0).toFixed(2));
const Items = selectedItems.map(item => item.name);
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

         navigate('/orders')
     } catch (error) {
       console.error("Failed to create collection:", error);
     }
   };
  


  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                {loading ? (
  <p>Loading...</p>
) : (  
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex space-x-8 px-4 overflow-x-auto">
                  {categories && categories.map((category) => (
    <div key={category.name} className="flex flex-col items-center">
      <Tab
        className={({ selected }) =>
          classNames(
            selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-purple-500',
            'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium'
          )
        }
      >
        {category.name}
      </Tab>
    </div>
  ))}
</Tab.List>


                  </div>
                  <Tab.Panels as={Fragment}>
                  {categories && categories.map((category) => (
    <Tab.Panel key={category.name} className="space-y-12 px-4 py-6">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10">
        {category && category.menus && category.menus.map((menu) => (
              <div key={menu.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                  {/* You can put menu image here */}
                </div>
                <p className="mt-6 block text-sm font-medium text-gray-900">
                  {menu.Name}
                </p>
                <p className="mt-1 block text-xs font-medium text-gray-500">
                  {menu.Description}
                </p>
                <button
                  onClick={() => handleAddToOrder(menu)}
                  type="button"
                  className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                >
                  Add To Order £{menu.Price.toFixed(2)}
                </button>
              </div>
            ))}
          </div>
        </Tab.Panel>
      ))}

    </Tab.Panels>
                </Tab.Group>
                )}

               

               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Hero section */}
      <div className="relative bg-white">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img
            src="/homecooked.png"
            alt=""
            className="h-full w-full object-contain object-center"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

        {/* Navigation */}
        <header className="relative z-10">
          <nav aria-label="Top">
          <div className="flex items-center space-x-4 p-2 bg-cover bg-black" >
  <a href="/orders" className="mr-2 text-white font-medium hover:text-yellow-300 transition-colors">
    My Orders
  </a>

  {/* Top navigation */}
  {isLoggedIn ? (
    <button
      onClick={() => handleLogout()}
      className="text-sm font-medium text-white lg:block bg-red-500 px-2 py-1 rounded hover:bg-red-700 transition-colors"
    >
      Log Out
    </button>
  ) : (
    <button
      onClick={() => handleLogin()}
      className="text-sm font-medium text-white lg:block bg-green-500 px-2 py-1 rounded hover:bg-green-700 transition-colors"
    >
      Log in
    </button>
  )}
</div>




            {/* Secondary navigation */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md backdrop-filter">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                  <div className="flex h-16 items-center justify-between">
                    {/* Logo (lg+) */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center">
                      <a href="#">
                        <span className="sr-only">Your Company</span>
                        <img
                          className="h-8 w-auto"
                          src="/homecooked.png"
                          alt=""
                        />
                      </a>
                    </div>
                    {loading ? (
  <p>Loading...</p>
) : (                    <div className="hidden h-full lg:flex">
                      {/* Flyout menus */}
                      <Popover.Group className="inset-x-0 bottom-0 px-4">
                      <div className="flex h-full justify-center space-x-8">
                      {categories && categories
  .filter(category => !['Extras', 'Event'].includes(category.name))
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((category) => (
    <Popover key={category.name} className="flex">
      {({ open }) => (
        <>
          <div className="relative flex">
            <Popover.Button className="relative z-10 flex items-center justify-center text-sm font-medium text-white transition-colors duration-200 ease-out">
              {category.name}
              <span
                className={classNames(
                  open ? 'bg-white' : '',
                  'absolute inset-x-0 -bottom-px h-0.5 transition duration-200 ease-out'
                )}
                aria-hidden="true"
              />
            </Popover.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-200"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
<Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500 bg-white shadow-lg">
              <div className="space-y-12 px-4 py-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-10">
  {category.menus.map((menu) => (
    <div key={menu.id} className="group relative">
      <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
        {/* You can put menu image here */}
      </div>
      <p className="mt-6 block text-sm font-medium text-gray-900">
        {menu.Name}
      </p>
      <p className="mt-1 block text-xs font-medium text-gray-500">
        {menu.Description}
      </p>
      {extras && 
<p className="mt-1 block text-sm font-bold text-blue-500">
  Additional Extras
</p>
}
      {extras && menu.Extras && menu.Extras.map((extra, index) => (
          
        <button onClick={() => handleExtras(extra)}
          key={index}
          type="button"
          className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-indigo-100 mt-2"
        >
          {extra.name} £{extra.price.toFixed(2)}
        </button>

        
      ))}

      <div className='mt-2'>
        {!extras && 
      <button
        onClick={() => handleAddToOrder(menu)}
        type="button"
        className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Add To Order £{menu.Price.toFixed(2)}
      </button>
}
      </div>
     
      <div>
     
      </div>
      {/* Extras buttons */}
     
    </div>
  ))}
</div>

              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  ))}
</div>


                              
                            

                          
                        
                      </Popover.Group>
                    </div>
                    )}

                    {/* Mobile menu and search (lg-) */}
                    <div className="flex flex-1 items-center lg:hidden">
                      <button type="button" className="-ml-2 p-2 text-white" onClick={() => setMobileMenuOpen(true)}>
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Search */}
                      
                    </div>

                    {/* Logo (lg-) */}
                    <a href="#" className="lg:hidden">
                      <span className="sr-only">Your Company</span>
                      <img src="/homecooked.png" alt="" className="h-8 w-auto" />
                    </a>

                    <div className="flex flex-1 items-center justify-end">
                      <a href="#" className="hidden text-sm font-medium text-white lg:block">
                        Search
                      </a>

                      <div className="flex items-center lg:ml-8">
                        
                       

                        <div className="ml-4 flow-root lg:ml-8">
                          <a href="#" className="group -m-2 flex items-center p-2">
                            <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-white" aria-hidden="true" />
                            <span className="ml-2 text-sm font-medium text-white">{selectedItems.length}</span>
                            <span className="sr-only">items in cart, view bag</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
         
         
         
        </div>
      </div>

      <main>
        <Alert />
      {selectedItems.map((selectedItem, index) => (
  <li key={index} className="flex py-6 sm:py-10">
    <div className="flex-shrink-0">
      <img
        src="/homecooked.png"
        alt="Selected item"
        className="h-8 w-8 rounded-md object-cover object-center sm:h-48 sm:w-48"
      />
    </div>

    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
        <div>
          <div className="flex justify-between">
            <h3 className="text-sm">
              {selectedItem.name}
            </h3>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900">
            £{selectedItem.price.toFixed(2)}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 sm:pr-9">
          <div className="absolute right-0 top-0">
            <button
              type="button"
              onClick={() => handleRemoveFromOrder(index)}
              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Remove</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>
))}

<div className="ml-4 text-right sm:ml-6">
  <h1 className="text-sm font-medium text-gray-900">
    Total
  </h1>
  <h1 className="mt-1 text-sm font-medium text-gray-900">
    £{selectedItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
  </h1>
  
  <button type="button" onClick={handleCollection} className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
    Collection Time
  </button>
  {collection && <div className='flex justify-between ml-1'>
     
      <button onClick={() => handleTimeClick('15 minutes')} className="rounded bg-green-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
        15 minutes
      </button>
      <button onClick={() => handleTimeClick('30 minutes')} className="rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
        30 minutes
      </button>
      <button onClick={() => handleTimeClick('1 Hour')} className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-1">
        1 Hour
      </button>
      </div>
  }
  
      
  {details && 
<div className="mt-5 bg-green-50 rounded-lg shadow-lg p-6 max-w-md mx-auto">
  <h1 className="text-center text-2xl font-bold">Collection Time</h1>
  <p className="text-center text-xl mt-2">{format(collectionDate, 'HH:mm')}</p>
  <p className="text-center text-xl mt-2">{format(collectionDate, 'dd/MM/yyyy')}</p>
  <p className="text-center text-xl mt-2"> Unit G11, Powerhub Business Centre, Maidstone ME16 0ST</p>


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
        



       

        {/* Featured section */}
        <section
          aria-labelledby="social-impact-heading"
          className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src="/homecooked.png"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
         
          </div>
        </section>

        {/* Collection section */}
     
        {/* Featured section */}
    
      </main>

    
    </div>

  )
}

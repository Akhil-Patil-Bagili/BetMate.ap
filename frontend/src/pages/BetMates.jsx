import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineUserAdd, HiCheck, HiX, HiOutlineClock } from 'react-icons/hi';
import { FaUserMinus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBetMates,
  fetchPendingRequests,
  addBetMateAsync,
  removeBetMateAsync,
  acceptRequestAsync,
  declineRequestAsync
} from '../redux/slices/friendSlice';
import { searchUsers, clearResults } from '../redux/slices/searchSlice';
import debounce from 'lodash.debounce';

function BetMates() {
    const [searchTerm, setSearchTerm] = useState('');
    const [requestSent, setRequestSent] = useState({});
    const searchRef = useRef(null);

    const dispatch = useDispatch();
  const { user } = useAuth();

  const betMates = useSelector((state) => state.friends.betMates);
  const pendingRequests = useSelector((state) => state.friends.pendingRequests);

  const isLoading = useSelector((state) => state.ui.loading);
  const searchResults = useSelector((state) => state.search.results);
    
  
  const debouncedSearch = React.useRef(
    debounce((query) => {
      dispatch(searchUsers(query));
    }, 400)
  ).current;

  useEffect(() => {
    if (user) {
      dispatch(fetchBetMates(user.userId));
      dispatch(fetchPendingRequests(user.userId));
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [user, dispatch, debouncedSearch]);

  const handleSearch = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    if (inputValue.length >= 1) {
      debouncedSearch(inputValue);
    } else {
      dispatch(clearResults());
    }
  };

    const handleSelectBetMate = (selectedUser) => {
        setSearchTerm(`${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.username})`);
        dispatch(clearResults());
    };

    const handleAddBetMate = (addresseeId) => {
        if (!user) return;
        if (requestSent[addresseeId]) {
          console.warn('Request already sent!');
          return;
        }
        dispatch(addBetMateAsync({ requesterId: user.userId, addresseeId }))
          .unwrap()
          .then(() => {
            setRequestSent((prev) => ({ ...prev, [addresseeId]: true }));
            console.log('Request sent successfully');
          })
          .catch((error) => {
            console.error('Failed to send friend request:', error);
            alert('Failed to send friend request. Please try again.');
          });
      };

      const handleRemoveBetMate = (betMateId) => {
        if (!user) return;
        dispatch(removeBetMateAsync({ userId: user.userId, betMateId }))
          .unwrap()
          .then(() => {
            console.log('Friend removed successfully');
          })
          .catch((error) => {
            console.error('Failed to remove betmate:', error);
            alert('Failed to remove betmate. Please try again.');
          });
      };

      const handleApproval = (requestId) => {
        if (!user) return;
        dispatch(acceptRequestAsync({ requestId }))
          .unwrap()
          .then(() => {
            console.log('Approval successful');
            // Refresh data
            dispatch(fetchBetMates(user.userId));
            dispatch(fetchPendingRequests(user.userId));
          })
          .catch((error) => {
            console.error('Failed to approve friend request:', error);
            alert('Failed to approve friend request. Please try again.');
          });
      };
    

      const handleRejection = (requestId) => {
        if (!user) return;
        dispatch(declineRequestAsync({ requestId }))
          .unwrap()
          .then(() => {
            console.log('Rejection successful');
            // Refresh data
            dispatch(fetchPendingRequests(user.userId));
          })
          .catch((error) => {
            console.error('Failed to decline friend request:', error);
            alert('Failed to decline friend request. Please try again.');
          });
      };

    

    
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          dispatch(clearResults());
        }
      };

    return (
        <div className="pt-20 lg:pl-64 px-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg">
            {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="spinner-border text-white">
              Loading...
            </div>
          </div>
        )}
                <div className="mb-6 text-left">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Add Betmates</h1>
                    <input
                        type="text"
                        placeholder="Search for a betmate... "
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 transition"
                    />
                    <div ref={searchRef}>
                        {searchResults.length > 0 && (
                            <ul className="absolute w-72 mt-2 bg-white shadow-lg max-h-60 overflow-auto border border-gray-300 rounded-lg">
                                {searchResults.map(addresseUser => (
                                    <li key={addresseUser.id} className="flex justify-between items-center p-3 hover:bg-gray-100">
                                        {/* <span>{addresseUser.name}</span> */}
                                        <span
                                            onClick={() => handleSelectBetMate(addresseUser)}
                                            className="cursor-pointer"
                                        >
                                            {addresseUser.firstName} {addresseUser.lastName} ({addresseUser.username})
                                        </span>
                                        <button onClick={() => handleAddBetMate(addresseUser.id)} className="text-gray-500 hover:text-gray-700">
                                            {requestSent[addresseUser.id] ? <HiOutlineClock className="text-yellow-500 text-xl" /> : <HiOutlineUserAdd className="text-xl" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-12  mb-3">Pending Requests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {pendingRequests.map(request => (
                        <div key={request.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow">
                            <div className="flex-grow">
                                <h5 className="font-semibold">{request.name}</h5>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => handleApproval(request.id)} className="text-green-500 hover:text-green-600"><HiCheck className="text-xl" /></button>
                                <button onClick={() => handleRejection(request.id)} className="text-red-500 hover:text-red-600"><HiX className="text-xl" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-12 mb-3">My Betmates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {betMates.map(betMate => (
                        <div key={betMate.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow">
                            <div className="flex-grow">
                                {/* <h5 className="font-semibold">{betMate.name}</h5> */}
                                <h5 className="font-semibold">
                                    {betMate.name} ({betMate.username})
                                 </h5>
                            </div>
                            <div className="flex space-x-3">
                                {/* <AiOutlineCheckCircle className="text-green-500" /> */}
                                <button onClick={() => handleRemoveBetMate(betMate.id)} className="text-red-600 hover:text-red-800">
                                    <FaUserMinus className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BetMates;

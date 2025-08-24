import { GoogleMap, Autocomplete, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useRef,useState,useEffect, useMemo } from "react";



const ShopModal = ({ isOpen, onClose, onSave, shopToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: '',
    image: '',
    isApproved: true,
    longitude: '',
    latitude: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',  
  });
  
  const [errors, setErrors] = useState({});
  const ahmedabadCenter = { lat: 23.0225, lng: 72.5714 };
  const [markerPosition, setMarkerPosition] = useState(ahmedabadCenter);
  const autocompleteRef = useRef(null);
  const isEditMode = !!shopToEdit;
//   const [scriptLoaded, setScriptLoaded] = useState(false);

  // Google Maps loader
  const memoizedOptions = useMemo(() => ({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: ['places'],
  }), []);

  const { isLoaded } = useJsApiLoader(memoizedOptions);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        const initialPosition = shopToEdit.location?.coordinates?.length 
          ? { 
              lat: parseFloat(shopToEdit.location.coordinates[1]),
              lng: parseFloat(shopToEdit.location.coordinates[0])
            }
          : { lat: 23.0225, lng: 72.5714 };
        setFormData({
          name: shopToEdit.name || '',
          description: shopToEdit.description || '',
          address: shopToEdit.address || '',
          category: shopToEdit.category || '',
          image: shopToEdit.image || '',
          isApproved: true,
          longitude: initialPosition.lng,
          latitude: initialPosition.lat,
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          
        });
        
        setMarkerPosition(initialPosition);
      } else {
        setFormData({
          name: '',
          description: '',
          address: '',
          category: '',
          image: '',
          isApproved: true,
          longitude: '',
          latitude: '',
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
        });
        
        setMarkerPosition({ lat: 23.0225, lng: 72.5714 });
      }
      setErrors({});
    }
  }, [isOpen, shopToEdit, isEditMode]);

  // Handle place selection from autocomplete
  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        const newPosition = { lat: location.lat(), lng: location.lng() };
        setMarkerPosition(newPosition);
        setFormData(prev => ({
          ...prev,
          longitude: newPosition.lng,
          latitude: newPosition.lat
        }));
      }
    }
  };

  // Handle marker drag
  const handleMarkerDragEnd = (e) => {
    const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(newPosition);
    setFormData(prev => ({
      ...prev,
      longitude: newPosition.lng,
      latitude: newPosition.lat
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Shop validation
    if (!formData.name) newErrors.name = "Shop name is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    
    // Owner validation (only for new shops)
    if (!isEditMode) {
      if (!formData.ownerName) newErrors.ownerName = "Owner name is required.";
      if (!formData.ownerEmail) {
        newErrors.ownerEmail = "Owner email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Owner email is invalid.";
      }
      if (!formData.ownerPhone) newErrors.ownerPhone = "Owner phone is required.";
      
      
    }
    
    // Location validation
    const long = parseFloat(formData.longitude);
    const lat = parseFloat(formData.latitude);
    
    if (isNaN(long) || isNaN(lat)) {
      newErrors.location = "Please select a location on the map";
    } else if (long < -180 || long > 180 || lat < -90 || lat > 90) {
      newErrors.location = "Invalid coordinates";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        // Prepare location data for edit mode
        const longitude = parseFloat(formData.longitude);
        const latitude = parseFloat(formData.latitude);
        
        // Prepare the shop data for edit
        const shopData = {
          name: formData.name,
          description: formData.description,
          address: formData.address,
          category: formData.category,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
        };
      
        onSave(shopData, shopToEdit._id);
      } else {
        // Prepare data for new shop - EXCLUDE confirmPassword
        const requestData = {
          name: formData.ownerName,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          shop: {
            name: formData.name,
            category: formData.category,
            address: formData.address,
            description: formData.description,
            location: {
              type: 'Point',
              coordinates: [
                parseFloat(formData.longitude),
                parseFloat(formData.latitude)
              ]
            }
          }
        };
        onSave(requestData, null);
      }
    }
  };

  if (!isOpen) return null;

  // Map container style
  const mapContainerStyle = {
    height: '300px',
    width: '100%',
    borderRadius: '0.5rem'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 max-h-[90vh] overflow-y-auto ">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Update Shop" : "Add New Shop"}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Information Column (only for new shops) */}
            {!isEditMode && (
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Owner Information</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerName">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.ownerName && 'border-red-500'}`}
                  />
                  {errors.ownerName && <p className="text-red-500 text-xs italic">{errors.ownerName}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerEmail">
                    Owner Email *
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    id="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.ownerEmail && 'border-red-500'}`}
                  />
                  {errors.ownerEmail && <p className="text-red-500 text-xs italic">{errors.ownerEmail}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerPhone">
                    Owner Phone *
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.ownerPhone && 'border-red-500'}`}
                  />
                  {errors.ownerPhone && <p className="text-red-500 text-xs italic">{errors.ownerPhone}</p>}
                </div>
              </div>
            )}
            
            {/* Shop Information Column */}
            <div className={isEditMode ? "md:col-span-2" : ""}>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Shop Information</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name && 'border-red-500'}`}
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.category && 'border-red-500'}`}
                />
                {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    name="isApproved"
                    checked={true}
                    readOnly
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700 font-medium">Approved</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Shops are always approved by default</p>
              </div>
            </div>
          </div>
          
          {/* Google Map Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Shop Location *</h3>
            <p className="text-sm text-gray-600 mb-4">
              Search for an address or click on the map to set the shop location
            </p>
            
            {errors.location && (
              <p className="text-red-500 text-sm mb-2">{errors.location}</p>
            )}
            
            <div className="border rounded-lg overflow-hidden">
              {isLoaded ? (
                <div style={{ position: 'relative', height: mapContainerStyle.height }}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPosition}
                    zoom={13}
                    options={{
                      mapTypeControl: false,
                      zoomControl: true,
                      streetViewControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <Autocomplete
                      onLoad={(ref) => (autocompleteRef.current = ref)}
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Search for an address"
                        style={{
                          boxSizing: `border-box`, 
                          border: `1px solid transparent`, 
                          width: `240px`, 
                          height: `40px`, 
                          padding: `0 12px`, 
                          borderRadius: `9999px`, 
                          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, 
                          fontSize: `14px`, 
                          outline: `none`, 
                          textOverflow: `ellipsis`, 
                          position: "absolute", 
                          left: "50%", 
                          marginLeft: "-120px", 
                          top: "10px",
                          zIndex: 1
                        }}
                      />
                    </Autocomplete>
                    <Marker 
                      position={markerPosition} 
                      draggable={true} 
                      onDragEnd={handleMarkerDragEnd} 
                    />
                  </GoogleMap>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-gray-100">
                  <p>Loading map...</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Selected coordinates:</p>
              {!isNaN(parseFloat(formData.longitude)) && !isNaN(parseFloat(formData.latitude)) ? (
                <p className="font-mono">
                  Longitude: {Number(formData.longitude).toFixed(6)}, 
                  Latitude: {Number(formData.latitude).toFixed(6)}
                </p>
              ) : (
                <p>No location selected</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isEditMode ? "Update Shop" : "Create Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopModal;

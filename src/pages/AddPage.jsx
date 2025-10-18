import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import UserSearchDropdown from '../components/ui/UserSearchDropdown';
import { useAdd } from '../context/AddContext';
import { useRooms } from '../context/RoomsContext';
import { channelsService } from '../api/channels/channelsService';
import { X, Hash, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

const AddPage = () => {
  const navigate = useNavigate();
  const { selectedAddOption, closeForm } = useAdd();
  const { createRoom } = useRooms();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [channelForm, setChannelForm] = useState({
    name: '',
    members: [],
  });

  const [dmForm, setDmForm] = useState({
    username: '',
    message: '',
  });

  // Channel name validation
  const [nameValidation, setNameValidation] = useState({
    isValid: null,
    message: '',
    isChecking: false,
  });

  // Validate channel name availability
  const validateChannelName = async (name) => {
    if (!name.trim()) {
      setNameValidation({ isValid: null, message: '', isChecking: false });
      return;
    }

    try {
      setNameValidation(prev => ({ ...prev, isChecking: true }));
      const result = await channelsService.getChannels(100, 0);
      
      if (result.success) {
        const existingChannel = result.channels.find(
          channel => channel.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingChannel) {
          setNameValidation({
            isValid: false,
            message: 'Channel name already exists',
            isChecking: false,
          });
        } else {
          setNameValidation({
            isValid: true,
            message: 'Channel name is available',
            isChecking: false,
          });
        }
      } else {
        setNameValidation({
          isValid: false,
          message: 'Unable to validate channel name',
          isChecking: false,
        });
      }
    } catch (err) {
      setNameValidation({
        isValid: false,
        message: 'Error validating channel name',
        isChecking: false,
      });
    }
  };

  // Debounced channel name validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateChannelName(channelForm.name);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [channelForm.name]);

  // Handle channel form submission
  const handleChannelSubmit = async (e) => {
    e.preventDefault();
    if (!channelForm.name.trim() || nameValidation.isValid !== true) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Prepare channel data
      const channelData = {
        name: channelForm.name.trim(),
        members: channelForm.members.map(member => member.username),
        excludeSelf: true,
        customFields: {
          type: 'default'
        },
        extraData: {
          broadcast: true,
          encrypted: false
        }
      };

      console.log('🚀 Sending channel creation request:');
      console.log('📤 Channel Data:', JSON.stringify(channelData, null, 2));
      console.log('👥 Selected Members:', channelForm.members);

      const result = await channelsService.createChannel(channelData);

      console.log('📥 Channel creation response:');
      console.log('✅ Success:', result.success);
      if (result.success) {
        console.log('🏠 Created Channel:', result.channel);
      } else {
        console.log('❌ Error:', result.error);
      }

      if (result.success) {
        // Navigate to home and close form
        navigate('/home');
        closeForm();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create channel');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle DM form submission
  const handleDMSubmit = async (e) => {
    e.preventDefault();
    if (!dmForm.username.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      // TODO: Implement DM creation API
      console.log('Creating DM with:', dmForm);
      
      // For now, just show success and close
      navigate('/home');
      closeForm();
    } catch (err) {
      setError('Failed to create direct message');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleChannelChange = (e) => {
    const { name, value } = e.target;
    setChannelForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle member selection
  const handleMembersChange = (members) => {
    console.log('👥 Members changed:');
    console.log('📋 New members array:', members);
    console.log('👤 Member usernames:', members.map(m => m.username));
    
    setChannelForm(prev => ({
      ...prev,
      members
    }));
  };

  const handleDMChange = (e) => {
    const { name, value } = e.target;
    setDMForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {selectedAddOption === 'channel' ? (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Create New Channel</h2>
                    <p className="text-sm text-gray-600">Set up a new channel for your team</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Direct Message</h2>
                    <p className="text-sm text-gray-600">Start a private conversation</p>
                  </div>
                </>
              )}
            </div>
            <Button
              onClick={() => {
                closeForm();
                navigate('/home');
              }}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Channel Form */}
          {selectedAddOption === 'channel' && (
            <form onSubmit={handleChannelSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={channelForm.name}
                    onChange={handleChannelChange}
                    placeholder="e.g. general, announcements"
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all ${
                      nameValidation.isValid === true 
                        ? 'border-green-300 focus:ring-green-500' 
                        : nameValidation.isValid === false 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {nameValidation.isChecking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {nameValidation.isValid === true && !nameValidation.isChecking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  {nameValidation.isValid === false && !nameValidation.isChecking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                {nameValidation.message && (
                  <p className={`mt-1 text-xs ${
                    nameValidation.isValid === true 
                      ? 'text-green-600' 
                      : nameValidation.isValid === false 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  }`}>
                    {nameValidation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Members (Optional)
                </label>
                <UserSearchDropdown
                  selectedUsers={channelForm.members}
                  onUsersChange={handleMembersChange}
                  placeholder="Search and add team members..."
                />
              </div>


              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    closeForm();
                    navigate('/home');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!channelForm.name.trim() || nameValidation.isValid !== true || isSubmitting}
                  variant="primary"
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create Channel'}
                </Button>
              </div>
            </form>
          )}

          {/* Direct Message Form */}
          {selectedAddOption === 'dm' && (
            <form onSubmit={handleDMSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={dmForm.username}
                  onChange={handleDMChange}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={dmForm.message}
                  onChange={handleDMChange}
                  placeholder="Start the conversation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    closeForm();
                    navigate('/home');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!dmForm.username.trim() || isSubmitting}
                  variant="primary"
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Start Conversation'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AddPage;

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';

const BarterRoom = () => {
  const { id: booking_id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initRoom = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Note: Currently backend doesn't have GET /bookings/:id. We should add that in Phase 5 API touchup.
        // For now, we connect socket.

        // Initialize Socket
        socketRef.current = io('http://localhost:5000/barter', {
          auth: { token }
        });

        // Listen for connection error
        socketRef.current.on('connect_error', (err) => {
          setError('Failed to connect to negotiation room. ' + err.message);
          setLoading(false);
        });

        // Listen for custom errors from server
        socketRef.current.on('error', (msg) => {
          setError(msg);
          setLoading(false);
        });

        // Join the room
        socketRef.current.emit('join_room', { booking_id });

        // Handle joining room success (history fetch)
        socketRef.current.on('room_joined', (data) => {
          setMessages(data.history || []);
          setLoading(false);
        });

        // Listen for new incoming messages
        socketRef.current.on('new_message', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        // Listen for trade state changes
        socketRef.current.on('trade_accepted', (data) => {
          // We could update local booking state here if we had it
        });

        socketRef.current.on('trade_rejected', () => {
          // Handle rejection
        });

      } catch (err) {
        setError('Failed to initialize room');
        setLoading(false);
      }
    };

    initRoom();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [booking_id, navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socketRef.current) return;
    socketRef.current.emit('send_message', { booking_id, content: newMessage });
    setNewMessage('');
  };

  const acceptTrade = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('accept_trade', { booking_id, barter_terms: 'Agreed in chat' });
  };

  const rejectTrade = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('reject_trade', { booking_id });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Connecting to negotiation room...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-secondary">Barter Negotiation</h1>
          <p className="text-sm text-gray-500">Booking ID: {booking_id.substring(0, 8)}...</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={rejectTrade} className="px-4 py-2 text-sm font-medium text-gray-600 transition bg-gray-100 rounded hover:bg-gray-200">Reject Trade</button>
          <button onClick={acceptTrade} className="px-4 py-2 text-sm font-medium text-white transition bg-primary-600 rounded hover:bg-primary-700">Accept Trade</button>
        </div>
      </header>

      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col max-w-3xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.is_system ? 'justify-center' : (msg.sender_id === 'local-user-id-placeholder' ? 'justify-end' : 'justify-start')}`}>
              {msg.is_system ? (
                <div className="px-4 py-1 text-xs text-gray-500 bg-gray-200 rounded-full">{msg.content}</div>
              ) : (
                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender_id === 'local-user-id-placeholder' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border text-secondary rounded-bl-none shadow-sm'}`}>
                  <p className="text-sm">{msg.content}</p>
                  <span className={`text-[10px] mt-1 block ${msg.sender_id === 'local-user-id-placeholder' ? 'text-primary-100' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t shrink-0">
        <form onSubmit={sendMessage} className="flex max-w-3xl mx-auto space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:ring-primary-500 focus:border-primary-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={!newMessage.trim()} className="px-6 py-2 font-medium text-white transition rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default BarterRoom;

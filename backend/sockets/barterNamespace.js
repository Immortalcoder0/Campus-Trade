const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const BarterMessage = require('../models/BarterMessage');

module.exports = function (io) {
  const barterIo = io.of('/barter');

  // Authentication Middleware
  barterIo.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  barterIo.on('connection', (socket) => {
    console.log(`Socket connected to /barter namespace: ${socket.id} (User: ${socket.user.id})`);

    // EVENT: Join Room
    socket.on('join_room', async ({ booking_id }) => {
      try {
        const booking = await Booking.findById(booking_id).populate('item_id');
        if (!booking) return;

        const isBorrower = booking.borrower_id.toString() === socket.user.id;
        const isLender = booking.item_id.owner_id.toString() === socket.user.id;

        if (!isBorrower && !isLender) {
          return socket.emit('error', 'Not authorized to join this room');
        }

        socket.join(booking_id);

        // Fetch last 50 messages
        const messages = await BarterMessage.find({ booking_id })
          .sort({ createdAt: 1 })
          .limit(50);

        socket.emit('room_joined', { booking_id, history: messages });
      } catch (err) {
        console.error(err);
      }
    });

    // EVENT: Send Message
    socket.on('send_message', async ({ booking_id, content }) => {
      try {
        // Build message and persist to MongoDB
        const newMsg = await BarterMessage.create({
          booking_id,
          sender_id: socket.user.id,
          content
        });

        // Broadcast to all clients in the room
        barterIo.to(booking_id).emit('new_message', newMsg);
      } catch (err) {
        console.error(err);
      }
    });

    // EVENT: Accept Trade (Lender Only)
    socket.on('accept_trade', async ({ booking_id, barter_terms }) => {
      try {
        const booking = await Booking.findById(booking_id).populate('item_id');
        if (!booking) return;

        // Ensure only the lender can accept
        if (booking.item_id.owner_id.toString() !== socket.user.id) {
          return socket.emit('error', 'Only the item owner can accept the trade');
        }

        booking.status = 'Active';
        booking.payment_type = 'Barter';
        if (barter_terms) booking.barter_terms = barter_terms;
        await booking.save();

        const systemMsg = await BarterMessage.create({
          booking_id,
          content: 'Trade accepted by owner. Booking is now active.',
          is_system: true
        });

        barterIo.to(booking_id).emit('trade_accepted', { booking_id, barter_terms });
        barterIo.to(booking_id).emit('new_message', systemMsg);
      } catch (err) {
        console.error(err);
      }
    });

    // EVENT: Reject Trade
    socket.on('reject_trade', async ({ booking_id }) => {
      try {
        const booking = await Booking.findById(booking_id);
        if (!booking) return;

        booking.status = 'Cancelled';
        await booking.save();

        const systemMsg = await BarterMessage.create({
          booking_id,
          content: 'Trade was rejected and the booking has been cancelled.',
          is_system: true
        });

        barterIo.to(booking_id).emit('trade_rejected', { booking_id });
        barterIo.to(booking_id).emit('new_message', systemMsg);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return barterIo;
};

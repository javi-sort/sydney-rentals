import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
    url: { type: String, required: true},
    suburb: { type: String, required: true},
    price: { type: Number, required: true},
    beds: { type: Number, required: true},
    baths: { type: Number, required: true},
    isActive: { type: Boolean, default: true},
    agentName: { type: String },
    agentPhone: { type: String },
    agentRole: { type: String }
}, { timestamps: true });

const Listing = mongoose.model('Listing', ListingSchema);
export default Listing;
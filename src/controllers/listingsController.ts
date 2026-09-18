import { Request, Response } from 'express';
import Listing from '../models/Listing';

// Return all listings, active ones first then newest
export const getListings = async (req: Request, res: Response) => {
    try {
        const listings = await Listing.find().sort({ isActive: -1, createdAt: -1 });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Save an individual listing to DB
export const saveListing = async (req: Request, res: Response) => {
    console.log('saveListing hit!', req.body);
    try {
        const listing = new Listing(req.body);
        await listing.save();

        res.header('Access-Control-Allow-Origin', '*');
        res.status(201).json({ message: 'Listing saved!' });
    } catch (err) {
        console.error('Save error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a listing from the DB
export const deleteListing = async (req: Request, res: Response) => {
    // TODO
};

// Mark a listing as inactive
export const deactivateListing = async (req: Request, res: Response) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!listing) return res.status(404).json({ message: 'Not found' });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// HEAD-check every stored URL in parallel and update isActive accordingly
export const checkListingUrls = async (req: Request, res: Response) => {
    try {
        const listings = await Listing.find();
        await Promise.all(listings.map(async (l) => {
            try {
                const response = await fetch(l.url, {
                    method: 'HEAD',
                    redirect: 'follow',
                    signal: AbortSignal.timeout(5000),
                });
                await Listing.updateOne({ _id: l._id }, { isActive: response.ok });
            } catch {
                // Network error or timeout — leave isActive unchanged
            }
        }));
        res.json({ checked: listings.length });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

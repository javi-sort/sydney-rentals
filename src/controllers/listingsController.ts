import { Request, Response } from 'express';
import Listing from '../models/Listing';

// Return all listings
export const getListings = async (req: Request, res: Response) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
};

// Save an individual listing
export const saveListing = async (req: Request, res: Response) => {
    try {
        const listing = new Listing(req.body);
        await listing.save();

        res.status(201).json({ message: 'Listing saved!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
};
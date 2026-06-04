import { Request, Response } from 'express';
import Listing from '../models/Listing';

// Return all listings
export const getListings = async (req: Request, res: Response) => {
    try {
        const listings = await Listing.find();
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

export const deactivateListing = async (req: Request, res: Response) => {
    // TODO
};

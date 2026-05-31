import { Router } from 'express';
import { getListings, saveListing } from '../controllers/listingsController';

const router = Router();

router.get('/', getListings);
router.post('/', saveListing);

export default router;
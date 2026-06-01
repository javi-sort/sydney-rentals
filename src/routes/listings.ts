import { Router } from 'express';
import { getListings, saveListing, deleteListing, deactivateListing } from '../controllers/listingsController';

const router = Router();

router.get('/', getListings);
router.post('/', saveListing);
router.delete('/:id', deleteListing);
router.patch('/:id/deactivate', deactivateListing);

export default router;
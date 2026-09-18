import { Router } from 'express';
import { getListings, saveListing, deleteListing, deactivateListing, checkListingUrls } from '../controllers/listingsController';

const router = Router();

router.get('/', getListings);
router.post('/', saveListing);
router.post('/check-urls', checkListingUrls);
router.delete('/:id', deleteListing);
router.patch('/:id/deactivate', deactivateListing);

export default router;

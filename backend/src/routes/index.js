import { Router } from 'express'
import seatRoute from './seat.route.js';
import movieRoute from './movie.route.js';
import { esClient } from '../config/elastic.js';

const router = Router();

router.use("/movies", movieRoute)
router.use("/seat", seatRoute)
router.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json([]);

    const { hits } = await esClient.search({
        index: "movies",
        query: {
            match_phrase_prefix: { title: query }
        },
    });

    res.json(hits.hits.map(hit => hit._source));
});

export default router;
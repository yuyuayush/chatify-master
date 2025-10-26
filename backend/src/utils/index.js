export const dummyMovies = [
  {
    title: "Shutter Island",
    description: "A U.S. Marshal investigates a psychiatric facility on a remote island.",
    duration: 138,
    genre: "Thriller",
    releaseDate: "2010-02-19",
    trailerUrl: "https://www.youtube.com/watch?v=5iaYLCiq5RM",
    cast: ["Leonardo DiCaprio", "Mark Ruffalo", "Ben Kingsley", "Michelle Williams"],
    posterImage: "https://image.tmdb.org/t/p/original/oQ7x0qLvw4yyhFM9gD8ly0rj6C6.jpg",
    movieImages: [
      "https://image.tmdb.org/t/p/original/6j2bN3LhJHly2MTUqzYx3ik2c4e.jpg",
      "https://image.tmdb.org/t/p/original/xLrjWFF10nXQQ3F6y1m9eGAbxyd.jpg",
    ],
  },
  {
    title: "Gladiator",
    description: "A former Roman General seeks revenge after being betrayed and enslaved.",
    duration: 155,
    genre: "Action",
    releaseDate: "2000-05-05",
    trailerUrl: "https://www.youtube.com/watch?v=owK1qxDselE",
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen", "Oliver Reed"],
    posterImage: "https://image.tmdb.org/t/p/original/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    movieImages: [
      "https://image.tmdb.org/t/p/original/6V3A0l2PBRFeJtRlx3g6zA1QPtK.jpg",
      "https://image.tmdb.org/t/p/original/c8p0qz0e6lzt4xH6gJpPSXWocSu.jpg",
    ],
  },
  {
    title: "Jurassic Park",
    description: "Scientists clone dinosaurs to create a theme park, but chaos ensues.",
    duration: 127,
    genre: "Adventure",
    releaseDate: "1993-06-11",
    trailerUrl: "https://www.youtube.com/watch?v=lc0UehYemQA",
    cast: ["Sam Neill", "Laura Dern", "Jeff Goldblum", "Richard Attenborough"],
    posterImage: "https://image.tmdb.org/t/p/original/6ap9EPYxWc05Y5D5NoP3KA7e2mP.jpg",
    movieImages: [
      "https://image.tmdb.org/t/p/original/9i3plLl89DHMz7mahksDaAo7HIS.jpg",
      "https://image.tmdb.org/t/p/original/4N4b2J6ESRyzlF6X5r2EB4oO0C0.jpg",
    ],
  },
  {
    title: "Fight Club",
    description: "An insomniac office worker forms an underground fight club.",
    duration: 139,
    genre: "Drama",
    releaseDate: "1999-10-15",
    trailerUrl: "https://www.youtube.com/watch?v=SUXWAEX2jlg",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
    posterImage: "https://image.tmdb.org/t/p/original/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    movieImages: [
      "https://image.tmdb.org/t/p/original/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "https://image.tmdb.org/t/p/original/j7MGtQXQZ7aMw36CqZ7z3k63WZP.jpg",
    ],
  },
  {
    title: "The Avengers",
    description: "Earth's mightiest heroes team up to stop Loki and save the planet.",
    duration: 143,
    genre: "Action",
    releaseDate: "2012-05-04",
    trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Mark Ruffalo"],
    posterImage: "https://image.tmdb.org/t/p/original/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    movieImages: [
      "https://image.tmdb.org/t/p/original/AfK4yNJwq6vWTZ9F9q2jZURi5eG.jpg",
      "https://image.tmdb.org/t/p/original/qVx1MNqfOp2DrJ6cN6bM7gf3EyT.jpg",
    ],
  },
];



export const SEAT_STATUS = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  BOOKED: "BOOKED",
  BLOCKED: "BLOCKED",
};

export const SEAT_LOCK_DURATION = 10 * 60 * 1000; // 15 minutes in milliseconds
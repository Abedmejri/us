export const romanticPoetry = [
    "You are the poem I never knew how to write, and this life is the story I've always wanted to tell.",
    "In your smile, I see something more beautiful than the stars.",
    "Your love is like a calm sea in a world of storms.",
    "Every atom of my being belongs to you, and every breath I take carries your name.",
    "If I had a flower for every time I thought of you, I could walk through my garden forever.",
    "You are my today and all of my tomorrows.",
    "To the world, you may be one person, but to me, you are the world.",
    "Loving you is as natural as breathing, and as vital as life itself.",
    "Each day I love you more, today more than yesterday and less than tomorrow.",
    "I loved you yesterday, love you still, always have, always will.",
    "Your heart and my heart are very old friends.",
    "Somewhere between our laughs, long talks, and little fights, I fell in love."
];

export const getRandomPoem = () => {
    return romanticPoetry[Math.floor(Math.random() * romanticPoetry.length)];
};

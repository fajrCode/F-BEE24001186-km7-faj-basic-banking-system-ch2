import ImageKit from "imagekit";

export const imagekit =
    process.env.NODE_ENV === 'test'
        ? { upload: jest.fn() }
        : new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
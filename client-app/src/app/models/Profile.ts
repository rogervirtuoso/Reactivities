

export interface IProfile {
    displayName: string,
    userName: string,
    bio: string,
    image: string,
    photos: IPhoto[],
}

interface IPhoto {
    id: string,
    url: string,
    isMain: string,

}